import {
 u as B,
 e as T,
 H as ae,
 j as e,
 h as F,
 l as H,
 b as N,
 J as de,
 s as he,
 U as me,
 g as ue,
 c as xe,
 L as fe,
 P as pe,
 I as Y,
 k as je,
 O as ge,
 Q as be,
 w as ve,
 a as J,
 d as ke,
 K as R,
 i as $,
 C as I,
 M as ye,
 A as X,
 o as $e,
 n as Q,
 f as Ne,
 T as we
} from "./index-DAvlYmAS.js";
const CryptoLeg = T.lazy(() => import("./Crypto-BqUjZHoZ.js"));
const K = 184,
 W = 138,
 D = 72,
 G = 96,
 _ = 14,
 ee = 40,
 se = t => t >= 1e5 ? `₹${(t/1e5).toFixed(t>=1e6?1:2)}L` : t >= 1e3 ? `₹${(t/1e3).toFixed(t>=1e4?0:1)}k` : `₹${Math.round(t)}`,
 Se = (t, n) => t.length > n ? `${t.slice(0,n-1)}…` : t;

function Ce(t, n, a) {
 return t.has("victim") ? "Victim" : t.has("bank") ? `Mule layer ${n-a+1}` : t.has("p2p") || t.has("cash") || t.has("ext") ? "Cash-out · P2P" : t.has("exchange") ? "Exchange" : t.has("bridge") ?
  "Exit" : t.has("wallet") ? "On-chain (TRON)" : ""
}

function Me(t, n) {
 if (t.status === "blocked") return "blocked";
 const a = n.nodes.find(o => o.id === t.to);
 return a && (a.kind === "cash" || a.kind === "bridge") ? "exit" : a && a.kind === "ext" ? "outside" : t.cur === "USDT" || t.rail === "P2P" ? "crypto" : "bank"
}

function te(t, n, a) {
 const o = a ? a.v : 0;
 if (a && a.status === "stopped") return n.kind === "bridge" ? "Stopped by freeze" : n.kind === "cash" ? "Stopped by hold" : "Blocked before arrival";
 const h = m => Math.round(m / me).toLocaleString("en-IN");
 switch (n.kind) {
  case "victim":
   return "Paid the scammer";
  case "bank":
   return a.status === "held" ? `${N(o)} held` : o >= 1 ? `${N(o)} still here` : a.status === "held-empty" ? "Held · nothing left" : "Passed on";
  case "p2p":
   return "Rupee → USDT here";
  case "cash":
   return `${N(o)} cash out`;
  case "ext":
   return `${N(o)} left our data`;
  case "bridge":
   return `≈ ${N(o)} gone`;
  case "exchange":
   return o >= 1 ? `${h(o)} USDT ${a.status==="frozen"?"frozen":"freezable"}` : a.status === "frozen-empty" ? "Frozen · empty" : "Moved on";
  case "wallet":
   return o >= 1 ? `≈ ${h(o)} USDT here` : "Moved on";
  default:
   return ""
 }
}

function Te(t, n) {
 const a = t.accounts[n.id];
 return a ? `${de[a.bank]||a.bank} ${a.mask}` : t.wallets[n.id] ? he(n.id) : n.kind === "cash" ? `from ${t.accounts[n.id.slice(5)]?t.accounts[n.id.slice(5)].name.split(" ")[0]:""}` : n.kind ===
  "ext" ? "Trace request needed" : n.kind === "bridge" ? "Funds left TRON" : ""
}

