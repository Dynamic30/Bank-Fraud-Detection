import {
 u as I,
 p as S,
 g as z,
 j as e,
 P as D,
 I as w,
 q as A,
 K as x,
 i as $,
 h as N,
 d as E,
 C as W,
 w as O,
 k as R,
 e as y,
 a as k,
 t as _,
 b as H,
 A as L,
 s as q,
 J as BSX
} from "./index-DAvlYmAS.js";
import {
 CasePicker as K
} from "./Trail--XxNU5VG.js";

function F(o, t) {
 const n = l => l.replace(/&/g, "&amp;").replace(/</g, "&lt;");
 let s = null;
 try { s = window.open("", "_blank") } catch {}
 if (!s || !s.document) {
  window.PeechaRT && window.PeechaRT.save(String(o).replace(/[^A-Za-z0-9-]+/g, "_") + "_printable.html", `<!doctype html><html><head><meta charset="utf-8"><title>${n(o)}</title><style>body{font:13px/1.55 ui-monospace,monospace;margin:32px;color:#111}pre{white-space:pre-wrap}h1{font:700 18px Georgia,serif}</style></head><body><h1>${n(o)}</h1><pre>${n(t)}</pre><script>setTimeout(()=>print(),300)<\/script></body></html>`, "text/html");
  return !!window.PeechaRT
 }
 return s.document.write(
  `<!doctype html><html><head><meta charset="utf-8"><title>${n(o)}</title><style>body{font:13px/1.55 'IBM Plex Mono',ui-monospace,monospace;margin:32px;color:#111}pre{white-space:pre-wrap}h1{font:700 18px Georgia,serif}</style></head><body><h1>${n(o)}</h1><pre>${n(t)}</pre><script>setTimeout(()=>print(),300)<\/script></body></html>`
  ), s.document.close(), !0
}

