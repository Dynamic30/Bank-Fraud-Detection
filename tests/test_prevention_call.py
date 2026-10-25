"""Prevention calls with ElevenLabs and the bank phone lookup replaced by fakes; the app database is real.

call_accounts commits, so the fixture commits its accounts and deletes them again afterwards.
"""
import io
import json
import urllib.error

import psycopg
import pytest

from pipeline import prevention_call as pc
from pipeline.bank_connections import bank_database
from pipeline.prevention_call import call_accounts, e164, outcome_of

from .util import OFFICER

HIGH, EDGE, BELOW = "SBI:9200000001", "HDFC:9200000002", "ICICI:9200000003"
STUB, UNSCORED, WALLET = "SBI:9200000004", "SBI:9200000005", "TRON:T" + "9" * 33
NO_PHONE, LEFT_OUT = "PNB:9200000006", "SBI:9200000007"
ACCOUNTS = [  # id, holder name, profile fetched, score
    (HIGH, "High Mule", True, 85), (EDGE, "Edge Mule", True, 40), (BELOW, "Below Mule", True, 39.99),
    (STUB, None, False, 90), (UNSCORED, "Unscored", True, None), (WALLET, None, True, 90),
    (NO_PHONE, "No Phone", True, 80), (LEFT_OUT, "Left Out", True, 95)]
ASKED = [HIGH, EDGE, BELOW, STUB, UNSCORED, WALLET]  # LEFT_OUT scores high but is not in the traced graph
HOLDER_ACCOUNT = {holder: account_id for account_id, holder, _, _ in ACCOUNTS if holder}
PHONES = {HIGH: "98765 00001", EDGE: "+91 98765-00002", NO_PHONE: "n/a"}
NUMBERS = {HIGH: "+919876500001", EDGE: "+919876500002"}
ENV = {"ELEVENLABS_API_KEY": "key", "ELEVENLABS_AGENT_ID": "agent_1", "ELEVENLABS_PHONE_NUMBER_ID": "phnum_1"}


def conversation(status="done", said=None, outcome=None, summary=""):
    """What GET /conversations/{id} returns; `said` is what the person answered."""
    transcript = [{"role": "agent", "message": "Namaste"}] + ([{"role": "user", "message": said}] if said is not None else [])
    results = {"outcome": {"data_collection_id": "outcome", "value": outcome, "rationale": "r"}} if outcome else {}
    return {"status": status, "transcript": transcript,
            "analysis": {"call_successful": "success", "transcript_summary": summary, "data_collection_results": results}}


class Provider:
    """Stands in for ElevenLabs and the bank phone lookup. The conversation of a call is `conv_` plus the account id."""

    def __init__(self):
        self.requests, self.lookups, self.replies = [], [], {}

    def phone_of(self, account_id):
        self.lookups.append(account_id)
        return PHONES[account_id]

    def eleven(self, method, path, body=None):
        self.requests.append((method, path, body))
        if method == "POST":
            account_id = HOLDER_ACCOUNT[body["conversation_initiation_client_data"]["dynamic_variables"]["holder_name"]]
            return {"success": True, "message": "Call initiated successfully", "conversation_id": "conv_" + account_id, "callSid": "CA1"}
        replies = self.replies.get(path.rsplit("conv_", 1)[1]) or [conversation()]  # default: nobody picked up
        return replies.pop(0) if len(replies) > 1 else replies[0]

    @property
    def posts(self):
        return [body for method, _, body in self.requests if method == "POST"]

    @property
    def gets(self):
        return [path for method, path, _ in self.requests if method == "GET"]


@pytest.fixture
def provider(monkeypatch):
    for name, value in ENV.items():
        monkeypatch.setenv(name, value)
    monkeypatch.delenv("ELEVENLABS_TEST_NUMBER", raising=False)
    monkeypatch.setattr(pc, "POLL_SECONDS", 0)
    fake = Provider()
    monkeypatch.setattr(pc, "eleven", fake.eleven)
    monkeypatch.setattr(pc, "phone_of", fake.phone_of)
    return fake


