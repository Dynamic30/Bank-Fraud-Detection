import json
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

import pytest

from backend.app.routers.ask import ASK_PROMPT, CANNED, DEFAULT_MODEL, DRAFT_PROMPT, AskIn, ask
from tests.util import CONSUMER1, OFFICER

REPLY = {"id": "resp_1", "object": "response", "status": "completed", "output": [
    {"type": "reasoning", "summary": []},
    {"type": "message", "role": "assistant", "content": [{"type": "output_text", "text": "Hold "}, {"type": "output_text", "text": "HDFC:2 now. "}]}]}


@pytest.fixture(autouse=True)
def clean():
    yield


@pytest.fixture
def provider(monkeypatch):
    seen, state = [], {"status": 200, "body": REPLY}

    class Handler(BaseHTTPRequestHandler):
        def do_POST(self):
            seen.append((self.path, self.headers["Authorization"], json.loads(self.rfile.read(int(self.headers["Content-Length"])))))
            payload = json.dumps(state["body"]).encode()
            self.send_response(state["status"])
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)

        def log_message(self, *args):
            pass

    server = HTTPServer(("127.0.0.1", 0), Handler)
    threading.Thread(target=server.serve_forever, daemon=True).start()
    monkeypatch.setenv("LLM_PROVIDER_URL", f"http://127.0.0.1:{server.server_port}")
    monkeypatch.setenv("LLM_API_KEY", "secret")
    monkeypatch.setenv("LLM_MODEL", "some-model")
    yield seen, state
    server.shutdown()


def test_question_goes_to_the_responses_api_and_the_text_comes_back(provider):
    seen, _ = provider
    assert ask(AskIn(question="what next?", context={"case": "C-3001"})) == {"answer": "Hold HDFC:2 now."}
    path, auth, body = seen[0]
    assert (path, auth) == ("/api/v1/responses", "Bearer secret")
    assert body["model"] == "some-model" and body["instructions"] == ASK_PROMPT and body["max_output_tokens"] == 2048
    assert "what next?" in body["input"] and "C-3001" in body["input"]


def test_draft_task_sends_the_text_as_is(provider):
    seen, _ = provider
    ask(AskIn(question="rough draft", task="draft"))
    assert seen[0][2]["instructions"] == DRAFT_PROMPT and seen[0][2]["input"] == "rough draft"


def test_provider_error_says_why_instead_of_not_set_up(provider):
    _, state = provider
    state["status"], state["body"] = 500, {"error": "down"}
    out = ask(AskIn(question="q"))["answer"]
    assert "set up, but" in out and "500" in out and out != CANNED
    assert ask(AskIn(question="rough", task="draft")) == {"answer": "rough"}


@pytest.mark.parametrize("status, hint", [(401, "LLM_API_KEY"), (403, "LLM_API_KEY"), (404, "LLM_MODEL"), (429, "rate limiting")])
def test_provider_refusals_point_at_the_setting(provider, status, hint):
    _, state = provider
    state["status"], state["body"] = status, {"error": "no"}
    assert hint in ask(AskIn(question="q"))["answer"]


def test_unreachable_provider_is_reported(provider, monkeypatch):
    monkeypatch.setenv("LLM_PROVIDER_URL", "http://127.0.0.1:1")
    assert "could not be reached" in ask(AskIn(question="q"))["answer"]


def test_answer_without_text_is_not_reported_as_unconfigured(provider):
    _, state = provider
    state["body"] = {"status": "completed", "output": [{"type": "message", "content": [{"type": "refusal", "refusal": "no"}]}]}
    out = ask(AskIn(question="q"))["answer"]
    assert "answered with nothing" in out and out != CANNED


def test_no_key_makes_no_request(provider, monkeypatch):
    seen, _ = provider
    monkeypatch.delenv("LLM_API_KEY")
    assert ask(AskIn(question="q")) == {"answer": CANNED}
    assert ask(AskIn(question="rough", task="draft")) == {"answer": "rough"}
    assert seen == []


def test_blank_key_counts_as_missing(provider, monkeypatch):
    seen, _ = provider
    monkeypatch.setenv("LLM_API_KEY", "   ")
    assert ask(AskIn(question="q")) == {"answer": CANNED}
    assert seen == []


