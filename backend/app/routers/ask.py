import json
import os
from typing import Any

import anthropic
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(tags=["ask"])

CANNED = "The AI copilot is not set up on this server (LLM_API_KEY is missing). Use the trail, scores and holds in the case view."
DRAFT_PROMPT = ("Rewrite the draft below so it is clear, formal and ready to send to a bank or exchange nodal officer. "
                "Keep every number, amount, account reference, date and identifier exactly as written. Add no facts. "
                "Return only the rewritten text.")
ASK_PROMPT = ("You are the case copilot for an Indian cyber-crime cell. Answer in under 120 words using only the "
              "case context provided. If the context does not say, say so.")


class AskIn(BaseModel):
    question: str = Field(min_length=1, max_length=20000)
    context: dict[str, Any] | None = None
    task: str | None = None


@router.post("/ask")
def ask(body: AskIn):
    is_draft = body.task == "draft"
    fallback = {"answer": body.question if is_draft else CANNED}
    context = json.dumps(body.context, default=str) if body.context else ""
    if len(context) > 60000:
        raise HTTPException(413, "context too large")
    if not os.environ.get("LLM_API_KEY"):
        return fallback

    prompt = body.question if is_draft else f"Case context:\n{context}\n\nQuestion: {body.question}"
    try:
        client = anthropic.Anthropic(api_key=os.environ["LLM_API_KEY"], base_url=os.environ.get("LLM_PROVIDER_URL") or None,
                                     timeout=8.0, max_retries=0)
        reply = client.messages.create(
            model=os.environ.get("LLM_MODEL") or "claude-opus-5-5", max_tokens=2048,
            output_config={"effort": "low"}, system=DRAFT_PROMPT if is_draft else ASK_PROMPT,
            messages=[{"role": "user", "content": prompt}])
    except anthropic.APIError:
        return fallback
    text = "".join(b.text for b in reply.content if b.type == "text").strip()
    return {"answer": text} if text and reply.stop_reason != "refusal" else fallback