function G({
 cid: o,
 it: t
}) {
 const s = I(),
  {
   can: n
  } = s,
  l = `${o}|${t.id}`,
  i = s.approvals[l],
  r = S(s, o, t),
  [d, f] = y.useState(null),
  u = d ?? !1,
  [m, b] = y.useState(!1),
  a = s.edits[l] ?? t.text,
  p = s.D.W,
  [g, h] = y.useState(!1),
  T = async () => {
   h(!0);
   const SM = window.PeechaRT ? await window.PeechaRT.sample() : null;
   if (SM) {
    try {
     const out = await SM("You are helping an Indian police cyber-crime cell officer. Rewrite the draft below so it is clear, formal and ready to send to a bank / exchange nodal officer. Rules: keep EVERY number, rupee amount, account mask, wallet address, transaction reference, time, case ID and law citation exactly as written; do not invent facts; keep it under 220 words; plain text only. Reply with only the rewritten draft.\n\nDRAFT:\n" + a, {
      modelTier: "quick"
     });
     const txt = (out && out.text || "").trim();
     txt ? (s.editItem(l, txt), f(!0), s.toast("Draft polished by Claude — check it before approving")) : s.toast("Claude returned nothing — the agent draft is kept");
    } catch (err) {
     err && err.code === "not_granted" && window.PeechaRT.disableAI();
     s.toast(err && err.code === "not_granted" ? "Claude not allowed in this view — the agent draft is kept" : "Claude unavailable right now — the agent draft is kept")
    }
    h(!1);
    return
   }
   try {
    const c = new AbortController,
     P = setTimeout(() => c.abort(), 2e4),
     v = await fetch("./api/ask", {
      method: "POST",
      headers: {
       "content-type": "application/json"
      },
      body: JSON.stringify({
       task: "draft",
       question: a
      }),
      signal: c.signal
     });
    clearTimeout(P);
    const j = v.ok ? await v.json() : null;
    j && j.answer ? (s.editItem(l, j.answer), f(!0), s.toast("Draft polished by AI — check it before approving")) : s.toast("AI polishing needs Claude (open this page in Claude) or the event backend — the agent draft is kept")
   } catch {
    s.toast("AI polishing needs Claude (open this page in Claude) or the event backend — the agent draft is kept")
   }
   h(!1)
  }, C = r === "partial" ? t.targets.filter(c => !(i.targets || []).includes(c)) : [];
 return e.jsxs("div", {
  className: `pack-item s-${r} k-${t.kind}`,
  children: [e.jsxs("div", {
   className: "pack-head",
   children: [e.jsxs("div", {
    style: {
     minWidth: 0,
     flex: 1
    },
    children: [e.jsxs("div", {
     style: {
      display: "flex",
      gap: 8,
      flexWrap: "wrap",
      alignItems: "center"
     },
     children: [e.jsx(k, {
      tone: t.kind === "exchange" || t.kind === "issuer" || t.kind === "p2p" ? "crypto" : t.kind === "hold" ? "info" : "neutral",
      children: _[t.kind]
     }), r === "done" && e.jsxs(k, {
      tone: "rec-solid",
      children: ["✓ Approved", i ? ` ${N(i.at)} · ${i.by}` : ""]
     }), r === "partial" && e.jsxs(k, {
      tone: "accent",
      children: ["New target", C.length > 1 ? "s" : "", " since approval"]
     }), r === "draft" && e.jsx(k, {
      tone: "accent",
      children: "Draft · needs approval"
     })]
    }), e.jsx("div", {
     className: "pack-title",
     children: t.title
    }), e.jsxs("div", {
     className: "cell-sub",
     children: ["To: ", t.to, " · ", t.effect, t.amount >= 1 ? ` · ${H(t.amount)} traced` : ""]
    }), e.jsx("div", {
     className: "pack-targets",
     children: t.targets.slice(0, 8).map(c => e.jsx("span", {
      className: `tchip ${t.kind==="hold"&&s.S.holds[c]!=null||t.kind==="exchange"&&s.S.freezes[c]!=null?"done":""}`,
      children: e.jsx(L, {
       id: c,
       children: p.accounts[c] ? p.accounts[c].name : q(c)
      })
     }, c))
    })]
   }), e.jsxs("div", {
    className: "btn-row",
    style: {
     flexShrink: 0
    },
    children: [r !== "done" && n("approve") && e.jsxs("button", {
     className: "btn",
     onClick: () => s.approveItems(o, [t]),
     children: ["Approve", t.kind === "hold" ? " hold" : t.kind === "exchange" ? " freeze" : " & send"]
    }), e.jsx("button", {
     className: "btn ghost sm",
     onClick: () => f(!u),
     "aria-expanded": u,
     children: u ? "Hide draft" : "View draft"
    })]
   })]
  }), u && e.jsxs("div", {
   className: "pack-body",
   children: [m ? e.jsx("textarea", {
    className: "pack-text",
    value: a,
    onChange: c => s.editItem(l, c.target.value),
    rows: Math.min(24, a.split(`
`).length + 2),
    "aria-label": "Edit draft"
   }) : e.jsx("pre", {
    className: "pack-text",
    children: a
   }), e.jsxs("div", {
    className: "btn-row",
    style: {
     marginTop: 8
    },
    children: [n("edit") && e.jsxs("button", {
     className: "btn ghost sm",
     onClick: () => b(!m),
     children: [e.jsx(w, {
      name: "edit",
      size: 13
     }), m ? "Done editing" : "Edit draft"]
    }), n("edit") && e.jsx("button", {
     className: "btn ghost sm",
     onClick: T,
     disabled: g,
     children: g ? "Claude is polishing…" : "✨ Polish with Claude"
    }), s.edits[l] != null && e.jsx("button", {
     className: "link-btn",
     onClick: () => s.editItem(l, void 0),
     children: "Reset to agent draft"
    }), e.jsx("button", {
     className: "btn ghost sm",
     onClick: () => {
      try {
       navigator.clipboard.writeText(a), s.toast("Draft copied")
      } catch {}
     },
     children: "Copy"
    })]
   })]
  })]
 })
}

