"""After generation: unique UTRs and the ~1% failed transfers."""
from __future__ import annotations

import random

from .world import BG, DONE, FAILED, World

FAIL_SHARE = 0.01


def assign_utrs(world: World, rng: random.Random) -> int:
    st = world.store
    seen: set[str] = set()
    for i in range(len(st)):
        if st.rail[i] == "ATM":
            st.utr[i] = None
            continue
        while True:
            u = str(rng.randrange(10**11, 10**12))
            if u not in seen:
                seen.add(u)
                break
        st.utr[i] = u
    return len(seen)


def flag_failures(world: World, rng: random.Random) -> int:
    """Failed transfers never move money. Scam flows (already conserved) and P2P-seller legs are left alone,
    because a failed rupee payment would not be followed by a USDT release."""
    st, accts = world.store, world.accts
    already = sum(1 for x in st.st if x == FAILED)
    want = round(FAIL_SHARE * len(st)) - already
    cand = [i for i in range(len(st))
            if st.kind[i] == BG and st.st[i] == DONE and accts[st.f[i]].p2p_wallet is None
            and (st.t[i] < 0 or accts[st.t[i]].p2p_wallet is None)]
    for i in rng.sample(cand, min(len(cand), max(0, want))):
        st.st[i] = FAILED
    return sum(1 for x in st.st if x == FAILED)
