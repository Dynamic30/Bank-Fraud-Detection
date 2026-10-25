"""Role scoping and masking, used by every router: require_access, scope (SQL row filter), mask.

Officers see everything. Bank users see their own bank unmasked and other banks as "HDFC ••1234".
Consumers see only their own complaints, every account masked, no scores.
"""
import re

from fastapi import HTTPException

from .auth import BANK_ROLES, CONSUMER, OFFICER, User

STAFF = frozenset({OFFICER, *BANK_ROLES})
EVERYONE = STAFF | {CONSUMER}

ACCESS = {
    "complaints": EVERYONE,
    "accounts": EVERYONE,
    "banks": EVERYONE,
    "account_detail": STAFF,
    "mules": STAFF,
    "holds": STAFF,
    "actions": STAFF,
    "calls": STAFF,
    "audit": STAFF,
    "settings": STAFF,
}

WALLET_PREFIX = "TRON"
REF_IN_TEXT = re.compile(r"\b(?:TRON:T[1-9A-HJ-NP-Za-km-z]{33}|[A-Z][A-Z0-9]{1,9}:\d{6,})\b")


def require_access(user: User, resource: str) -> None:
    if user.role not in ACCESS[resource]:
        raise HTTPException(403, f"{user.role} may not use {resource}")


def can_see_ref(user: User, ref: str | None) -> bool:
    if not ref or ref == "CASH" or user.is_officer:
        return True
    if user.is_bank:
        prefix = ref.partition(":")[0]
        return prefix in (WALLET_PREFIX, user.bank_id)
    return False


def mask_ref(user: User, ref: str | None) -> str | None:
    if can_see_ref(user, ref):
        return ref
    prefix, sep, rest = ref.partition(":")
    if not sep:
        prefix, rest = "BANK", ref
    return f"{prefix} ••{rest[-4:]}"


def mask_upi(upi: str | None) -> str | None:
    if not upi:
        return upi
    local, _, handle = upi.partition("@")
    return f"{local[:2]}••••@{handle}" if handle else "••••"


def mask_account_no(no: str | None) -> str | None:
    return f"••{no[-4:]}" if no else no


def mask_text(user: User, text: str | None) -> str | None:
    if not text or user.is_officer:
        return text
    return REF_IN_TEXT.sub(lambda m: mask_ref(user, m.group(0)), text)


def mask_json(user: User, value):
    if isinstance(value, str):
        return mask_text(user, value)
    if isinstance(value, list):
        return [mask_json(user, v) for v in value]
    if isinstance(value, dict):
        return {k: mask_json(user, v) for k, v in value.items()}
    return value


def complaint_scope(user: User) -> str:
    if user.is_officer:
        return "TRUE"
    if user.is_consumer:
        return "(c.owner_user_id = %(scope_uid)s OR c.filed_by = %(scope_uid)s)"
    return """(split_part(c.victim_account_id, ':', 1) = %(scope_bank)s
        OR c.filed_by IN (SELECT id FROM app_users WHERE bank_id = %(scope_bank)s)
        OR EXISTS (SELECT 1 FROM victim_mapping vm WHERE vm.complaint_id = c.id
                   AND (vm.from_bank = %(scope_bank)s OR vm.to_bank = %(scope_bank)s))
        OR EXISTS (SELECT 1 FROM complaint_payments cp WHERE cp.complaint_id = c.id
                   AND split_part(cp.paid_to_account_id, ':', 1) = %(scope_bank)s))"""


def account_scope(user: User) -> str:
    if user.is_officer:
        return "TRUE"
    if user.is_bank:
        return "a.bank_id = %(scope_bank)s"
    own = complaint_scope(user)
    return f"""a.account_id IN (
        SELECT vm.to_ref FROM victim_mapping vm JOIN complaints c ON c.id = vm.complaint_id WHERE {own}
        UNION
        SELECT vm.from_ref FROM victim_mapping vm JOIN complaints c ON c.id = vm.complaint_id WHERE {own})"""


def bank_scope(bank_pred: str):
    def build(user: User) -> str:
        return "TRUE" if user.is_officer else bank_pred if user.is_bank else "FALSE"
    return build