@pytest.fixture
def conn(db_url):
    c = psycopg.connect(db_url)
    ids = [a[0] for a in ACCOUNTS]
    for account_id, holder, fetched, score in ACCOUNTS:
        wallet = account_id.startswith("TRON:")
        c.execute("INSERT INTO accounts (account_id, kind, bank_id, wallet_kind, holder_name, fetched_at) VALUES (%s, %s, %s, %s, %s, %s)",
                  (account_id, "wallet" if wallet else "bank", None if wallet else account_id.split(":")[0],
                   "private" if wallet else None, holder, "2026-10-20 10:00" if fetched else None))
        if score is not None:
            c.execute("INSERT INTO account_scores (account_id, score) VALUES (%s, %s)", (account_id, score))
    c.commit()
    yield c
    c.rollback()
    c.execute("DELETE FROM account_scores WHERE account_id = ANY(%s)", (ids,))
    c.execute("DELETE FROM accounts WHERE account_id = ANY(%s)", (ids,))
    c.execute("UPDATE settings SET value = '40'::jsonb WHERE key = 'call_from_score'")
    c.commit()
    c.close()


def calls(conn):
    return conn.execute("SELECT account_id, outcome, reply_label FROM prevention_calls ORDER BY id").fetchall()


def lock_is_free(db_url):
    with psycopg.connect(db_url, autocommit=True) as other:
        return other.execute("SELECT pg_try_advisory_lock(%s)", (pc.LOCK_KEY,)).fetchone()[0]


@pytest.mark.parametrize("name", list(ENV))
@pytest.mark.parametrize("blank", [True, False])
def test_a_missing_or_blank_setting_means_no_calls(conn, provider, monkeypatch, name, blank):
    if blank:
        monkeypatch.setenv(name, "")
    else:
        monkeypatch.delenv(name)
    assert call_accounts(conn, ASKED) == 0
    assert provider.requests == [] and provider.lookups == [] and calls(conn) == []


def test_calls_fetched_bank_accounts_scoring_at_or_above_call_from_score_best_first(conn, provider):
    assert call_accounts(conn, ASKED) == 2
    assert provider.lookups == [HIGH, EDGE]
    assert provider.posts[0]["to_number"] == NUMBERS[HIGH] and provider.posts[1]["to_number"] == NUMBERS[EDGE]
    assert [row[0] for row in calls(conn)] == [HIGH, EDGE]


@pytest.mark.parametrize("threshold, called", [(40, [HIGH, EDGE]), (40.01, [HIGH]), (85, [HIGH]), (85.01, [])])
def test_the_call_from_score_setting_moves_the_cut(conn, provider, threshold, called):
    conn.execute("UPDATE settings SET value = %s::jsonb WHERE key = 'call_from_score'", (str(threshold),))
    conn.commit()
    assert call_accounts(conn, ASKED) == len(called)
    assert provider.lookups == called


def test_the_request_names_the_agent_the_number_and_the_holder(conn, provider):
    call_accounts(conn, [HIGH])
    assert provider.requests[0] == ("POST", "/twilio/outbound-call", {
        "agent_id": "agent_1", "agent_phone_number_id": "phnum_1", "to_number": NUMBERS[HIGH],
        "conversation_initiation_client_data": {"dynamic_variables": {"holder_name": "High Mule", "bank_name": "State Bank of India"}}})


def test_each_account_is_called_once_ever(conn, provider):
    conn.execute("INSERT INTO prevention_calls (account_id, outcome) VALUES (%s, 'denied')", (EDGE,))  # logged by hand
    conn.commit()
    assert call_accounts(conn, ASKED) == 1
    assert call_accounts(conn, ASKED) == 0
    assert provider.lookups == [HIGH]
    assert [row[0] for row in calls(conn)] == [EDGE, HIGH]


def test_the_test_number_replaces_every_holders_number(conn, provider, monkeypatch):
    monkeypatch.setenv("ELEVENLABS_TEST_NUMBER", "+44 7911 123456")
    assert call_accounts(conn, ASKED, "C-3001") == 2
    assert [body["to_number"] for body in provider.posts] == ["+447911123456"] * 2
    assert provider.lookups == []
    texts = [row[0] for row in conn.execute("SELECT text FROM audit_log ORDER BY seq")]
    assert texts == [f"Prevention call to {a}: noanswer (test number)" for a in (HIGH, EDGE)]


