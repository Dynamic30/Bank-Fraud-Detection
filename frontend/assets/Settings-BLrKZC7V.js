import {
 u as g,
 j as e,
 P as x,
 a as d,
 z as b,
 C as c,
 U as j,
 f as h,
 D as f,
 e as u
} from "./index-DAvlYmAS.js";
const m = "pc-backend-url";

function v() {
 try {
  return localStorage.getItem(m) || ""
 } catch {
  return ""
 }
}

function y(t) {
 try {
  t ? localStorage.setItem(m, t) : localStorage.removeItem(m)
 } catch {}
 window.PeechaAPI && window.PeechaAPI.reset()
}
async function w(t) {
 const a = t.replace(/\/+$/, ""),
  n = performance.now(),
  o = new AbortController,
  r = setTimeout(() => o.abort(), 6e3);
 try {
  const i = await fetch(`${a}/health`, {
   signal: o.signal
  });
  if (clearTimeout(r), !i.ok) return {
   ok: !1,
   msg: `Responded ${i.status}`
  };
  const s = await i.json().catch(() => ({}));
  return {
   ok: !0,
   ms: performance.now() - n,
   info: s
  }
 } catch (i) {
  return clearTimeout(r), {
   ok: !1,
   msg: i.name === "AbortError" ? "No answer in 6 s" : "Not reachable (check the URL and CORS)"
  }
 }
}

function l({
 title: t,
 sub: a,
 children: n
}) {
 return e.jsxs("div", {
  className: "set-row",
  children: [e.jsxs("div", {
   style: {
    minWidth: 200,
    flex: 1
   },
   children: [e.jsx("div", {
    style: {
     fontWeight: 600,
     fontSize: 14
    },
    children: t
   }), a && e.jsx("div", {
    className: "sec",
    style: {
     fontSize: 12.5,
     marginTop: 2
    },
    children: a
   })]
  }), e.jsx("div", {
   children: n
  })]
 })
}

function S() {
 const [t, a] = u.useState(v()), [n, o] = u.useState(null), [r, i] = u.useState(!1), s = async () => {
  i(!0), y(t.trim()), o(t.trim() ? await w(t.trim()) : null), i(!1)
 };
 return e.jsxs(c, {
  title: "Backend",
  sub: "The FastAPI service Peecha reads and writes. Leave empty to use this site's own /api.",
  children: [e.jsxs("div", {
   className: "btn-row",
   children: [e.jsx("input", {
    id: "backend-url",
    className: "input mono",
    style: {
     flex: 1,
     minWidth: 220
    },
    placeholder: "https://peecha-api.onrender.com",
    value: t,
    onChange: p => a(p.target.value),
    "aria-label": "Backend URL"
   }), e.jsx("button", {
    className: "btn sm",
    onClick: s,
    disabled: r,
    children: r ? "Checking…" : "Check connection"
   })]
  }), n && (n.ok ? e.jsxs("div", {
   className: "note ok",
   children: ["Connected in ", n.ms.toFixed(0), " ms", n.info && n.info.version ? ` · ${n.info.version}` : "", n.info && n.info.graph ? ` · graph: ${n.info.graph}` : ""]
  }) : e.jsx("div", {
   className: "note",
   children: n.msg
  })), !n && e.jsxs("p", {
   className: "muted",
   style: {
    fontSize: 12,
    marginTop: 8
   },
   children: ["Status: ", e.jsx("b", {
    children: window.PeechaAPI.get().status === "live" ? "connected" : "not connected"
   }), "."]
  })]
 })
}