function CaseList() {
 const o = I(),
  {
   D: t,
   caseId: n
  } = o,
  rows = t.order.map(id => t.cases.find(c => c.id === id)).filter(Boolean);
 if (rows.length < 2) return null;
 return e.jsx(W, {
  title: "Choose a case",
  sub: "One action pack per complaint. Click a row to see its drafts below.",
  bodyClass: "",
  style: {
   marginBottom: 18
  },
  children: e.jsx("div", {
   className: "tbl-wrap",
   children: e.jsxs("table", {
    className: "tbl",
    children: [e.jsx("thead", {
     children: e.jsx("tr", {
      children: [
       ["Case", ""],
       ["Victim account", ""],
       ["Amount lost", "right"],
       ["Waiting for approval", "right"],
       ["Still stoppable", "right"],
       ["", ""]
      ].map(([c, k], i) => e.jsx("th", {
       className: k,
       children: c
      }, i))
     })
    }), e.jsx("tbody", {
     children: rows.map(c => {
      const tot = t.states[c.id].tot,
       left = o.pack(c.id).filter(a => S(o, c.id, a) !== "done").length,
       on = c.id === n,
       A0 = t.W.accounts[c.victim];
      return e.jsxs("tr", {
       className: "click",
       style: on ? {
        background: "var(--surface-muted, rgba(0,0,0,.04))",
        boxShadow: "inset 3px 0 0 var(--primary, #1e3a8a)"
       } : void 0,
       tabIndex: 0,
       role: "button",
       "aria-pressed": on,
       onClick: () => o.pickCase(c.id),
       onKeyDown: ev => {
        ev.key === "Enter" && o.pickCase(c.id)
       },
       children: [e.jsxs("td", {
        children: [e.jsx("div", {
         className: "cell-main mono",
         children: c.id
        }), e.jsx("div", {
         className: "cell-sub",
         children: c.type
        })]
       }), e.jsxs("td", {
        children: [A0 ? A0.name : "—", e.jsx("div", {
         className: "cell-sub mono",
         children: A0 ? `${BSX[A0.bank]||A0.bank} ${A0.mask}` : ""
        })]
       }), e.jsx("td", {
        className: "right nowrap",
        children: $(c.amount)
       }), e.jsx("td", {
        className: "right nowrap",
        children: left ? e.jsx(k, {
         tone: "accent",
         children: left
        }) : e.jsx(k, {
         tone: "rec-solid",
         children: "All approved"
        })
       }), e.jsx("td", {
        className: "right nowrap c-rec",
        children: $(Math.max(0, tot.recoverable - tot.secured))
       }), e.jsx("td", {
        className: "nowrap",
        children: on ? e.jsx(k, {
         tone: "info",
         children: "Showing ↓"
        }) : e.jsx("span", {
         className: "muted",
         children: "Open"
        })
       })]
      }, c.id)
     })
    })]
   })
  })
 })
}

