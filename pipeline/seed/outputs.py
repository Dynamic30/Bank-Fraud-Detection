"""Files written next to (not inside) the databases: ground truth and the complaints a loader will import later."""
from __future__ import annotations

import csv
import random
from datetime import datetime
from pathlib import Path

from .config import UTC
from .crypto import Crypto
from .scenarios import Scenarios
from .world import World

TRUTH_COLS = ("account_ref", "is_mule", "mule_type", "ring_id", "difficulty", "active_from", "active_to", "segment")
COMPLAINT_COLS = ("id", "ack_no", "channel", "name", "email_1", "email_2", "phone_1", "phone_2", "city",
                  "victim_account_id", "victim_upi_id", "scam_type", "incident_description", "total_lost", "fraud_time",
                  "reported_at", "scammer_phone", "scammer_upi_id", "scammer_account_no", "filed_by", "owner_user_id",
                  "filed_via", "status", "last_traced_at")
PAYMENT_COLS = ("complaint_id", "amount", "paid_at", "destination_type", "utr", "paid_to_upi_id", "paid_to_account_no",
                "paid_to_account_id", "crypto_chain", "crypto_asset", "wallet_address", "exchange_name", "crypto_tx_hash",
                "matched", "matched_transfer_id")

DESCRIPTIONS = {
    "digital_arrest": [
        "Caller claimed to be from CBI/customs and said a parcel in my name had drugs. Kept me on a video call and made me transfer money to a 'safe account' for verification.",
        "Received a call that my Aadhaar was used in a money laundering case. Told not to disconnect the call and to move my savings to an RBI verification account."],
    "investment_task": [
        "Added to a trading group on Telegram, shown fake profits on an app and asked to deposit more to withdraw. Could not withdraw anything.",
        "Joined an online investment scheme promising daily returns. Paid several times to unlock withdrawals, then they stopped responding."],
    "kyc_update": [
        "Got a call saying my bank account would be blocked unless I updated KYC. Shared OTP and paid a small fee, then money left my account.",
        "SMS said KYC pending, clicked the link and entered details. Amount was debited soon after."],
    "sextortion": [
        "Video call from an unknown woman, then a recorded clip was used to threaten me. Paid repeatedly to stop it being shared.",
        "Blackmailed with an edited video and asked for money to delete it."],
    "upi_collect": [
        "Selling an item online, the buyer sent a collect request and I approved it thinking I would receive money. Amount was debited.",
        "Received a UPI collect request marked as refund, approved it and lost money."],
    "job_part_time": [
        "Offered a part-time job rating products. Paid deposits for tasks that were later refused for refund.",
        "Online job offer asked for registration fee and task deposits; never received the promised commission."],
}


def iso(ts: int) -> str:
    return datetime.fromtimestamp(ts, UTC).strftime("%Y-%m-%dT%H:%M:%SZ")


def naive(ts: int) -> str:
    return datetime.fromtimestamp(ts, UTC).strftime("%Y-%m-%d %H:%M:%S")


def write_truth(path: Path, world: World, crypto: Crypto) -> int:
    path.parent.mkdir(parents=True, exist_ok=True)
    n = 0
    with path.open("w", newline="") as fh:
        wr = csv.writer(fh)
        wr.writerow(TRUTH_COLS)
        for a in world.accts:
            mule = a.segment == "mule"
            wr.writerow([a.ref, int(mule), a.mule_type if mule else "", a.ring if mule else "", a.difficulty if mule else "",
                         iso(a.first_scam) if mule else "", iso(a.last_scam) if mule else "", a.segment])
            n += 1
        for w in crypto.wallets.values():
            seg = "infrastructure" if w.kind in ("exchange_hot", "exchange_deposit", "bridge", "mixer") else w.segment
            wr.writerow([f"TRON:{w.address}", int(w.mule), w.mule_type if w.mule else "", w.ring if w.mule else "",
                         "", iso(w.first) if w.mule and w.first else "", iso(w.last) if w.mule and w.last else "", seg])
            n += 1
    return n


def write_complaints(out_dir: Path, world: World, sc: Scenarios, crypto: Crypto, rng: random.Random) -> tuple[int, int]:
    out_dir.mkdir(parents=True, exist_ok=True)
    st, accts = world.store, world.accts
    sellers = {s.acct: s for s in crypto.sellers}
    used_phone: set[str] = set()
    nc = npay = 0
    with (out_dir / "complaints.csv").open("w", newline="") as fc, (out_dir / "complaint_payments.csv").open("w", newline="") as fp:
        wc, wp = csv.writer(fc), csv.writer(fp)
        wc.writerow(COMPLAINT_COLS)
        wp.writerow(PAYMENT_COLS)
        for v in sorted(sc.complaints, key=lambda v: v.cid):
            a = accts[v.acct]
            p = world.person(a)
            first = v.pays[0]
            tgt = accts[first.target]
            total = sum(x.amt for x in v.pays)
            scammer_acct = None if v.seller_dest else tgt
            ph = f"{rng.choice('6789')}{rng.randrange(10**9):09d}"
            while ph in used_phone:
                ph = f"{rng.choice('6789')}{rng.randrange(10**9):09d}"
            used_phone.add(ph)
            d = datetime.fromtimestamp(first.ts, UTC)
            ack = f"316{d:%y}{d.timetuple().tm_yday:03d}{rng.randrange(10**6):06d}"
            wc.writerow([v.cid, ack, v.channel, p.name, p.email, "", p.phone, "", p.city, a.ref, a.vpa, v.scam,
                         rng.choice(DESCRIPTIONS[v.scam]), f"{total // 100}.{total % 100:02d}", naive(first.ts), naive(v.reported_at),
                         ph if (rng.random() < 0.7 or v.cid == "C-3021") else "",
                         scammer_acct.vpa if scammer_acct and rng.random() < 0.5 else "",
                         scammer_acct.no if scammer_acct and rng.random() < 0.45 else "",
                         "", "", "bank" if v.channel == "bank" else "self", "open", ""])
            nc += 1
            for pay in v.pays:
                t = accts[pay.target]
                utr = st.utr[pay.tidx]
                know_utr, know_upi, know_acct = rng.random() < 0.8, rng.random() < 0.6, rng.random() < 0.5
                if not (know_utr or know_upi or know_acct):
                    know_utr = True
                if v.seller_dest:
                    s = sellers[pay.target]
                    wp.writerow([v.cid, f"{pay.amt // 100}.{pay.amt % 100:02d}", naive(pay.ts), "crypto", utr if know_utr else "",
                                 t.vpa if know_upi else "", "", "", "TRON", "USDT", pay.wallet, s.platform, pay.hash, "false", ""])
                else:
                    wp.writerow([v.cid, f"{pay.amt // 100}.{pay.amt % 100:02d}", naive(pay.ts), "bank", utr if know_utr else "",
                                 t.vpa if know_upi else "", t.no if know_acct else "", "", "", "", "", "", "", "false", ""])
                npay += 1
    return nc, npay