function N() {
 const t = g(),
  {
   settings: a,
   can: n,
   user: o,
   D: r
  } = t,
  i = n("approve");
 return e.jsxs(e.Fragment, {
  children: [e.jsx(x, {
   title: "Settings",
   desc: "Backend connection, appearance and server settings.",
   sources: ["Config"]
  }), e.jsxs("section", {
   className: "card card-pad",
   style: {
    marginTop: 22,
    display: "flex",
    gap: 16,
    alignItems: "center",
    flexWrap: "wrap"
   },
   children: [e.jsx("span", {
    className: "role-badge",
    style: {
     width: 48,
     height: 48,
     fontSize: 18,
     background: "var(--primary)",
     color: "var(--primary-fg)"
    },
    children: o.badge
   }), e.jsxs("div", {
    style: {
     flex: 1,
     minWidth: 200
    },
    children: [e.jsx("div", {
     className: "serif",
     style: {
      fontSize: 18,
      fontWeight: 700
     },
     children: o.name
    }), e.jsxs("div", {
     className: "sec",
     style: {
      fontSize: 13
     },
     children: [o.title, " · ", o.unit]
    })]
   }), e.jsx("div", {
    style: {
     display: "flex",
     gap: 6,
     flexWrap: "wrap"
    },
    children: o.perms.map(s => e.jsx(d, {
     tone: "info",
     children: b[s]
    }, s))
   })]
  }), e.jsxs("div", {
   className: "grid g-2e",
   children: [false && e.jsxs(c, {
    title: "Decision thresholds",
    sub: i ? "Drag to re-score live. Precision and recall on the Model page follow." : "Only an officer can change thresholds.",
    children: [e.jsx(l, {
     title: "Hold candidate at score ≥",
     sub: `Accounts on a trail at or above this are put in the bank hold letters · precision now ${(r.evalr.precision*100).toFixed(0)}%, recall ${(r.evalr.recall*100).toFixed(0)}%`,
     children: e.jsxs("span", {
      className: "btn-row",
      children: [e.jsx("input", {
       type: "range",
       min: "50",
       max: "90",
       step: "5",
       value: a.holdThr,
       disabled: !i,
       onChange: s => t.setSetting("holdThr", Number(s.target.value)),
       onMouseUp: t.logSettings,
       onTouchEnd: t.logSettings,
       "aria-label": "Hold threshold"
      }), e.jsx("b", {
       children: a.holdThr
      })]
     })
    }), e.jsx(l, {
     title: "Warning call from score ≥",
     sub: "New accounts between this and the hold threshold get a Hindi warning call, not a hold",
     children: e.jsxs("span", {
      className: "btn-row",
      children: [e.jsx("input", {
       type: "range",
       min: "20",
       max: a.holdThr - 5,
       step: "5",
       value: a.callLo,
       disabled: !i,
       onChange: s => t.setSetting("callLo", Number(s.target.value)),
       onMouseUp: t.logSettings,
       onTouchEnd: t.logSettings,
       "aria-label": "Warning call threshold"
      }), e.jsx("b", {
       children: a.callLo
      })]
     })
    }), e.jsx(l, {
     title: "Scheduled re-trace every",
     sub: "How often the agent re-follows every open case (Agent37 sandbox in the event build)",
     children: e.jsxs("span", {
      className: "btn-row",
      children: [e.jsx("input", {
       type: "range",
       min: "10",
       max: "60",
       step: "5",
       value: a.step,
       disabled: !i,
       onChange: s => t.setSetting("step", Number(s.target.value)),
       onMouseUp: t.logSettings,
       onTouchEnd: t.logSettings,
       "aria-label": "Re-trace interval"
      }), e.jsxs("b", {
       children: [a.step, " min"]
      })]
     })
    }), e.jsx(l, {
     title: "P2P conversion rate",
     sub: "Used only to show ₹ ↔ USDT; taint is tracked in rupees at the moment of conversion",
     children: e.jsxs(d, {
      tone: "neutral",
      children: ["₹", j, " / USDT (assumed)"]
     })
    })]
   }), false && e.jsxs(c, {
    title: "Resilience",
    sub: "What happens when the gateways to banks and exchanges fail.",
    children: [e.jsx(l, {
     title: "Link to bank / exchange gateways",
     sub: "Simulate an outage: approvals are recorded and queued, then sent on reconnect",
     children: e.jsx(h, {
      options: [
       ["up", "Online"],
       ["down", "Link lost"]
      ],
      value: t.degraded ? "down" : "up",
      onChange: s => s === "down" !== t.degraded && t.toggleLink()
     })
    }), e.jsx(l, {
     title: "Data source",
     sub: "Prototype: seeded synthetic replay in the browser. Event build: FastAPI + Neo4j + Redis Streams behind the same interface (src/engine/index.js).",
     children: e.jsx(d, {
      tone: "info",
      children: "Synthetic replay"
     })
    }), e.jsx(l, {
     title: "Audit trail",
     sub: "SHA-256 hash chain; verify it on the Audit page",
     children: e.jsx("button", {
      className: "btn ghost sm",
      onClick: () => t.go("audit"),
      children: "Open audit trail"
     })
    }), e.jsx(l, {
     title: "Reset the demo",
     sub: "Back to 14:18, before the complaint arrives",
     children: e.jsx("button", {
      className: "btn ghost sm",
      onClick: () => t.resetDemo(),
      children: "Reset demo"
     })
    })]
   }), e.jsxs(c, {
    title: "Appearance",
    sub: "Applies only to this browser.",
    children: [e.jsx(l, {
     title: "Theme",
     children: e.jsx(h, {
      options: [
       ["light", "Light"],
       ["dark", "Dark"]
      ],
      value: t.theme,
      onChange: t.setTheme
     })
    }), e.jsx(l, {
     title: "Density",
     sub: "Row height on tables",
     children: e.jsx(h, {
      options: [
       ["comfortable", "Comfortable"],
       ["compact", "Compact"]
      ],
      value: t.density,
      onChange: t.setDensity
     })
    }), e.jsx(l, {
     title: "Demo role",
     sub: "Switch to see role-based access in action",
     children: e.jsx("select", {
      className: "select",
      value: t.session,
      onChange: s => t.switchRole(s.target.value),
      children: Object.values(f).map(s => e.jsx("option", {
       value: s.key,
       children: s.title
      }, s.key))
     })
    })]
   }), e.jsx(S, {}), false && e.jsx(c, {
    title: "About this prototype",
    sub: "What is real and what is simulated.",
    children: e.jsxs("ul", {
     className: "about",
     children: [e.jsxs("li", {
      children: [e.jsx("b", {
        children: "Real:"
       }),
       " the tracing engine (FIFO, LIFO, pro-rata), model training and evaluation, boosted-tree and multi-world stress tests, score explanations, hold/freeze effects on later money movement, CSV import, the hash-chained log, and the read-only TronGrid lookup."
      ]
     }), e.jsxs("li", {
      children: [e.jsx("b", {
       children: "Synthetic:"
      }), " every person, account, wallet, complaint and transaction (seeded, reproducible). No real customer data."]
     }), e.jsxs("li", {
      children: [e.jsx("b", {
       children: "Simulated:"
      }), " sending letters to banks and exchanges, and the phone call (a recorded ElevenLabs file or the browser voice, instead of a live Twilio call)."]
     }), e.jsxs("li", {
      children: [e.jsx("b", {
       children: "Optional on Vercel:"
      }), " AI copilot and AI-polished drafts use Claude live when this page is opened in Claude (you are asked once); otherwise they fall back to grounded templates and say so. Live TronGrid lookup needs the deployed backend (browsers here block outside calls)."]
     }), e.jsxs("li", {
      children: [e.jsx("b", {
       children: "Built before the event:"
      }), " this front end, the synthetic world, the tracing engine and the model (disclosed to judges)."]
     }), e.jsxs("li", {
      children: [e.jsx("b", {
       children: "Built at the event:"
      }), " FastAPI + Neo4j backend behind the same interface, the live ElevenLabs/Twilio warning call, live TRON lookups through the backend, and deployment."]
     })]
    })
   })]
  })]
 })
}
export {
 N as
 default
};