function Oe({
 G: t,
 t: n,
 compact: a
}) {
 var Z;
 const o = B(),
  {
   D: h,
   S: m
  } = o,
  c = h.W,
  i = T.useMemo(() => ae(c, h.sim, t, n, {
   holds: m.holds,
   freezes: m.freezes
  }), [c, h.sim, t, n, m.holds, m.freezes]),
  [x, w] = T.useState(!1),
  [j, u] = T.useState("auto"),
  p = T.useMemo(() => {
   var U;
   if (!x) return t;
   const s = new Set(t.nodes.filter(d => i.st[d.id] && i.st[d.id].v >= 1 && ["recoverable", "held", "crypto", "exchange", "frozen"].includes(i.st[d.id].status)).map(d => d.id)),
    g = new Set(s);
   g.add(t.c.victim);
   const S = t.links.filter(d => d.t0 <= n && d.status === "done");
   let P = !0;
   for (; P;) {
    P = !1;
    for (const d of S) g.has(d.to) && !g.has(d.from) && (g.add(d.from), P = !0)
   }
   const M = t.nodes.filter(d => g.has(d.id)),
    y = [...new Set(M.map(d => d.col))].sort((d, O) => d - O),
    z = Object.fromEntries(y.map((d, O) => [d, O])),
    b = {};
   for (const d of M)(b[U = d.col] || (b[U] = [])).push(d);
   const L = [];
   for (const d of Object.values(b)) d.sort((O, E) => O.row - E.row), d.forEach((O, E) => L.push({
    ...O,
    col: z[O.col],
    row: E - (d.length - 1) / 2
   }));
   return {
    ...t,
    nodes: L,
    links: t.links.filter(d => g.has(d.from) && g.has(d.to)),
    ncol: y.length,
    maxRows: Math.max(1, ...Object.values(b).map(d => d.length))
   }
  }, [x, t, i, n]),
  C = Math.max(1, p.maxRows),
  f = _ * 2 + (p.ncol - 1) * K + W,
  v = ee + C * G + 6,
  k = {};
 for (const s of p.nodes) k[s.id] = {
  x: _ + s.col * K,
  y: ee + (s.row + (C - 1) / 2) * G
 };
 const l = Math.max(1, t.c.amount),
  r = {};
 for (const s of p.nodes)(r[Z = s.col] || (r[Z] = new Set)).add(s.kind);
 const A = Math.min(...p.nodes.filter(s => s.kind === "bank").map(s => s.col), 99),
  ne = a ? {
   minWidth: 640
  } : j === "fit" ? {
   width: "100%"
  } : j === "auto" ? {
   minWidth: Math.round(f * .92),
   maxWidth: Math.round(f * 1.12)
  } : {
   width: Math.round(f * j),
   maxWidth: "none"
  },
  re = () => u(s => Math.min(1.6, (typeof s == "number" ? s : 1) + .15)),
  oe = () => u(s => Math.max(.5, (typeof s == "number" ? s : 1) - .15)),
  [ie, q] = T.useState(null);
 return e.jsxs(e.Fragment, {
  children: [!a && e.jsxs("div", {
   className: "graph-tools",
   role: "toolbar",
   "aria-label": "Graph view",
   children: [e.jsx("button", {
    className: `gt ${x?"on":""}`,
    onClick: () => w(!x),
    "aria-pressed": x,
    title: "Show only where the victim's money is now, and the path to it",
    children: "◎ Focus: where the money is now"
   }), e.jsx("span", {
    className: "gt-sep"
   }), e.jsx("button", {
    className: `gt ${j==="fit"?"on":""}`,
    onClick: () => u("fit"),
    children: "Fit"
   }), e.jsx("button", {
    className: "gt",
    onClick: oe,
    "aria-label": "Zoom out",
    children: "−"
   }), e.jsx("button", {
    className: `gt ${j==="auto"||j===1?"on":""}`,
    onClick: () => u("auto"),
    children: "100%"
   }), e.jsx("button", {
    className: "gt",
    onClick: re,
    "aria-label": "Zoom in",
    children: "+"
   })]
  }), e.jsxs("div", {
   className: "trail-wrap",
   ref: s => {
    s && s.dataset.c !== t.c.id && (s.dataset.c = t.c.id, s.scrollLeft = 0)
   },
   children: [e.jsxs("svg", {
    className: "trail",
    viewBox: `0 0 ${f} ${v}`,
    style: ne,
    role: "img",
    "aria-label": `Money trail for ${t.c.id}`,
    children: [e.jsxs("defs", {
     children: [e.jsx("marker", {
      id: "arr-bank",
      viewBox: "0 0 10 10",
      refX: "9",
      refY: "5",
      markerUnits: "userSpaceOnUse",
      markerWidth: "11",
      markerHeight: "11",
      orient: "auto-start-reverse",
      children: e.jsx("path", {
       d: "M0 0 L10 5 L0 10z",
       fill: "var(--edge)"
      })
     }), e.jsx("marker", {
      id: "arr-crypto",
      viewBox: "0 0 10 10",
      refX: "9",
      refY: "5",
      markerUnits: "userSpaceOnUse",
      markerWidth: "11",
      markerHeight: "11",
      orient: "auto-start-reverse",
      children: e.jsx("path", {
       d: "M0 0 L10 5 L0 10z",
       fill: "var(--crypto)"
      })
     }), e.jsx("marker", {
      id: "arr-exit",
      viewBox: "0 0 10 10",
      refX: "9",
      refY: "5",
      markerUnits: "userSpaceOnUse",
      markerWidth: "11",
      markerHeight: "11",
      orient: "auto-start-reverse",
      children: e.jsx("path", {
       d: "M0 0 L10 5 L0 10z",
       fill: "var(--exit)"
      })
     }), e.jsx("marker", {
      id: "arr-outside",
      viewBox: "0 0 10 10",
      refX: "9",
      refY: "5",
      markerUnits: "userSpaceOnUse",
      markerWidth: "11",
      markerHeight: "11",
      orient: "auto-start-reverse",
      children: e.jsx("path", {
       d: "M0 0 L10 5 L0 10z",
       fill: "var(--outside)"
      })
     }), e.jsxs("marker", {
      id: "arr-blocked",
      viewBox: "0 0 10 10",
      refX: "5",
      refY: "5",
      markerUnits: "userSpaceOnUse",
      markerWidth: "16",
      markerHeight: "16",
      children: [e.jsx("circle", {
       cx: "5",
       cy: "5",
       r: "4",
       fill: "var(--card-bg)",
       stroke: "var(--rec)",
       strokeWidth: "1.6"
      }), e.jsx("path", {
       d: "M2.6 5h4.8",
       stroke: "var(--rec)",
       strokeWidth: "1.6"
      })]
     })]
    }), Object.entries(r).map(([s, g]) => e.jsx("text", {
     x: _ + Number(s) * K + W / 2,
     y: 16,
     textAnchor: "middle",
     className: "col-lbl",
     children: Ce(g, Number(s), A)
    }, s)), p.links.map(s => {
     const g = k[s.from],
      S = k[s.to];
     if (!g || !S) return null;
     const P = s.t0 <= n,
      M = Me(s, t),
      y = g.x + W,
      z = g.y + D / 2,
      b = S.x - 2,
      L = S.y + D / 2,
      U = Math.max(30, (b - y) / 2),
      d = b > y ? `M${y},${z} C${y+U},${z} ${b-U},${L} ${b},${L}` : `M${y},${z} C${y+60},${z+70} ${b-60},${L+70} ${b},${L}`,
      O = 1.4 + 6 * Math.sqrt(Math.min(1, s.taint / l)),
      E = (y + b) / 2,
      ce = (z + L) / 2,
      le = P && n - s.t1 <= 12 && s.status === "done",
      V = `${s.from}>${s.to}>${s.status}`;
     return e.jsxs("g", {
      className: `edge ${M} ${P?"":"hide"} ${le?"flowing":""} ${ie===V?"hov":""}`,
      onMouseEnter: () => q(V),
      onMouseLeave: () => q(null),
      children: [e.jsx("path", {
       d,
       strokeWidth: O,
       markerEnd: M === "blocked" ? "url(#arr-blocked)" : `url(#arr-${M})`
      }), e.jsx("path", {
       d,
       className: "hit"
      }), e.jsxs("g", {
       transform: `translate(${E},${ce})`,
       className: "elabel",
       children: [e.jsx("rect", {
        x: -34,
        y: -10,
        width: 68,
        height: 20,
        rx: 10
       }), e.jsx("text", {
        y: 4,
        textAnchor: "middle",
        children: M === "blocked" ? `⛔ ${se(s.taint)}` : se(s.taint)
       })]
      }), e.jsx("title", {
       children: `${s.status==="blocked"?"BLOCKED attempt":"Transfer"} ${F(s.t0)}${s.n>1?`–${F(s.t1)} (${s.n} transfers)`:""} · ${s.rail}${s.cur==="USDT"?` · ${H(s.amt)}`:s.rail==="P2P"?` · ${N(s.amt)} → ${H(s.out)}`:` · ${N(s.amt)}`} · ${N(s.taint)} traced`
      })]
     }, V)
    }), p.nodes.map(s => {
     const g = k[s.id],
      S = i.st[s.id],
      P = s.first <= n,
      M = h.scores[s.id],
      y = !!(c.accounts[s.id] || c.wallets[s.id]),
      z = S.status === "held" || S.status === "frozen" || S.status === "held-empty" || S.status === "frozen-empty";
     return e.jsxs("g", {
      transform: `translate(${g.x},${g.y})`,
      className: `node k-${s.kind} s-${S.status} ${P?"":"hide"} ${y?"click":""}`,
      onClick: y ? () => o.open(c.accounts[s.id] ? "account" : "wallet", s.id) : void 0,
      ...y ? {
       tabIndex: 0,
       role: "button",
       "aria-label": `${s.title}: ${te(c,s,S)}`,
       onKeyDown: b => {
        b.key === "Enter" && o.open(c.accounts[s.id] ? "account" : "wallet", s.id)
       }
      } : {},
      children: [e.jsx("rect", {
       className: "nbox",
       width: W,
       height: D,
       rx: 9
      }), e.jsx("rect", {
       className: "nbar",
       width: 5,
       height: D,
       rx: 2
      }), e.jsx("text", {
       x: 13,
       y: 20,
       className: "n1",
       children: Se(s.title, s.kind === "bank" && M ? 14 : 19)
      }), e.jsx("text", {
       x: 13,
       y: 37,
       className: "n2",
       children: Te(c, s)
      }), e.jsx("text", {
       x: 13,
       y: 58,
       className: "n3",
       children: te(c, s, S)
      }), s.kind === "bank" && M && e.jsxs("g", {
       transform: `translate(${W-20},17)`,
       className: "nscore",
       children: [e.jsx("circle", {
        r: 13
       }), e.jsx("text", {
        y: 4.5,
        textAnchor: "middle",
        children: Math.round(M.score)
       })]
      }), z && e.jsxs("g", {
       transform: `translate(${W-22},${D-22})`,
       className: "nlock",
       children: [e.jsx("rect", {
        width: 16,
        height: 16,
        rx: 4
       }), e.jsx("path", {
        d: "M4.5 8h7v5h-7z M6 8V6.2a2 2 0 0 1 4 0V8",
        fill: "none",
        strokeWidth: "1.4"
       })]
      })]
     }, s.id)
    })]
   }), p.ncol > 6 && j !== "fit" && e.jsx("div", {
    className: "trail-hint",
    children: "Scroll sideways to follow the money → or press Fit"
   }), x && p.nodes.length <= 1 && e.jsx("div", {
    className: "trail-hint",
    children: "Nothing of the victim's money is left anywhere we can reach."
   })]
  })]
 })
}

