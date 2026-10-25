import asyncio
from contextlib import asynccontextmanager, suppress
from pathlib import Path

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from . import auth, db, jobs
from .routers import accounts, actions, ask, audit, banks, calls, complaints, holds, mules, settings, stats, tron

FRONTEND = Path(__file__).resolve().parents[2] / "frontend"


@asynccontextmanager
async def lifespan(app: FastAPI):
    db.init_pool()
    retrace = asyncio.create_task(jobs.retrace_loop()) if jobs.enabled() else None
    yield
    if retrace:
        retrace.cancel()
        with suppress(asyncio.CancelledError):
            await retrace
    db.close_pool()


app = FastAPI(title="Peecha API", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.get("/health")
def health():
    return {"ok": True, "version": "0.1", "db": "up" if db.db_up() else "down"}


app.include_router(auth.router, prefix="/api")
for module in (complaints, accounts, mules, holds, actions, calls, audit, settings, banks, ask, stats, tron):
    app.include_router(module.router, prefix="/api", dependencies=[Depends(auth.current_user)])

class RevalidatingStaticFiles(StaticFiles):
    """The built files keep the same names between deploys, so a browser must check with the server (cheap: an ETag
    answers 304) before reusing one. Otherwise a reload can mix old and new files and the page breaks."""

    async def get_response(self, path, scope):
        response = await super().get_response(path, scope)
        response.headers["Cache-Control"] = "no-cache"
        return response


if FRONTEND.is_dir():
    app.mount("/", RevalidatingStaticFiles(directory=FRONTEND, html=True))