def test_missing_model_uses_the_default(provider, monkeypatch):
    seen, _ = provider
    monkeypatch.delenv("LLM_MODEL")
    assert ask(AskIn(question="q")) == {"answer": "Hold HDFC:2 now."}
    assert seen[0][2]["model"] == DEFAULT_MODEL


@pytest.mark.parametrize("name", ["LLM_API_KEY", "llm_api_key", "LLM-API-KEY", "LLM API KEY", "LLMAPIKEY", "Llm_Api_Key",
                                  "LLM_API", "LLM_KEY", "LLM_TOKEN", "ADAPTION_API_KEY"])
def test_key_is_found_under_any_spelling(provider, monkeypatch, name):
    seen, _ = provider
    monkeypatch.delenv("LLM_API_KEY")
    monkeypatch.setenv(name, "from-" + name)
    assert ask(AskIn(question="q")) == {"answer": "Hold HDFC:2 now."}
    assert seen[0][1] == "Bearer from-" + name


@pytest.mark.parametrize("name", ["LLM_MODEL", "llm-model", "LLM MODEL", "LLM_MODEL_NAME", "ADAPTION_MODEL"])
def test_model_is_found_under_any_spelling(provider, monkeypatch, name):
    seen, _ = provider
    monkeypatch.delenv("LLM_MODEL")
    monkeypatch.setenv(name, "picked-model")
    ask(AskIn(question="q"))
    assert seen[0][2]["model"] == "picked-model"


def test_provider_url_is_found_under_another_name(provider, monkeypatch):
    seen, _ = provider
    url = __import__("os").environ["LLM_PROVIDER_URL"]
    monkeypatch.delenv("LLM_PROVIDER_URL")
    monkeypatch.setenv("llm-base-url", url)
    assert ask(AskIn(question="q")) == {"answer": "Hold HDFC:2 now."}
    assert len(seen) == 1


def test_exact_name_wins_over_a_look_alike(provider, monkeypatch):
    seen, _ = provider
    monkeypatch.setenv("llm-api-key", "look-alike")
    ask(AskIn(question="q"))
    assert seen[0][1] == "Bearer secret"


def test_key_value_is_trimmed(provider, monkeypatch):
    seen, _ = provider
    monkeypatch.setenv("LLM_API_KEY", "  secret\n")
    ask(AskIn(question="q"))
    assert seen[0][1] == "Bearer secret"


def test_status_says_what_was_found_and_never_shows_the_key(provider, monkeypatch, client):
    monkeypatch.setenv("LLM_API_KEY", "super-secret-value")
    r = client.get("/api/ask/status", headers=OFFICER)
    assert r.status_code == 200
    body = r.json()
    assert body["ready"] is True and body["key_found_as"] == "LLM_API_KEY" and body["model"] == "some-model"
    assert "LLM_API_KEY" in body["related_names_on_server"]
    assert "super-secret-value" not in r.text and "probe" not in body


def test_status_when_nothing_is_set(client, monkeypatch):
    for name in ("LLM_API_KEY", "LLM_MODEL", "LLM_PROVIDER_URL"):
        monkeypatch.delenv(name, raising=False)
    body = client.get("/api/ask/status", headers=OFFICER).json()
    assert body["ready"] is False and body["key_found_as"] is None and body["model"] == DEFAULT_MODEL


def test_status_probe_reports_a_good_and_a_bad_key(provider, client):
    _, state = provider
    assert client.get("/api/ask/status?probe=true", headers=OFFICER).json()["probe"] == {"ok": True}
    state["status"], state["body"] = 401, {"error": "bad key"}
    probe = client.get("/api/ask/status?probe=true", headers=OFFICER).json()["probe"]
    assert probe["ok"] is False and probe["status"] == 401 and "LLM_API_KEY" in probe["why"]


def test_status_hides_variable_names_from_non_officers_and_needs_sign_in(provider, client):
    body = client.get("/api/ask/status", headers=CONSUMER1).json()
    assert body["ready"] is True and "related_names_on_server" not in body
    assert client.get("/api/ask/status").status_code in (401, 403)
