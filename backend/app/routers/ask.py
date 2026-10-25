import json
import os
import re
from typing import Any

import adaption
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from ..auth import User, current_user

router = APIRouter(tags=["ask"])

# The copilot reads three settings. Each is found by any of these names, ignoring case and punctuation, so
# LLM_API_KEY, "llm-api-key" and LLMAPIKEY all work.
KEY_NAMES = ("LLM_API_KEY", "LLM_KEY", "LLM_API", "LLM_API_TOKEN", "LLM_TOKEN", "ADAPTION_API_KEY", "ADAPTION_KEY")
MODEL_NAMES = ("LLM_MODEL", "LLM_MODEL_ID", "LLM_MODEL_NAME", "ADAPTION_MODEL")
URL_NAMES = ("LLM_PROVIDER_URL", "LLM_BASE_URL", "LLM_URL", "LLM_API_URL", "LLM_ENDPOINT", "ADAPTION_BASE_URL", "ADAPTION_URL")
DEFAULT_MODEL = "qwen3.5-397b"

CANNED = ("The AI copilot is not set up on this server: no LLM_API_KEY is set. "
          "Use the trail, scores and holds in the case view.")
DRAFT_PROMPT = ("Rewrite the draft below so it is clear, formal and ready to send to a bank or exchange nodal officer. "
                "Keep every number, amount, account reference, date and identifier exactly as written. Add no facts. "
                "Return only the rewritten text.")
ASK_PROMPT = ("You are the case copilot for an Indian cyber-crime cell. Answer in under 120 words using only the "
              "case context provided. If the context does not say, say so.")


def squash(name: str) -> str:
    return re.sub(r"[^A-Z0-9]", "", name.upper())


def find(accepted: tuple[str, ...]) -> tuple[str | None, str | None]:
    """The (name, value) of the first accepted setting that is set and not blank."""
    for name in accepted:
        if (os.environ.get(name) or "").strip():
            return name, os.environ[name].strip()
    wanted = {squash(n): n for n in accepted}
    for name, value in os.environ.items():
        if squash(name) in wanted and value.strip():
            return name, value.strip()
    return None, None


def config() -> dict:
    key_name, key = find(KEY_NAMES)
    model_name, model = find(MODEL_NAMES)
    url_name, url = find(URL_NAMES)
    return {"key": key, "key_name": key_name, "model": model or DEFAULT_MODEL, "model_name": model_name or "default",
            "url": url, "url_name": url_name}


def call_model(cfg: dict, prompt: str, instructions: str, max_tokens: int = 2048) -> str:
    client = adaption.Adaption(api_key=cfg["key"], base_url=cfg["url"], timeout=20.0, max_retries=0)
    reply = client.responses.create(model=cfg["model"], max_output_tokens=max_tokens, instructions=instructions, input=prompt)
    parts = (p for item in reply.get("output", []) if item.get("type") == "message" for p in item.get("content", []))
    return "".join(p.get("text", "") for p in parts if p.get("type") == "output_text").strip()


def explain(err: Exception, cfg: dict) -> str:
    """Why the model service did not answer, in words that point at the setting to fix."""
    status = getattr(err, "status_code", None)
    if status in (401, 403):
        return f"the key was refused ({status}); check LLM_API_KEY"
    if status == 404:
        return f"the service does not know the model '{cfg['model']}' or the address; check LLM_MODEL and LLM_PROVIDER_URL"
    if status == 429:
        return "the service is rate limiting this key; try again in a minute"
    if status:
        return f"the service answered {status}"
    return "the service could not be reached; check LLM_PROVIDER_URL"


class AskIn(BaseModel):
    question: str = Field(min_length=1, max_length=20000)
    context: dict[str, Any] | None = None
    task: str | None = None


@router.post("/ask")
def ask(body: AskIn):
    is_draft = body.task == "draft"
    context = json.dumps(body.context, default=str) if body.context else ""
    if len(context) > 60000:
        raise HTTPException(413, "context too large")
    cfg = config()
    if not cfg["key"]:
        return {"answer": body.question if is_draft else CANNED}

    prompt = body.question if is_draft else f"Case context:\n{context}\n\nQuestion: {body.question}"
    try:
        text = call_model(cfg, prompt, DRAFT_PROMPT if is_draft else ASK_PROMPT)
    except adaption.APIError as err:
        # set up but refused: say why, instead of claiming it is not set up
        return {"answer": body.question if is_draft else f"The AI copilot is set up, but {explain(err, cfg)}."}
    if text:
        return {"answer": text}
    return {"answer": body.question if is_draft else "The AI copilot answered with nothing. Try asking again."}


@router.get("/ask/status")
def ask_status(probe: bool = False, user: User = Depends(current_user)):
    """Which copilot settings the server found (never their values). With ?probe=true, also try one tiny request."""
    cfg = config()
    out = {"ready": bool(cfg["key"]), "key_found_as": cfg["key_name"], "model": cfg["model"], "model_found_as": cfg["model_name"],
           "provider_found_as": cfg["url_name"] or "the library default"}
    if user.is_officer:  # names only, so a misspelt variable can be spotted
        out["related_names_on_server"] = sorted(n for n in os.environ if re.search(r"LLM|ADAPTION|ANTHROPIC|CLAUDE|MODEL|PROVIDER", n, re.I))
    if probe and cfg["key"]:
        try:
            out["probe"] = {"ok": bool(call_model(cfg, "Reply with the single word OK.", "Reply with the single word OK.", 32))}
        except adaption.APIError as err:
            out["probe"] = {"ok": False, "status": getattr(err, "status_code", None), "why": explain(err, cfg)}
    return out
