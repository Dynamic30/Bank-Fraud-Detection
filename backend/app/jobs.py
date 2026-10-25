"""Pipeline jobs run inside the API process. Off unless BANK_DATABASE_URL points at the bank source database."""
import asyncio
import logging
import os
import threading
from datetime import datetime, timezone

from pipeline import orchestrator
from pipeline.audit import write_audit

from .db import pipeline_conn

log = logging.getLogger(__name__)

RETRACE_SECONDS = 60

# what the last trace of each complaint did, and which are running now; this process only (the trail itself is in the database)
RESULTS: dict[str, dict] = {}
RUNNING: set[str] = set()


def enabled() -> bool:
    return bool(os.environ.get("BANK_DATABASE_URL"))


def now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


def record_failure(complaint_id: str, error: str) -> None:
    try:
        with pipeline_conn() as conn:
            write_audit(conn, orchestrator.ACTOR, "TRACE", f"Trace of {complaint_id} failed: {error}", complaint_id)
    except Exception:
        log.exception("could not record the failed trace of %s", complaint_id)


def record_problems(complaint_id: str, failures: list) -> None:
    """Keep why a trace found nothing (or only part) in the audit log, so it is still known after a restart."""
    more = f" (+{len(failures) - 1} more)" if len(failures) > 1 else ""
    try:
        with pipeline_conn() as conn:
            write_audit(conn, orchestrator.ACTOR, "TRACE", f"Trace of {complaint_id} had problems: {failures[0]}{more}", complaint_id)
    except Exception:
        log.exception("could not record the problems of the trace of %s", complaint_id)


def trace(complaint_id: str) -> None:
    RUNNING.add(complaint_id)
    try:
        summary = orchestrator.run(complaint_id)
        failures = summary.get("failures", [])
        RESULTS[complaint_id] = {"at": now(), "error": None, "failures": failures}
        if failures:
            record_problems(complaint_id, failures)
    except Exception as e:
        log.exception("trace of %s failed", complaint_id)
        error = f"{type(e).__name__}: {e}"[:300]
        RESULTS[complaint_id] = {"at": now(), "error": error, "failures": []}
        record_failure(complaint_id, error)
    finally:
        RUNNING.discard(complaint_id)


def start_trace(complaint_id: str) -> bool:
    """Run a trace in the background; False if one is already running here."""
    if complaint_id in RUNNING:
        return False
    RUNNING.add(complaint_id)  # set now so a second click before the thread starts is refused
    threading.Thread(target=trace, args=(complaint_id,), daemon=True).start()
    return True


async def retrace_loop() -> None:
    while True:
        await asyncio.sleep(RETRACE_SECONDS)
        try:
            await asyncio.to_thread(orchestrator.run_due)
        except Exception:
            log.exception("periodic re-trace failed")
