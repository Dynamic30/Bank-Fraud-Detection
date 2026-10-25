"""Stub auth: log in by email (no password), then send the user id as `X-User-Id` on every /api call."""
from __future__ import annotations

from dataclasses import dataclass

from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel

from .db import get_conn

OFFICER = "officer"
BANK_ROLES = frozenset({"bank_analyst", "bank_admin"})
CONSUMER = "consumer"

_COLS = "id, name, email, role, bank_id, access_level, status"


@dataclass(frozen=True)
class User:
    id: str
    name: str
    email: str
    role: str
    bank_id: str | None
    access_level: str
    status: str

    @property
    def is_officer(self) -> bool:
        return self.role == OFFICER

    @property
    def is_bank(self) -> bool:
        return self.role in BANK_ROLES

    @property
    def is_consumer(self) -> bool:
        return self.role == CONSUMER

    @property
    def can_write(self) -> bool:
        return self.is_officer or (self.is_bank and self.access_level in ("hold", "admin"))


router = APIRouter(tags=["auth"])


class LoginIn(BaseModel):
    email: str


@router.post("/login")
def login(body: LoginIn, conn=Depends(get_conn)):
    row = conn.execute(f"SELECT {_COLS} FROM app_users WHERE lower(email) = lower(%s)",
                       (body.email.strip(),)).fetchone()
    if row is None:
        raise HTTPException(401, "unknown user")
    if row["status"] != "active":
        raise HTTPException(403, "user is suspended")
    return {"user_id": row["id"], "role": row["role"], "bank_id": row["bank_id"],
            "access_level": row["access_level"], "name": row["name"]}


def current_user(x_user_id: str | None = Header(default=None), conn=Depends(get_conn)) -> User:
    if not x_user_id:
        raise HTTPException(401, "X-User-Id header required")
    row = conn.execute(f"SELECT {_COLS} FROM app_users WHERE id = %s", (x_user_id,)).fetchone()
    if row is None:
        raise HTTPException(401, "unknown user")
    if row["status"] != "active":
        raise HTTPException(403, "user is suspended")
    return User(**row)
