"""Pipeline jobs run inside the API process. Off unless BANK_DATABASE_URL points at the bank source database."""
import asyncio
import logging
import os
import threading

from pipeline import orchestrator

log = logging.getLogger(__name__)

RETRACE_SECONDS = 60


def enabled() -> bool:
    return bool(os.environ.get("BANK_DATABASE_URL"))


def trace(complaint_id: str) -> None:
    try:
        orchestrator.run(complaint_id)
    except Exception:
        log.exception("trace of %s failed", complaint_id)


def start_trace(complaint_id: str) -> None:
    threading.Thread(target=trace, args=(complaint_id,), daemon=True).start()


async def retrace_loop() -> None:
    while True:
        await asyncio.sleep(RETRACE_SECONDS)
        try:
            await asyncio.to_thread(orchestrator.run_due)
        except Exception:
            log.exception("periodic re-trace failed")
