import {
 u as A,
 e as i,
 N as $,
 B as j,
 s as k,
 j as s,
 R as w
} from "./index-DAvlYmAS.js";

function S() {
 const n = A(),
  {
   D: a
  } = n,
  r = a.W,
  [d, f] = i.useState(""),
  [g, c] = i.useState(0),
  h = i.useRef(null),
  API = window.PeechaAPI,
  L = API ? API.get() : null,
  live = !!L && L.status === "live" && L.role === "officer",
  [acc, setAcc] = i.useState([]);
 i.useEffect(() => {
  live && API.call("GET", "/accounts?limit=200").then(setAcc, () => {})
 }, [live]);
 i.useEffect(() => {
  h.current && h.current.focus()
 }, []);
 const o = i.useMemo(() => {
   const t = d.trim().toLowerCase(),
    l = Object.values(r.accounts).filter(e => a.scores[e.id] || e.role === "p2p"),
    u = [...$.map(([e, , m]) => ({
     g: "Pages",
     label: m,
     hint: "Go to",
     run: () => n.go(e)
    })), ...(live ? L.items.map(it => ({
     g: "Cases",
     label: `${it.c.id} · ${it.c.scam_type}`,
     hint: it.c.name,
     run: () => {
      API.pick.case = it.c.id, n.go("trail")
     }
    })) : a.order.map(e => {
     const m = a.cases.find(v => v.id === e);
     return {
      g: "Cases",
      label: `${e} · ${m.type}`,
      hint: r.accounts[m.victim].name,
      run: () => n.openCase(e)
     }
    })), ...!live && n.can("events") && !n.S.fired.complaint ? [{
     g: "Actions",
     label: "Ingest incoming 1930 complaint (C-3021)",
     hint: "Event",
     run: n.ingestComplaint
    }] : [], ...!live && n.can("events") ? [{
     g: "Actions",
     label: `Run scheduled re-trace (+${n.settings.step} min)`,
     hint: "Agent",
     run: n.retrace
    }, {
     g: "Actions",
     label: "New complaint (random scam)",
     hint: "Event",
     run: n.newComplaint
    }, {
     g: "Actions",
     label: "Import transactions (CSV)",
     hint: "Data",
     run: () => n.open("import", "csv")
    }] : [], {
     g: "Actions",
     label: n.theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
     hint: "Theme",
     run: n.toggleTheme
    }, {
     g: "Actions",
     label: n.degraded ? "Restore link" : "Simulate link loss",
     hint: "Resilience",
     run: n.toggleLink
    }, {
     g: "Actions",
     label: "Reset demo to 14:18",
     hint: "Demo",
     run: () => n.resetDemo()
    }, {
     g: "Actions",
     label: "Open AI copilot",
     hint: "Assist",
     run: () => n.toggleCopilot(!0)
    }, ...live && t.length >= 2 ? acc.filter(x => `${x.holder_name||""} ${x.account_id} ${x.city||""}`.toLowerCase().includes(t)).slice(0, 25).map(x => ({
     g: "Accounts",
     label: `${x.holder_name||x.account_id} · ${x.account_id}`,
     hint: x.score == null ? x.bank_id || x.kind : `${x.bank_id||x.kind} · score ${Math.round(Number(x.score))}`,
     run: () => {
      API.pick.account = x.account_id, n.go("accounts")
     }
    })) : [], ...!live && t.length >= 2 ? l.filter(e => `${e.name} ${e.mask} ${e.id} ${e.city}`.toLowerCase().includes(t)).slice(0, 25).map(e => ({
     g: "Accounts",
     label: `${e.name} · ${e.mask}`,
     hint: `${j[e.bank]}${a.scores[e.id]?` · score ${Math.round(a.scores[e.id].score)}`:""}`,
     run: () => n.open("account", e.id)
    })) : [], ...!live && t.length >= 3 ? Object.values(r.wallets).filter(e => e.id.toLowerCase().includes(t) || e.label.toLowerCase().includes(t)).slice(0, 10).map(e => ({
     g: "Wallets",
     label: k(e.id),
     hint: e.label,
     run: () => n.open("wallet", e.id)
    })) : []];
   return t ? u.filter(e => `${e.label} ${e.hint} ${e.g}`.toLowerCase().includes(t)) : u
  }, [d, a, r, n, L, acc, live]),
  p = t => {
   n.togglePalette(!1), t.run()
  },
  C = t => {
   t.key === "ArrowDown" && (t.preventDefault(), c(l => Math.min(o.length - 1, l + 1))), t.key === "ArrowUp" && (t.preventDefault(), c(l => Math.max(0, l - 1))), t.key === "Enter" && o[g] && p(o[g])
  };
 let b = null;
 return s.jsx("div", {
  className: "backdrop",
  onClick: () => n.togglePalette(!1),
  children: s.jsxs("div", {
   className: "palette",
   onClick: t => t.stopPropagation(),
   role: "dialog",
   "aria-label": "Command palette",
   children: [s.jsx("input", {
    ref: h,
    value: d,
    onChange: t => {
     f(t.target.value), c(0)
    },
    onKeyDown: C,
    placeholder: "Search cases, account holders, wallets, pages or actions…",
    "aria-label": "Search"
   }), s.jsxs("div", {
    className: "pal-list",
    children: [o.length === 0 && s.jsx("div", {
     className: "muted",
     style: {
      padding: 18,
      fontSize: 13
     },
     children: "No matches."
    }), o.slice(0, 70).map((t, l) => {
     const u = t.g !== b ? s.jsx("div", {
      className: "pal-grp",
      children: t.g
     }) : null;
     return b = t.g, s.jsxs(w.Fragment, {
      children: [u, s.jsxs("button", {
       className: `pal-item ${l===g?"on":""}`,
       onMouseEnter: () => c(l),
       onClick: () => p(t),
       children: [s.jsx("span", {
        children: t.label
       }), s.jsx("span", {
        className: "muted",
        style: {
         fontSize: 12
        },
        children: t.hint
       })]
      })]
     }, l)
    })]
   })]
  })
 })
}
export {
 S as
 default
};