function ze({
 G: t,
 t: n,
 setT: a,
 auto: o
}) {
 const {
  S: h
 } = B(), m = t.c.fraudAt - 3, c = h.clock, [i, x] = T.useState(!1), w = T.useRef(n);
 w.current = n, T.useEffect(() => {
  o && (a(m), x(!0))
 }, [o]), T.useEffect(() => {
  if (!i) return;
  const f = Math.max(1, c - m),
   v = Math.max(1, f / 140),
   k = setInterval(() => {
    const l = (w.current ?? c) + v;
    if (l >= c) {
     x(!1), a(null);
     return
    }
    a(l)
   }, 60);
  return () => clearInterval(k)
 }, [i, c, m, a]);
 const j = n ?? c,
  u = n == null,
  C = c - m > 1440 * 1.5;
 return e.jsxs("div", {
  className: "scrubber",
  children: [e.jsx("button", {
   className: "btn sm",
   onClick: () => {
    !i && (u || j >= c - 1) && a(m), x(!i)
   },
   "aria-label": i ? "Pause replay" : "Replay the money trail",
   children: i ? "❚❚ Pause" : "▶ Replay trail"
  }), e.jsx("input", {
   type: "range",
   min: m,
   max: c,
   step: C ? 10 : 1,
   value: j,
   onChange: f => {
    x(!1);
    const v = Number(f.target.value);
    a(v >= c ? null : v)
   },
   "aria-label": "Replay time"
  }), e.jsx("span", {
   className: "scrub-time mono",
   children: F(j)
  }), u ? e.jsxs("span", {
   className: "pill rec",
   children: [e.jsx("span", {
    className: "d"
   }), "Live ", F(c)]
  }) : e.jsxs("button", {
   className: "btn ghost sm",
   onClick: () => {
    x(!1), a(null)
   },
   children: ["Back to live ", F(c)]
  })]
 })
}