function B() {
 const o = I(),
  {
   D: t,
   S: s,
   caseId: n,
   can: l
  } = o,
  i = t.graphs[n];
 if (!i) return null;
 const r = o.pack(n),
  d = r.filter(a => S(o, n, a) !== "done"),
  f = d.filter(a => a.kind === "hold" || a.kind === "exchange").reduce((a, p) => a + p.targets.reduce((g, h) => g + (t.states[n].st[h] && (p.kind === "hold" ? s.holds[h] == null : s.freezes[h] ==
   null) ? t.states[n].st[h].v : 0), 0), 0),
  u = t.states[n].tot,
  m = z(i.c, s.clock),
  b = () => {
   const a = A(t.W, i, r, Object.fromEntries(r.map(p => [p.id, o.approvals[`${n}|${p.id}`] ? {
    ...o.approvals[`${n}|${p.id}`],
    text: o.edits[`${n}|${p.id}`]
   } : null])), s.clock);
   return R(`${n}_action_pack.txt`, `${a.text}

SHA-256: ${a.hash}
`), o.logReport(`${n} action pack`, a.hash), o.toast("Action pack exported with its SHA-256 fingerprint"), a
  };
 return e.jsxs(e.Fragment, {
  children: [e.jsx(CaseList, {}), e.jsx(D, {
   title: `Action pack · ${n}`,
   desc: "The agent's drafts for every bank, the exchange, the P2P seller and the STR — each tied to the evidence. Nothing is sent until an officer approves it; each approval is logged.",
   sources: ["Agent drafts", "Officer approval"],
   actions: e.jsxs(e.Fragment, {
    children: [l("approve") && e.jsxs("button", {
     className: "btn glow",
     id: "btn-approve-all",
     disabled: !d.length,
     onClick: () => o.approveItems(n, d),
     children: [e.jsx(w, {
      name: "check",
      size: 15
     }), "Approve all ", d.length ? `(${d.length})` : ""]
    }), e.jsxs("button", {
     className: "btn ghost",
     onClick: b,
     children: [e.jsx(w, {
      name: "download",
      size: 15
     }), "Export pack (.txt + hash)"]
    }), e.jsx("button", {
     className: "btn ghost",
     onClick: () => {
      const a = A(t.W, i, r, {}, s.clock);
      F(`${n} action pack`, a.text) || o.toast("Allow pop-ups to print")
     },
     children: "Print / PDF"
    })]
   })
  }), e.jsxs("div", {
   className: "kpis",
   children: [e.jsx(x, {
    label: "Waiting for approval",
    value: d.length,
    tone: d.length ? "accent" : "rec",
    sub: `of ${r.length} drafted actions`
   }), e.jsx(x, {
    label: "Secured by pending holds / freezes",
    value: $(f),
    tone: "rec",
    sub: "if approved now"
   }), e.jsx(x, {
    label: "Already secured",
    value: $(u.secured),
    tone: "rec",
    sub: "held or frozen"
   }), e.jsx(x, {
    label: "Golden-hour clock",
    value: E(s.clock - i.c.fraudAt),
    tone: m.k === "golden" ? "accent" : void 0,
    sub: `since the first payment at ${N(i.c.fraudAt)}`
   })]
  }), (() => {
   const hops = i.links.filter(q => q.status === "done"),
    bankIds = new Set(i.nodes.filter(q => q.kind === "bank").map(q => q.id)),
    banks = new Set(i.nodes.filter(q => q.kind === "bank" && t.W.accounts[q.id]).map(q => t.W.accounts[q.id].bank)),
    crypto = i.nodes.filter(q => q.kind === "exchange" || q.kind === "wallet" || q.kind === "bridge").length,
    stop = Math.max(0, u.recoverable - u.secured),
    li = (txt, k) => e.jsx("li", {
     style: {
      margin: "6px 0"
     },
     children: txt
    }, k),
    col = (title, tone, items) => e.jsxs("div", {
     style: {
      flex: "1 1 260px",
      minWidth: 0,
      padding: "14px 16px",
      borderRadius: 12,
      border: "1px solid var(--border, #e5e7eb)",
      background: tone === "good" ? "var(--rec-bg, rgba(16,185,129,.07))" : "var(--surface-muted, rgba(0,0,0,.03))"
     },
     children: [e.jsx("div", {
      className: "cell-main",
      style: {
       marginBottom: 6
      },
      children: title
     }), e.jsx("ul", {
      style: {
       margin: 0,
       paddingLeft: 18,
       fontSize: 13.5,
       lineHeight: 1.5
      },
      children: items.map(li)
     })]
    });
   return e.jsx(W, {
    title: "Before vs after Peecha · this case",
    sub: "Left: the manual route used today. Right: what this screen just did, measured live.",
    style: {
     marginTop: 18
    },
    children: e.jsxs("div", {
     style: {
      display: "flex",
      gap: 14,
      flexWrap: "wrap"
     },
     children: [col("Without Peecha (manual)", "bad", [`Ask ${banks.size} bank${banks.size>1?"s":""} for statements one by one to follow ${hops.length} transfers`, `Type ${r.length} separate letters / notices by hand`, crypto ? `No in-house way to follow ₹ → USDT → exchange (${crypto} crypto point${crypto>1?"s":""} on this trail)` : "Crypto leg: none on this trail", "Replies take days; the money keeps moving"]),
      col("With Peecha (this screen)", "good", [`Whole trail re-computed in ${Math.max(1,Math.round(t.ms||0))} ms: ${hops.length} transfers, ${bankIds.size} accounts`, `${r.length} drafts ready, each tied to its evidence; officer approves with one click`, `${$(stop)} can still be stopped right now`, `${$(u.secured)} already secured (held or frozen)`])]
    })
   })
  })(), o.degraded && e.jsxs("div", {
   className: "note",
   style: {
    marginTop: 14
   },
   children: ["The link to banks and exchanges is down. Approvals are recorded and will be sent when it returns (", o.queued, " queued)."]
  }), !l("approve") && e.jsxs("div", {
   className: "note info",
   style: {
    marginTop: 14
   },
   children: ["You are signed in as ", o.user.title, ". You can read", l("edit") ? " and edit" : "", " drafts; only an officer can approve and send them."]
  }), e.jsx(W, {
   title: "Drafted actions",
   sub: `Re-drafted on every re-trace. Last trace ${N(s.clock)} · new accounts or addresses appear here automatically.`,
   style: {
    marginTop: 18
   },
   children: [...d, ...r.filter(a => !d.includes(a))].map(a => e.jsx(G, {
    cid: n,
    it: a
   }, a.id))
  }), e.jsxs("p", {
   className: "muted",
   style: {
    fontSize: 12,
    marginTop: 12
   },
   children: ["Drafts are for the demo: synthetic names, masked accounts, synthetic references. Approving a hold or freeze changes what happens on the next re-trace — try it before and after ",
    O(s.clock + o.settings.step, s.clock), "."
   ]
  })]
 })
}
export {
 B as
 default
};