def test_an_account_without_a_usable_number_is_skipped_and_stays_eligible(conn, provider, caplog):
    assert call_accounts(conn, [NO_PHONE, HIGH]) == 1
    assert provider.lookups == [HIGH, NO_PHONE] and len(provider.posts) == 1
    assert [row[0] for row in calls(conn)] == [HIGH]
    assert f"prevention call to {NO_PHONE} skipped" in caplog.text


def test_polls_until_the_call_is_done_and_stores_what_the_agent_collected(conn, provider):
    provider.replies = {
        HIGH: [conversation("in-progress", said="Haan"), conversation(said="Haan", outcome="admitted", summary="Admitted lending the account")],
        EDGE: [conversation(said="Pata nahi")]}
    assert call_accounts(conn, ASKED) == 2
    assert calls(conn) == [(EDGE, "unsure", None), (HIGH, "admitted", "Admitted lending the account")]  # each as soon as it is done
    assert provider.gets.count(f"/conversations/conv_{HIGH}") == 2
    row = conn.execute("SELECT called_by, called_at FROM prevention_calls WHERE account_id = %s", (HIGH,)).fetchone()
    assert row[0] is None and row[1] is not None


def test_a_long_summary_is_cut_to_fit_the_reply_label(conn, provider):
    provider.replies = {HIGH: [conversation(said="Haan", summary="x" * 500)]}
    call_accounts(conn, [HIGH])
    assert len(calls(conn)[0][2]) == 200


@pytest.mark.parametrize("conv, expected", [
    (conversation(said="Haan", outcome="admitted"), "admitted"),
    (conversation(said="Nahi", outcome=" Denied "), "denied"),
    (conversation(said="Haan", outcome="noanswer"), "noanswer"),
    (conversation(outcome="unsure"), "unsure"),
    (conversation(said="Haan", outcome="maybe"), "unsure"),
    (conversation(outcome="maybe"), "noanswer"),
    (conversation(said="Haan"), "unsure"),
    (conversation(), "noanswer"),
    (conversation(said="  "), "noanswer"),
    (conversation("failed", said="Haan"), "noanswer"),
    ({"analysis": {"data_collection_results": {"outcome": {"value": None}}}}, "noanswer"),
    ({"status": "failed", "transcript": None, "analysis": None}, "noanswer"),
    ({}, "noanswer")])
def test_outcome_mapping(conv, expected):
    assert outcome_of(conv) == expected


def test_a_recorded_call_writes_an_audit_row_the_chain_accepts(conn, provider, client):
    provider.replies = {HIGH: [conversation(said="Haan", outcome="admitted")]}
    assert call_accounts(conn, [HIGH], "C-3001") == 1
    assert conn.execute("SELECT actor, kind, complaint_id, text FROM audit_log").fetchall() == [
        ("system:prevention_call", "CALL", "C-3001", f"Prevention call to {HIGH}: admitted")]
    assert client.get("/api/audit/verify", headers=OFFICER).json()["ok"] is True
    assert [c["account_id"] for c in client.get("/api/calls", headers=OFFICER).json()] == [HIGH]


def test_a_provider_that_refuses_is_logged_and_never_raises(conn, provider, monkeypatch, caplog):
    def eleven(method, path, body=None):
        raise urllib.error.HTTPError(pc.API + path, 401, "Unauthorized", {}, None)

    monkeypatch.setattr(pc, "eleven", eleven)
    assert call_accounts(conn, ASKED) == 0
    assert calls(conn) == []
    assert f"prevention call to {HIGH} not placed: HTTP Error 401" in caplog.text


def test_a_call_the_provider_did_not_start_is_not_recorded(conn, provider, monkeypatch, caplog):
    monkeypatch.setattr(pc, "eleven", lambda *args: {"success": False, "message": "Too many concurrent calls", "conversation_id": None})
    assert call_accounts(conn, ASKED) == 0
    assert calls(conn) == []
    assert "Too many concurrent calls" in caplog.text


