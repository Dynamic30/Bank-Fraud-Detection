"""Prevention calls: an ElevenLabs Conversational AI agent phones accounts that score as likely mules.

The agent's language (Hindi), voice and prompt are set on the ElevenLabs agent. Its prompt can use the dynamic variables
{{holder_name}} and {{bank_name}}, and it should collect a data item with the identifier `outcome` whose value is
admitted, denied, unsure or noanswer. Environment: ELEVENLABS_API_KEY, ELEVENLABS_AGENT_ID and ELEVENLABS_PHONE_NUMBER_ID
(all required, else no calls are made) and ELEVENLABS_TEST_NUMBER (optional: every call goes to that number instead of
the account holder's). A run starts all its calls together, so a test number rings once per eligible account at the same time.
"""
import json
import logging
import os
import re
import time
import urllib.request

from pipeline.audit import write_audit
from pipeline.bank_connections.bank_database import phone_of
from pipeline.models.mule_detector import setting

API = "https://api.elevenlabs.io/v1/convai"
REQUIRED_ENV = ("ELEVENLABS_API_KEY", "ELEVENLABS_AGENT_ID", "ELEVENLABS_PHONE_NUMBER_ID")
ACTOR = "system:prevention_call"
LOCK_KEY = 7_770_002
POLL_SECONDS = 5
DEADLINE_SECONDS = 600
OUTCOMES = ("admitted", "denied", "unsure", "noanswer")
log = logging.getLogger(__name__)


def eleven(method, path, body=None):
    req = urllib.request.Request(
        API + path, method=method, data=json.dumps(body).encode() if body else None,
        headers={"xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": "application/json", "User-Agent": "peecha"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.load(resp)


def e164(phone):
    s = (phone or "").strip()
    digits = re.sub(r"\D", "", s)
    if s.startswith("+"):
        return "+" + digits if 8 <= len(digits) <= 15 else None
    national = re.sub(r"^(91|0)(?=\d{10}$)", "", digits)
    return "+91" + national if re.fullmatch(r"[6-9]\d{9}", national) else None


def outcome_of(conv):
    # the agent's own `outcome` data-collection value when valid; else a failed call or no user speech -> noanswer, anything else -> unsure
    analysis = conv.get("analysis") or {}
    value = str(((analysis.get("data_collection_results") or {}).get("outcome") or {}).get("value")).strip().lower()
    if value in OUTCOMES:
        return value
    spoke = any(m.get("role") == "user" and (m.get("message") or "").strip() for m in conv.get("transcript") or [])
    return "unsure" if spoke and conv.get("status") != "failed" else "noanswer"


def record(conn, account_id, conv, complaint_id, test_number):
    outcome = outcome_of(conv)
    summary = ((conv.get("analysis") or {}).get("transcript_summary") or "").strip()
    conn.execute("INSERT INTO prevention_calls (account_id, outcome, reply_label) VALUES (%s, %s, %s)",
                 (account_id, outcome, summary[:200] or None))
    write_audit(conn, ACTOR, "CALL", f"Prevention call to {account_id}: {outcome}" + (" (test number)" if test_number else ""),
                complaint_id)
    conn.commit()


def eligible(conn, account_ids):
    """Fetched bank accounts at or above call_from_score that were never called, highest score first."""
    rows = conn.execute(
        "SELECT a.account_id, a.holder_name, b.name FROM accounts a JOIN banks b ON b.id = a.bank_id "
        "JOIN account_scores s ON s.account_id = a.account_id "
        "WHERE a.account_id = ANY(%s) AND a.kind = 'bank' AND a.fetched_at IS NOT NULL AND s.score >= %s "
        "AND NOT EXISTS (SELECT 1 FROM prevention_calls c WHERE c.account_id = a.account_id) "
        "ORDER BY s.score DESC, a.account_id", (list(account_ids), float(setting(conn, "call_from_score", 40)))).fetchall()
    conn.commit()
    return rows


def place_call(account_id, name, bank, test_number):
    """Start one call and return its conversation id, or None (logged) when it could not be placed."""
    try:
        to = e164(test_number or phone_of(account_id))
        if not to:
            log.warning("prevention call to %s skipped: no usable phone number", account_id)
            return None
        res = eleven("POST", "/twilio/outbound-call", {
            "agent_id": os.environ["ELEVENLABS_AGENT_ID"], "agent_phone_number_id": os.environ["ELEVENLABS_PHONE_NUMBER_ID"],
            "to_number": to,
            "conversation_initiation_client_data": {"dynamic_variables": {"holder_name": name or "", "bank_name": bank}}})
        if not res.get("conversation_id"):
            log.warning("prevention call to %s not placed: %s", account_id, res.get("message"))
        return res.get("conversation_id")
    except Exception as e:
        log.warning("prevention call to %s not placed: %s", account_id, e)
        return None


def call_accounts(conn, account_ids, complaint_id=None):
    """Phone every eligible account once, ever; returns how many calls were recorded. Provider errors are logged, never raised."""
    if not all(os.environ.get(k) for k in REQUIRED_ENV):
        log.info("prevention calls are off: set %s", ", ".join(REQUIRED_ENV))
        return 0
    # a concurrent run would not yet see our calls and could phone the same account twice
    if not conn.execute("SELECT pg_try_advisory_lock(%s)", (LOCK_KEY,)).fetchone()[0]:
        return 0
    try:
        deadline = time.monotonic() + DEADLINE_SECONDS
        test_number = os.environ.get("ELEVENLABS_TEST_NUMBER")
        pending = {}
        for account_id, name, bank in eligible(conn, account_ids):
            conversation_id = place_call(account_id, name, bank, test_number)
            if conversation_id:
                pending[conversation_id] = account_id

        latest, recorded = {}, 0
        while pending:
            for conversation_id, account_id in list(pending.items()):
                try:
                    latest[conversation_id] = eleven("GET", f"/conversations/{conversation_id}")
                except Exception as e:
                    log.warning("prevention call to %s: status check failed: %s", account_id, e)
                conv = latest.get(conversation_id, {})
                if conv.get("status") in ("done", "failed") or time.monotonic() >= deadline:
                    del pending[conversation_id]
                    record(conn, account_id, conv, complaint_id, test_number)
                    recorded += 1
            if pending:
                time.sleep(POLL_SECONDS)
        return recorded
    finally:
        conn.rollback()
        conn.execute("SELECT pg_advisory_unlock(%s)", (LOCK_KEY,))
        conn.commit()