function Pe() {
 const t = B(),
  {
   D: n,
   caseId: a
  } = t;
 return e.jsx("div", {
  className: "case-picker",
  role: "tablist",
  "aria-label": "Case",
  children: n.order.map(o => {
   const h = n.cases.find(m => m.id === o);
   return e.jsxs("button", {
    role: "tab",
    "aria-selected": o === a,
    className: o === a ? "on" : "",
    onClick: () => t.openCase(o, t.page),
    children: [e.jsx("span", {
     className: "mono",
     children: o
    }), e.jsx("span", {
     className: "cp-sub",
     children: h.type
    })]
   }, o)
  })
 })
}
const Le = {
 fifo: "FIFO — the oldest money in an account leaves first. The usual convention for tracing fraud proceeds.",
 lifo: "LIFO — the newest money leaves first. Most favourable to the victim when a mule spends fresh money first.",
 prorata: "Pro-rata — every outflow carries the account's current share of victim money. Spreads the loss evenly."
};

function Fe({
 caseId: t
}) {
 const n = B(),
  [a, o] = T.useState(null),
  h = n.settings.method || "fifo",
  m = () => o({
   at: n.S.clock,
   cid: t,
   r: we(n.S, n.settings, t)
  }),
  c = a && a.at === n.S.clock && a.cid === t;
 return e.jsxs(I, {
  title: "Which money left first?",
  sub: "When an account mixes the victim's money with its own, the tracing convention decides how much of each outflow counts as stolen. Banks and courts use different ones, so Peecha shows all three.",
  children: [e.jsxs("div", {
   className: "btn-row",
   children: [e.jsx(Ne, {
    options: [
     ["fifo", "FIFO"],
     ["lifo", "LIFO"],
     ["prorata", "Pro-rata"]
    ],
    value: h,
    onChange: i => {
     n.setSetting("method", i), n.logSettings()
    }
   }), e.jsx("button", {
    className: "btn ghost sm",
    onClick: m,
    children: "Compare all three"
   })]
  }), e.jsx("p", {
   className: "sec",
   style: {
    fontSize: 12.5,
    marginTop: 8
   },
   children: Le[h]
  }), c && a.r && e.jsx("div", {
   className: "tbl-wrap",
   style: {
    marginTop: 10
   },
   children: e.jsxs("table", {
    className: "tbl",
    children: [e.jsx("thead", {
     children: e.jsxs("tr", {
      children: [e.jsx("th", {
       children: "Method"
      }), e.jsx("th", {
       className: "right",
       children: "Recoverable"
      }), e.jsx("th", {
       className: "right",
       children: "Secured"
      }), e.jsx("th", {
       className: "right",
       children: "In crypto"
      }), e.jsx("th", {
       className: "right",
       children: "Gone"
      }), e.jsx("th", {
       className: "right",
       children: "Trace"
      })]
     })
    }), e.jsx("tbody", {
     children: ["fifo", "lifo", "prorata"].map(i => e.jsxs("tr", {
      className: i === h ? "sel-row" : "",
      children: [e.jsx("td", {
       children: e.jsx("b", {
        children: i === "prorata" ? "Pro-rata" : i.toUpperCase()
       })
      }), e.jsx("td", {
       className: "right c-rec",
       children: $(a.r[i].recoverable)
      }), e.jsx("td", {
       className: "right",
       children: $(a.r[i].secured)
      }), e.jsx("td", {
       className: "right c-crypto",
       children: $(a.r[i].wallet)
      }), e.jsx("td", {
       className: "right c-exit",
       children: $(a.r[i].gone)
      }), e.jsxs("td", {
       className: "right mono",
       children: [a.r[i].ms.toFixed(0), " ms"]
      })]
     }, i))
    })]
   })
  })]
 })
}