def test_a_call_whose_status_cannot_be_read_is_recorded_when_the_deadline_passes(conn, provider, monkeypatch, caplog):
    def eleven(method, path, body=None):
        if method == "GET":
            raise TimeoutError("read timed out")
        return provider.eleven(method, path, body)

    monkeypatch.setattr(pc, "eleven", eleven)
    monkeypatch.setattr(pc, "DEADLINE_SECONDS", 0)
    assert call_accounts(conn, [HIGH]) == 1
    assert calls(conn) == [(HIGH, "noanswer", None)]
    assert "status check failed: read timed out" in caplog.text


def test_a_run_in_progress_blocks_a_second_one(conn, provider, db_url):
    with psycopg.connect(db_url, autocommit=True) as other:
        other.execute("SELECT pg_advisory_lock(%s)", (pc.LOCK_KEY,))
        assert call_accounts(conn, ASKED) == 0
        assert provider.requests == []
    assert call_accounts(conn, ASKED) == 2


def test_the_lock_is_released_after_a_run_and_after_a_failure(conn, provider, db_url, monkeypatch):
    assert call_accounts(conn, [HIGH]) == 1
    assert lock_is_free(db_url)

    def audit_down(*args):
        raise RuntimeError("audit log down")

    monkeypatch.setattr(pc, "write_audit", audit_down)
    with pytest.raises(RuntimeError, match="audit log down"):
        call_accounts(conn, [EDGE])
    assert calls(conn) == [(HIGH, "noanswer", None)]  # the failed call left nothing half written
    assert lock_is_free(db_url)


@pytest.mark.parametrize("phone, expected", [
    ("9876543210", "+919876543210"), ("98765 43210", "+919876543210"), ("+91 98765-43210", "+919876543210"),
    ("919876543210", "+919876543210"), ("09876543210", "+919876543210"), ("+44 7911 123456", "+447911123456"),
    ("5876543210", None), ("98765", None), ("+123", None), ("n/a", None), ("", None), (None, None)])
def test_phone_numbers_are_sent_in_e164(phone, expected):
    assert e164(phone) == expected


def test_eleven_sends_the_documented_requests(monkeypatch):
    sent = []

    def urlopen(req, timeout):
        sent.append(req)
        return io.BytesIO(b'{"conversation_id": "conv_1"}')

    monkeypatch.setattr(pc.urllib.request, "urlopen", urlopen)
    monkeypatch.setenv("ELEVENLABS_API_KEY", "secret")
    assert pc.eleven("POST", "/twilio/outbound-call", {"to_number": "+919876543210"}) == {"conversation_id": "conv_1"}
    assert pc.eleven("GET", "/conversations/conv_1") == {"conversation_id": "conv_1"}
    post, get = sent
    assert (post.get_method(), post.full_url) == ("POST", "https://api.elevenlabs.io/v1/convai/twilio/outbound-call")
    assert json.loads(post.data) == {"to_number": "+919876543210"}
    assert post.get_header("Xi-api-key") == "secret" and post.get_header("Content-type") == "application/json"
    assert (get.get_method(), get.full_url, get.data) == ("GET", "https://api.elevenlabs.io/v1/convai/conversations/conv_1", None)


def test_phone_of_hands_back_the_raw_phone_and_keeps_none_of_it(monkeypatch):
    def bank(no, until=None):
        return [bank_database.profile("SBI", no, "Holder", None, None, None, "Pune", None, None, None, "9876543210", until)], []

    monkeypatch.setitem(bank_database.BANKS, "SBI", bank)
    monkeypatch.setattr(bank_database, "IFSC", {"SBIN": "SBI"})  # banks already loaded
    assert bank_database.phone_of("SBI:111") == "9876543210"
    assert bank_database.PHONES == {}
    accounts, _ = bank("111")  # an ordinary pull neither returns nor remembers the raw phone
    assert accounts[0]["phone_masked"] == "••3210" and bank_database.PHONES == {}

    def missing(no, until=None):
        raise LookupError("no account")

    monkeypatch.setitem(bank_database.BANKS, "SBI", missing)
    with pytest.raises(LookupError):
        bank_database.phone_of("SBI:111")
    assert bank_database.PHONES == {}
