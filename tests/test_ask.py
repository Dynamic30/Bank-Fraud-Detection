import json
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

import pytest

from backend.app.routers.ask import ASK_PROMPT, CANNED, DRAFT_PROMPT, AskIn, ask

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


def test_provider_error_falls_back(provider):
    _, state = provider
    state["status"], state["body"] = 500, {"error": "down"}
    assert ask(AskIn(question="q")) == {"answer": CANNED}
    assert ask(AskIn(question="rough", task="draft")) == {"answer": "rough"}


def test_answer_without_text_falls_back(provider):
    _, state = provider
    state["body"] = {"status": "completed", "output": [{"type": "message", "content": [{"type": "refusal", "refusal": "no"}]}]}
    assert ask(AskIn(question="q")) == {"answer": CANNED}


@pytest.mark.parametrize("missing", ["LLM_API_KEY", "LLM_MODEL"])
def test_not_configured_makes_no_request(provider, monkeypatch, missing):
    seen, _ = provider
    monkeypatch.delenv(missing)
    assert ask(AskIn(question="q")) == {"answer": CANNED}
    assert seen == []