def complaint_child_scope(prefix: str):
    def build(user: User) -> str:
        if user.is_officer:
            return "TRUE"
        if user.is_bank:
            return f"{prefix}.complaint_id IN (SELECT c.id FROM complaints c WHERE {complaint_scope(user)})"
        return "FALSE"
    return build


def audit_scope(user: User) -> str:
    if user.is_officer:
        return "TRUE"
    if user.is_bank:
        return f"""(au.complaint_id IN (SELECT c.id FROM complaints c WHERE {complaint_scope(user)})
            OR au.actor IN (SELECT id FROM app_users WHERE bank_id = %(scope_bank)s))"""
    return "FALSE"


SCOPES = {
    "complaint": complaint_scope,
    "account": account_scope,
    "mule": bank_scope("m.bank_id = %(scope_bank)s"),
    "hold": bank_scope("h.bank_id = %(scope_bank)s"),
    "call": bank_scope("split_part(pc.account_id, ':', 1) = %(scope_bank)s"),
    "action": complaint_child_scope("ac"),
    "audit": audit_scope,
}


def scope(user: User, resource: str) -> tuple[str, dict]:
    return SCOPES[resource](user), {"scope_uid": user.id, "scope_bank": user.bank_id}


def visible_complaint(conn, user: User, complaint_id: str) -> dict | None:
    pred, params = scope(user, "complaint")
    return conn.execute(f"SELECT c.* FROM complaints c WHERE c.id = %(cid)s AND {pred}",
                        {**params, "cid": complaint_id}).fetchone()


def mask_complaint(user: User, r: dict) -> dict:
    return {**r, "victim_account_id": mask_ref(user, r["victim_account_id"]),
            "incident_description": mask_text(user, r["incident_description"])}


def mask_payment(user: User, r: dict) -> dict:
    ref = r["paid_to_account_id"]
    seen = can_see_ref(user, ref) if ref else user.is_officer
    return {**r, "paid_to_account_id": mask_ref(user, ref),
            "paid_to_account_no": r["paid_to_account_no"] if seen else mask_account_no(r["paid_to_account_no"]),
            "paid_to_upi_id": r["paid_to_upi_id"] if seen else mask_upi(r["paid_to_upi_id"])}


def mask_trail(user: User, r: dict) -> dict:
    return {**r, "from_ref": mask_ref(user, r["from_ref"]), "to_ref": mask_ref(user, r["to_ref"])}


def mask_account(user: User, r: dict) -> dict:
    if can_see_ref(user, r["account_id"]):
        return {**r, "masked": False, **({"reasons": mask_json(user, r["reasons"])} if "reasons" in r else {})}
    return {"account_id": mask_ref(user, r["account_id"]), "kind": r["kind"], "bank_id": r["bank_id"],
            "wallet_kind": r["wallet_kind"], "exchange_name": r["exchange_name"], "masked": True}


def mask_mule(user: User, r: dict) -> dict:
    seen = can_see_ref(user, r["account_id"])
    return {**r, "account_id": mask_ref(user, r["account_id"]), "upi_id": r["upi_id"] if seen else mask_upi(r["upi_id"])}


def mask_hold(user: User, r: dict) -> dict:
    return {**r, "account_id": mask_ref(user, r["account_id"]), "reason": mask_text(user, r["reason"])}


def mask_call(user: User, r: dict) -> dict:
    return {**r, "account_id": mask_ref(user, r["account_id"]), "reply_label": mask_text(user, r["reply_label"])}


def mask_action(user: User, r: dict) -> dict:
    return {**r, "target": mask_text(user, r["target"]), "draft_text": mask_text(user, r["draft_text"]),
            "final_text": mask_text(user, r["final_text"]), "targets": mask_json(user, r["targets"])}


def mask_audit(user: User, r: dict) -> dict:
    return {**r, "text": mask_text(user, r["text"])}


MASKERS = {"complaint": mask_complaint, "payment": mask_payment, "trail": mask_trail, "account": mask_account,
           "mule": mask_mule, "hold": mask_hold, "call": mask_call, "action": mask_action, "audit": mask_audit}


def mask(user: User, resource: str, data):
    fn = MASKERS[resource]
    return [fn(user, r) for r in data] if isinstance(data, list) else fn(user, data)