function Re(t, n) {
 const {
  D: a,
  S: o
 } = t, h = a.W, m = a.graphs[n], c = m.c, i = a.states[n].tot, x = new Set(m.edges.filter(l => l.status === "done").map(l => l.to)), w = m.nodes.filter(l => l.kind === "bank" && x.has(l.id)), j = m
  .edges.find(l => l.from === c.victim && l.status === "done"), u = j ? h.accounts[j.to] : null, p = m.edges.filter(l => l.rail === "P2P" && l.status === "done"), C = m.nodes.filter(l => l.kind ===
   "exchange"), f = a.states[n].st, v = w.filter(l => f[l.id].status === "recoverable").sort((l, r) => f[r.id].v - f[l.id].v), k = [];
 return k.push(`${N(c.amount)} left ${h.accounts[c.victim].name}'s account at ${F(c.fraudAt)}${u?` and landed in ${u.name}'s account (${u.occ.toLowerCase()}, opened ${u.opened} days ago)`:""}.`), k
  .push(
   `It was split across ${w.length} mule account${w.length>1?"s":""} in ${new Set(w.map(l=>h.accounts[l.id].bank)).size} bank${new Set(w.map(l=>h.accounts[l.id].bank)).size>1?"s":""}${p.length?`, and ${$(p.reduce((l,r)=>l+r.taint,0))} was turned into ${H(p.reduce((l,r)=>l+r.amtOut,0))} through a P2P seller`:""}.`
   ), C.length && k.push("On-chain, the USDT reached an exchange deposit address — the one place a freeze works."), k.push(
   `Right now ${$(i.recoverable-i.secured)} can still be stopped${v.length?`, most of it at ${v.slice(0,2).map(l=>`${h.accounts[l.id].name} (${N(f[l.id].v)})`).join(" and ")}`:""}; ${$(i.secured)} is already secured and ${$(i.gone)} is gone.`
   ), k.join(" ")
}

function Ae() {
 const t = B(),
  {
   D: n,
   S: a,
   caseId: o,
   viewTime: h,
   setViewTime: m
  } = t,
  c = n.W,
  i = n.graphs[o],
  x = n.states[o],
  w = h ?? a.clock,
  j = T.useMemo(() => h == null ? x : ae(c, n.sim, i, h, {
   holds: a.holds,
   freezes: a.freezes
  }), [h, x, c, n.sim, i, a.holds, a.freezes]);
 if (!i) return null;
 const u = i.c,
  p = c.accounts[u.victim],
  C = ue(u, a.clock),
  f = j.tot,
  v = xe(t, o),
  k = fe(c, i, a.clock),
  l = v.items.length - v.done;
 return e.jsxs(e.Fragment, {
  children: [e.jsx(pe, {
   title: `Money trail · ${o}`,
   desc: u.story,
   sources: ["FIFO trace", "Bank + TRON"],
   actions: e.jsxs(e.Fragment, {
    children: [t.can("approve") && e.jsxs("button", {
     className: "btn",
     onClick: () => t.openCase(o, "action"),
     children: [e.jsx(Y, {
      name: "file",
      size: 15
     }), "Action pack ", l ? `(${l} to approve)` : "· all approved"]
    }), e.jsxs("button", {
     className: "btn ghost",
     onClick: () => {
      const x = document.getElementById("crypto-leg");
      x && x.scrollIntoView({
       behavior: "smooth",
       block: "start"
      })
     },
     children: [e.jsx(Y, {
      name: "coin",
      size: 15
     }), "Crypto leg ↓"]
    }), e.jsxs("button", {
     className: "btn ghost",
     onClick: () => {
      je(`${o}_evidence.csv`, ge(c, i, a.clock), "text/csv"), t.toast("Evidence timeline exported (CSV)")
     },
     children: [e.jsx(Y, {
      name: "download",
      size: 15
     }), "Evidence CSV"]
    })]
   })
  }), e.jsxs("div", {
   className: "facts",
   children: [e.jsxs("span", {
    children: [e.jsx("b", {
     children: "Victim"
    }), " ", p.name, p.masked ? null : [", ", p.ageY, " · ", p.city]]
   }), e.jsxs("span", {
    children: [e.jsx("b", {
     children: "Lost"
    }), " ", N(u.amount), " · ", be(u.fraudAt), " ", F(u.fraudAt)]
   }), e.jsxs("span", {
    children: [e.jsx("b", {
     children: "Reported"
    }), " ", ve(u.reportedAt, a.clock), " via ", u.channel]
   }), e.jsxs("span", {
    children: [e.jsx("b", {
     children: "Ack"
    }), " ", e.jsx("span", {
     className: "mono",
     children: u.ack
    })]
   }), e.jsx(J, {
    tone: C.tone === "accent" ? "accent" : C.tone,
    children: C.k === "golden" ? `⏱ Golden hour · ${ke(a.clock-u.fraudAt)} since fraud` : C.text
   }), e.jsx(J, {
    tone: v.tone,
    children: v.label
   })]
  }), e.jsxs("div", {
   className: "kpis",
   children: [e.jsx(R, {
    label: "Stolen",
    value: $(u.amount),
    sub: `${i.edges.filter(r=>r.from===u.victim).length} payments from the victim`
   }), e.jsx(R, {
    label: "Can still be stopped",
    value: $(f.recoverable - f.secured),
    tone: "rec",
    sub: "bank + exchange, not yet secured"
   }), e.jsx(R, {
    label: "Secured",
    value: $(f.secured),
    tone: "rec",
    sub: "held or frozen"
   }), e.jsx(R, {
    label: "In private wallets",
    value: $(f.wallet),
    tone: "crypto",
    sub: "watched on-chain"
   }), e.jsx(R, {
    label: "Gone",
    value: $(f.gone),
    tone: "exit",
    sub: "cash out / bridge"
   }), e.jsx(R, {
    label: "Outside our data",
    value: $(f.outside),
    sub: "other-bank requests drafted"
   })]
  }), e.jsxs(I, {
   title: "Live money trail",
   sub: "Each box is an account or wallet; line thickness = how much of the victim's money moved. Click any account for its mule score and reasons.",
   style: {
    marginTop: 18
   },
   bodyClass: "card-body",
   id: "trail-card",
   children: [e.jsx(ze, {
    G: i,
    t: h,
    setT: m
   }), e.jsx("div", {
    style: {
     marginTop: 12
    },
    children: e.jsx(ye, {
     tot: f,
     height: 12
    })
   }), e.jsx(Oe, {
    G: i,
    t: w
   }), e.jsxs("div", {
    className: "glegend",
    children: [e.jsxs("span", {
     children: [e.jsx("i", {
      className: "lg rec"
     }), "Money still here (recoverable)"]
    }), e.jsxs("span", {
     children: [e.jsx("i", {
      className: "lg held"
     }), "Held / frozen"]
    }), e.jsxs("span", {
     children: [e.jsx("i", {
      className: "lg crypto"
     }), "Crypto (USDT on TRON)"]
    }), e.jsxs("span", {
     children: [e.jsx("i", {
      className: "lg exit"
     }), "Gone (cash / bridge)"]
    }), e.jsxs("span", {
     children: [e.jsx("i", {
      className: "lg outside"
     }), "Outside our data"]
    }), e.jsxs("span", {
     children: [e.jsx("i", {
      className: "lg blocked"
     }), "Transfer blocked by a hold"]
    }), e.jsxs("span", {
     children: [e.jsx("i", {
      className: "lg score",
      children: "87"
     }), "Mule-risk score"]
    })]
   })]
  }), e.jsx("div", {
   style: {
    marginTop: 18
   },
   children: e.jsx(Fe, {
    caseId: o
   })
  }), e.jsxs("div", {
   className: "grid g-2e",
   children: [e.jsxs(I, {
    title: "Agent summary",
    sub: "Written by the investigation agent from the trail above; the officer decides.",
    children: [e.jsx("p", {
     className: "summary",
     children: Re(t, o)
    }), e.jsxs("div", {
     className: "btn-row",
     style: {
      marginTop: 14
     },
     children: [e.jsx("button", {
      className: "btn sm",
      onClick: () => t.toggleCopilot(!0, `summarise ${o}`),
      children: "Ask the copilot"
     }), e.jsx("button", {
      className: "btn ghost sm",
      onClick: () => t.toggleCopilot(!0, `hindi ${o}`),
      children: "Hindi mein samjhao"
     })]
    })]
   }), e.jsx(I, {
    title: "Accounts on this trail",
    sub: "Largest amount of victim money first. Click a name for the score and reasons.",
    children: i.nodes.filter(r => r.kind === "bank").sort((r, A) => x.st[A.id].v - x.st[r.id].v).map(r => e.jsxs("div", {
     className: "kv",
     children: [e.jsxs("span", {
      children: [e.jsx(X, {
       id: r.id
      }), " ", e.jsxs("span", {
       className: "muted",
       children: ["· ", c.accounts[r.id].occ]
      })]
     }), e.jsxs("span", {
      style: {
       display: "flex",
       gap: 8,
       alignItems: "center"
      },
      children: [x.st[r.id].v >= 1 && e.jsx("b", {
       children: N(x.st[r.id].v)
      }), e.jsx($e, {
       status: x.st[r.id].status
      })]
     })]
    }, r.id))
   })]
  }), e.jsx(T.Suspense, {
   fallback: null,
   children: e.jsx(CryptoLeg, {
    embedded: !0
   })
  }), e.jsx(I, {
   title: "Evidence timeline",
   sub: "Every hop with its reference, amount and the part that is the victim's money (FIFO). This is what goes into the action pack.",
   bodyClass: "",
   style: {
    marginTop: 18
   },
   children: e.jsx("div", {
    className: "tbl-wrap",
    style: {
     maxHeight: 460,
     overflowY: "auto"
    },
    children: e.jsxs("table", {
     className: "tbl",
     children: [e.jsx("thead", {
      children: e.jsxs("tr", {
       children: [e.jsx("th", {
        children: "Time"
       }), e.jsx("th", {
        children: "From → To"
       }), e.jsx("th", {
        children: "Rail · ref"
       }), e.jsx("th", {
        className: "right",
        children: "Amount"
       }), e.jsx("th", {
        className: "right",
        children: "Victim's money"
       }), e.jsx("th", {
        children: "Result"
       })]
      })
     }), e.jsx("tbody", {
      children: k.map((r, A) => e.jsxs("tr", {
       className: r.t > w ? "dim" : "",
       children: [e.jsx("td", {
        className: "mono nowrap",
        children: r.when
       }), e.jsxs("td", {
        className: "nowrap",
        children: [e.jsx(X, {
         id: r.from,
         children: Q(c, r.from)
        }), " → ", e.jsx(X, {
         id: r.to,
         children: Q(c, r.to)
        })]
       }), e.jsxs("td", {
        className: "nowrap",
        children: [e.jsx("span", {
         className: `rail r-${r.rail}`,
         children: r.rail
        }), " ", e.jsx("span", {
         className: "mono cell-sub",
         style: {
          display: "inline"
         },
         children: r.ref.length > 14 ? `${r.ref.slice(0,8)}…${r.ref.slice(-4)}` : r.ref
        })]
       }), e.jsxs("td", {
        className: "right nowrap",
        children: [r.cur === "USDT" ? H(r.amt) : N(r.amt), r.rail === "P2P" && e.jsxs("div", {
         className: "cell-sub",
         children: ["→ ", H(r.out)]
        })]
       }), e.jsx("td", {
        className: "right nowrap",
        children: N(r.taint)
       }), e.jsx("td", {
        children: r.status === "blocked" ? e.jsx("span", {
         className: "pill rec-solid",
         children: "⛔ Blocked"
        }) : e.jsx("span", {
         className: "pill neutral",
         children: "Done"
        })
       })]
      }, A))
     })]
    })
   })
  })]
 })
}
export {
 Pe as CasePicker, Re as agentSummary, Ae as
 default
};