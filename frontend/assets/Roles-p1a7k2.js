import {
 u as useApp,
 e as R,
 P as PageHead,
 K as Kpi,
 C as Card,
 a as Pill,
 G as Modal,
 M as Meter,
 J as BS,
 i as inrS,
 b as inr,
 d as dur,
 n as nameOf,
 w as tfmt,
 t as KIND,
 c as caseStatus,
 x as sha,
 k as dl,
 D as ROLES
} from "./index-DAvlYmAS.js";
import { Offline } from "./Officer.js";
const h = R.createElement;
/* live backend data for the consumer screens (assets/api.js); status "live" = use it, anything else = demo engine */
const API = window.PeechaAPI || {
 get: () => ({ status: "offline", items: [] }),
 subscribe: () => () => {},
 refresh: () => Promise.resolve(),
 file: () => Promise.reject(new Error("backend client missing"))
};

function useLive() {
 const s = R.useSyncExternalStore(API.subscribe, API.get),
  e = useApp(),
  role = e.user ? (e.user.key === "analyst" ? "analyst:" + e.bank : e.user.key) : "consumer";
 R.useEffect(() => {
  API.use && API.use(role)
 }, [role, s.status]);
 return s.role === role ? s : {
  ...s,
  status: "idle",
  items: []
 }
}
const utcDate = ts => ts ? new Date(/Z|[+-]\d\d:?\d\d$/.test(ts) ? ts : ts + "Z") : null;
const liveWhen = ts => {
 const d = utcDate(ts);
 return d ? d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—"
};
const TONE = {
 requested: "accent",
 active: "med",
 confirmed: "rec-solid",
 expired: "neutral",
 rejected: "neutral",
 released: "neutral"
};
const LBL = {
 requested: "Waiting for bank",
 active: "Temporary hold",
 confirmed: "Confirmed",
 expired: "Expired",
 rejected: "Rejected",
 released: "Released"
};
const maskId = (W, id) => {
 const a = W.accounts[id];
 return a ? `${BS[a.bank]||a.bank} ${a.mask}` : id
};
const SCAMS = ["Fake bank / KYC call", "Digital arrest", "Investment / trading", "Fake job", "Loan app", "Online shopping", "Other"];

/* ---------------------------------------------------------------- Holds */
const ActionPack = R.lazy(() => import("./Action-DTQ8EHbi.js"));
const whoName = x => (x || "—").replace(/^[A-Z]:/, "");

function holdEvents(e, now) {
 const role = e.user.key,
  out = [];
 for (const x0 of e.holds2) {
  if (role === "analyst" && x0.bank !== e.bank) continue;
  const x = x0.status === "active" && now >= x0.expiresAt ? {
   ...x0,
   status: "expired"
  } : x0;
  const add = (t, action, who, basis) => out.push({
   t,
   action,
   hold: x,
   who: whoName(who),
   why: x.reason,
   basis
  });
  add(x.placedAt, x.origin === "bank" ? "Temporary 24 h hold placed" : "Hold requested from bank", x.placedBy, x.origin === "bank" ? "Bank" : "Officer decision");
  if (x.executedAt) add(x.executedAt, "Hold carried out by the bank", x.executedBy, "Bank");
  if (x.status === "confirmed" && x.origin === "bank" && x.decidedAt) add(x.decidedAt, "Confirmed by officer", x.decidedBy, "Officer decision");
  if (x.status === "rejected") add(x.decidedAt, "Rejected by officer, hold lifted", x.decidedBy, "Officer decision");
  if (x.status === "released") add(x.decidedAt, x.executedAt || x.origin === "bank" || x.decidedAt ? "Released" : "Request cancelled", x.decidedBy, /^O:/.test(x.decidedBy || "") ? "Officer decision" :
   "Bank");
  if (x.status === "expired") add(x.expiresAt, "Expired: no officer confirmation in 24 h, hold lifted", "system", "Bank");
 }
 return out.sort((a, b) => b.t - a.t);
}

function packRows(e) {
 const {
  D
 } = e, W = D.W, role = e.user.key, out = [];
 for (const cid of D.order) {
  let items = [];
  try {
   items = e.pack(cid)
  } catch (_) {}
  for (const it of items) {
   const ap = e.approvals[`${cid}|${it.id}`];
   if (!ap) continue;
   let tg = it.to;
   if (role === "analyst") {
    if (it.kind !== "hold") continue;
    const own = it.targets.filter(a => W.accounts[a] && W.accounts[a].bank === e.bank);
    if (!own.length) continue;
    tg = own.map(a => maskId(W, a)).join(", ");
   }
   out.push({
    t: ap.at,
    action: KIND[it.kind] || it.kind,
    target: tg,
    by: whoName(ap.by),
    basis: `AI draft (approved by ${whoName(ap.by)})`,
    case: cid
   });
  }
 }
 return out;
}

function actionRows(e, now) {
 const {
  D,
  S
 } = e, W = D.W, role = e.user.key, rows = [];
 for (const c of D.cases) rows.push({
  t: c.reportedAt,
  action: "Complaint received",
  target: `${c.id} · ${c.type}`,
  by: c.channel,
  basis: "Consumer complaint",
  case: c.id
 });
 for (const f of e.myFiled) rows.push({
  t: f.filedAt,
  action: "Complaint filed",
  target: `${f.id} · ${f.scamType}`,
  by: f.filedBy,
  basis: f.basis || "Consumer complaint",
  case: f.id
 });
 for (const ev of holdEvents(e, now)) rows.push({
  t: ev.t,
  action: ev.action,
  target: `${maskId(W,ev.hold.account)} · ${ev.hold.id}`,
  by: ev.who,
  basis: ev.basis,
  case: ev.hold.complaint || ""
 });
 for (const r of packRows(e)) rows.push(r);
 for (const ac in e.calls) {
  const A = W.accounts[ac];
  if (!A) continue;
  if (role === "analyst" && A.bank !== e.bank) continue;
  const cl = e.calls[ac];
  rows.push({
   t: cl.at,
   action: "Warning call · " + cl.label,
   target: maskId(W, ac),
   by: cl.by,
   basis: cl.by === e.officerName ? "Officer decision" : "Bank",
   case: ""
  });
 }
 return rows.sort((a, b) => b.t - a.t);
}

function HoldTable({
 e,
 rows,
 empty
}) {
 const {
  D,
  S
 } = e, W = D.W, role = e.user.key, now = S.clock + e.holdSkew;
 const risk = a => (D.inTrail[a] || []).reduce((s, c) => {
  const st = D.states[c] && D.states[c].st[a];
  return s + (st ? st.v : 0)
 }, 0);
 const timeCell = x => {
  if (x.status === "active") return h("span", {
   className: x.expiresAt - now < 360 ? "c-exit" : ""
  }, dur(x.expiresAt - now) + " left");
  if (x.status === "requested") return h("span", {
   className: "muted"
  }, "Waiting for bank");
  if (x.status === "confirmed") return h("span", {
   className: "muted"
  }, "Until released");
  return h(Pill, {
   tone: TONE[x.status]
  }, LBL[x.status]);
 };
 const actions = x => {
  if (role === "officer") {
   if (x.status === "active") return h("span", {
     className: "btn-row",
     style: {
      justifyContent: "flex-end"
     }
    },
    h("button", {
     className: "btn sm",
     onClick: () => e.confirmHold(x.id)
    }, "Confirm hold"),
    h("button", {
     className: "btn ghost sm",
     onClick: () => e.rejectHold(x.id)
    }, "Reject"));
   if (x.status === "confirmed") return h("button", {
    className: "btn ghost sm",
    onClick: () => e.releaseHold(x.id)
   }, "Release");
   if (x.status === "requested") return h("button", {
    className: "btn ghost sm",
    onClick: () => e.releaseHold(x.id)
   }, "Cancel request");
  } else {
   if (x.status === "requested") return h("button", {
    className: "btn sm",
    onClick: () => e.executeHold(x.id)
   }, "Mark done");
   if (x.status === "active") return h("button", {
    className: "btn ghost sm",
    onClick: () => e.releaseHold(x.id)
   }, "Withdraw");
  }
  return null;
 };
 if (!rows.length) return h("div", {
  className: "empty"
 }, h("b", null, empty));
 return h("div", {
  className: "tbl-wrap"
 }, h("table", {
   className: "tbl"
  },
  h("thead", null, h("tr", null, ["Account", "Reason", "Score", "At risk", "Time left", ""].map((c, i) => h("th", {
   key: i
  }, c)))),
  h("tbody", null, rows.map(x => h("tr", {
    key: x.id
   },
   h("td", null, h("div", {
     className: "cell-main"
    }, maskId(W, x.account)),
    h("div", {
     className: "cell-sub"
    }, (W.accounts[x.account] ? W.accounts[x.account].name + " · " : ""), x.id, " · ", x.origin === "bank" ? "placed by bank" : "requested by cyber cell")),
   h("td", {
    style: {
     maxWidth: 340,
     fontSize: 13
    }
   }, x.reason),
   h("td", null, x.score == null ? "—" : x.score),
   h("td", null, risk(x.account) >= 1 ? inrS(risk(x.account)) : "—"),
   h("td", null, timeCell(x)),
   h("td", {
    style: {
     textAlign: "right",
     whiteSpace: "nowrap"
    }
   }, actions(x)))))));
}
export function Holds() {
 const e = useApp(),
  {
   D,
   S
  } = e,
  W = D.W,
  role = e.user.key,
  now = S.clock + e.holdSkew;
 const [tab, setTab] = R.useState(role === "officer" ? "actions" : "requests");
 const [open, setOpen] = R.useState(!!e.holdPrefill);
 const [acct, setAcct] = R.useState(e.holdPrefill || "");
 const [why, setWhy] = R.useState("");
 R.useEffect(() => {
  if (!e.holdsSeeded) e.seedHolds()
 }, [e.holdsSeeded]);
 R.useEffect(() => {
  if (e.holds2.some(x => x.status === "active" && now >= x.expiresAt)) e.expireHolds()
 }, [now, e.holds2]);
 R.useEffect(() => {
  if (e.page === "action" && role === "officer") setTab("actions")
 }, [e.page]);
 const all = e.holds2.filter(x => role === "officer" || x.bank === e.bank).map(x => x.status === "active" && now >= x.expiresAt ? {
  ...x,
  status: "expired"
 } : x);
 const need = all.filter(x => x.status === "active").sort((a, b) => a.expiresAt - b.expiresAt);
 const reqs = all.filter(x => x.status === "requested").sort((a, b) => b.placedAt - a.placedAt);
 const conf = all.filter(x => x.status === "confirmed").sort((a, b) => b.placedAt - a.placedAt);
 const live = all.filter(x => x.status === "active" || x.status === "confirmed");
 const caseHeld = Object.keys(S.holds || {}).filter(k => S.holds[k] <= S.clock && W.accounts[k] && (role !== "analyst" || W.accounts[k].bank === e.bank));
 const heldSet = new Set([...live.map(x => x.account), ...caseHeld]);
 const risk = a => (D.inTrail[a] || []).reduce((s, c) => {
  const st = D.states[c] && D.states[c].st[a];
  return s + (st ? st.v : 0)
 }, 0);
 const taken = new Set(e.holds2.filter(x => ["active", "confirmed", "requested"].includes(x.status)).map(x => x.account));
 const pool = (role === "analyst" ? Object.keys(D.scores) : [...new Set([...D.alerts, ...Object.keys(D.scores).filter(k => D.scores[k].score >= e.settings.holdThr)])])
  .filter(k => W.accounts[k] && D.scores[k] && !taken.has(k)).sort((a, b) => D.scores[b].score - D.scores[a].score).slice(0, 60);
 const submit = () => {
  if (!acct || !why.trim()) return;
  role === "analyst" ? e.placeHold(acct, why) : e.requestHold(acct, why);
  setWhy("");
  setAcct("");
  setOpen(false);
 };
 const evs = holdEvents(e, now);
 const bankNeeds = role === "analyst" ? [...reqs, ...need.slice().sort((a, b) => a.expiresAt - b.expiresAt)] : [];
 const tabs = role === "officer" ? [
  ["actions", "Actions", need.length + reqs.length],
  ["history", "History", evs.length]
 ] : [
  ["requests", "Requests to my bank", bankNeeds.length],
  ["history", "History", evs.length]
 ];
 const history = h(R.Fragment, null,
  h(Card, {
    title: "Holds, releases and expiries",
    sub: role === "officer" ? "Every hold action on every bank, newest first." : "Every hold action on your bank's accounts, newest first.",
    bodyClass: "",
    style: {
     marginTop: 0
    }
   },
   evs.length === 0 ? h("div", {
    className: "empty"
   }, h("b", null, "Nothing has happened yet.")) :
   h("div", {
    className: "tbl-wrap"
   }, h("table", {
     className: "tbl"
    },
    h("thead", null, h("tr", null, ["When", "What happened", "Account", "By", "Why"].map((c, i) => h("th", {
     key: i
    }, c)))),
    h("tbody", null, evs.map((v, i) => h("tr", {
      key: i
     },
     h("td", {
      className: "mono nowrap"
     }, tfmt(v.t, S.clock)),
     h("td", null, v.action, h("div", {
      className: "cell-sub"
     }, v.hold.id, " · ", LBL[v.hold.status])),
     h("td", null, maskId(W, v.hold.account)),
     h("td", {
      className: "nowrap"
     }, v.who),
     h("td", {
      style: {
       maxWidth: 360,
       fontSize: 13
      }
     }, v.why))))))),
  role === "officer" && h("div", {
   style: {
    marginTop: 18
   }
  }, h(Card, {
    title: "Approved requests and freezes",
    sub: "Letters and requests from the action pack that an officer approved.",
    bodyClass: ""
   },
   packRows(e).length === 0 ? h("div", {
    className: "empty"
   }, h("b", null, "None yet.")) :
   h("div", {
    className: "tbl-wrap"
   }, h("table", {
     className: "tbl"
    },
    h("thead", null, h("tr", null, ["When", "Action", "Sent to", "Approved by", "Case"].map((c, i) => h("th", {
     key: i
    }, c)))),
    h("tbody", null, packRows(e).sort((a, b) => b.t - a.t).map((v, i) => h("tr", {
      key: i
     },
     h("td", {
      className: "mono nowrap"
     }, tfmt(v.t, S.clock)), h("td", null, v.action), h("td", null, v.target), h("td", null, v.by), h("td", {
      className: "mono"
     }, v.case)))))))));
 return h(R.Fragment, null,
  h(PageHead, {
   title: "Holds",
   desc: role === "officer" ? "Decide on bank holds, ask a bank to hold an account, and approve the agent's drafted actions." :
    "Carry out hold requests from the cyber cell, or place a 24-hour hold on one of your own accounts. Unconfirmed holds lift on their own.",
   actions: h(R.Fragment, null,
    h("button", {
     className: "btn",
     onClick: () => setOpen(!open)
    }, open ? "Close form" : role === "analyst" ? "＋ Place a 24-hour hold" : "＋ Request a hold from a bank"),
    h("button", {
     className: "btn ghost",
     onClick: () => e.advanceHolds(720),
     title: "Demo only: move the hold clock forward"
    }, "Fast-forward 12 h (demo)"))
  }),
  h("div", {
    className: "kpis"
   },
   h(Kpi, {
    label: role === "officer" ? "Waiting for your decision" : "Requests to carry out",
    value: role === "officer" ? need.length : reqs.length,
    tone: (role === "officer" ? need.length : reqs.length) ? "accent" : "rec",
    sub: role === "officer" ? "temporary bank holds" : "from the cyber cell"
   }),
   h(Kpi, {
    label: "Holds in place",
    value: heldSet.size,
    sub: `${caseHeld.filter(k => !live.some(x => x.account === k)).length} from case action packs · ${live.length} bank holds`
   }),
   h(Kpi, {
    label: "Money behind holds",
    value: inrS([...heldSet].reduce((s, a) => s + risk(a), 0)),
    tone: "rec",
    sub: "victim money on held accounts"
   })),
  open && h(Card, {
    title: role === "analyst" ? "Place a 24-hour hold" : "Request a hold",
    sub: role === "analyst" ? "Only your own bank's accounts are listed. The officer will be asked to confirm." : "The bank is asked to hold the account and mark it done.",
    style: {
     marginTop: 18
    }
   },
   h("div", {
     className: "rl-form"
    },
    h("label", null, "Account",
     h("select", {
       className: "select",
       value: acct,
       onChange: ev => setAcct(ev.target.value)
      },
      h("option", {
       value: ""
      }, "Choose an account…"),
      pool.map(k => h("option", {
       key: k,
       value: k
      }, `${maskId(W,k)} · ${W.accounts[k].name} · score ${Math.round(D.scores[k].score)}`)))),
    h("label", null, "Reason (required)",
     h("textarea", {
      className: "input",
      rows: 3,
      value: why,
      placeholder: "e.g. New account, money in and out within minutes",
      onChange: ev => setWhy(ev.target.value)
     })),
    h("div", {
      className: "btn-row"
     },
     h("button", {
      className: "btn",
      disabled: !acct || !why.trim(),
      onClick: submit
     }, role === "analyst" ? "Place hold for 24 hours" : "Send request"),
     h("button", {
      className: "btn ghost",
      onClick: () => setOpen(false)
     }, "Cancel")))),
  h("div", {
   className: "rl-tabs page-tabs",
   role: "tablist"
  }, tabs.map(([k, l, c]) => h("button", {
   key: k,
   role: "tab",
   "aria-selected": tab === k,
   className: tab === k ? "on" : "",
   onClick: () => setTab(k)
  }, l, " ", h("span", {
   className: "rl-count"
  }, c)))),
  h("div", {
    style: {
     marginTop: 18
    }
   },
   tab === "history" ? history :
   role === "analyst" ? h(Card, {
    title: "Requests to my bank",
    sub: "Hold requests from the cyber cell, and the temporary holds you placed.",
    bodyClass: ""
   }, h(HoldTable, {
    e,
    rows: bankNeeds,
    empty: "Nothing waiting. Use “Place a 24-hour hold” to hold one of your accounts."
   })) :
   h(R.Fragment, null,
    h(Card, {
     title: "Waiting for your decision",
     sub: "Temporary 24-hour holds placed by banks. Confirm to make them last, or reject to lift them.",
     bodyClass: ""
    }, h(HoldTable, {
     e,
     rows: need,
     empty: "No bank holds are waiting for your decision."
    })),
    h("div", {
     style: {
      marginTop: 18
     }
    }, h(Card, {
     title: "Asked of banks and in place",
     sub: "Requests you sent and holds you confirmed.",
     bodyClass: ""
    }, h(HoldTable, {
     e,
     rows: [...reqs, ...conf],
     empty: "No requests or confirmed holds."
    }))),
    h("div", {
      style: {
       marginTop: 28
      }
     },
     h("h2", {
      className: "serif",
      style: {
       fontSize: 22,
       fontWeight: 700,
       margin: "0 0 4px"
      }
     }, "Drafted actions"),
     h("p", {
      className: "sec",
      style: {
       fontSize: 13.5,
       margin: "0 0 6px"
      }
     }, "The agent reads the case story and the money trail, then drafts the holds, exchange freeze, P2P seller request, issuer request and STR. Nothing is sent until you approve."),
     h(R.Suspense, {
      fallback: h("div", {
       className: "muted",
       style: {
        padding: 20
       }
      }, "Loading…")
     }, h(ActionPack))))));
}

/* ------------------------------------------------------- Filed complaints */
export function FiledList() {
 const e = useApp(),
  list = e.myFiled;
 if (!list || !list.length) return null;
 return h("div", {
  style: {
   marginTop: 18
  }
 }, h(Card, {
   title: "Newly filed complaints",
   sub: "Waiting to be traced.",
   bodyClass: ""
  },
  h("div", {
   className: "tbl-wrap"
  }, h("table", {
    className: "tbl"
   },
   h("thead", null, h("tr", null, ["Complaint", "Scam", "Lost", "Paid to", "Filed by", "Status", ""].map((c, i) => h("th", {
    key: i
   }, c)))),
   h("tbody", null, list.slice().reverse().map(f => h("tr", {
     key: f.id
    },
    h("td", null, h("div", {
     className: "cell-main mono"
    }, f.id), h("div", {
     className: "cell-sub"
    }, f.name, " · ", f.city || "—")),
    h("td", null, f.scamType),
    h("td", null, inr(f.amount)),
    h("td", null, f.destination === "crypto" ? "Crypto wallet" : "Bank / UPI"),
    h("td", null, f.filedBy, h("div", {
     className: "cell-sub"
    }, f.filedVia)),
    h("td", null, h(Pill, {
     tone: f.status === "filed" ? "accent" : "info"
    }, f.status === "filed" ? "Filed" : "Tracing")),
    h("td", {
     style: {
      textAlign: "right"
     }
    }, e.can("holdDecide") && f.status === "filed" ? h("button", {
     className: "btn sm",
     onClick: () => e.startTrace(f.id)
    }, "Start trace") : null))))))));
}

/* ---------------------------------------------------- Complaint form modal */
export function FileComplaint() {
 const e = useApp(),
  W = e.D.W,
  role = e.user.key;
 const me = role === "consumer" ? W.accounts[e.victimId] : null;
 const [f, setF] = R.useState({
  name: role === "consumer" ? API.get().userName || "" : "",
  phone: "",
  city: me ? me.city : "",
  victimAccount: me ? `${BS[me.bank]} ${me.mask}` : "",
  scamType: SCAMS[0],
  amount: "",
  fraudTime: "",
  destination: "bank",
  ref: "",
  description: ""
 });
 const [busy, setBusy] = R.useState(false);
 const live = useLive(),
  useBackend = live.status === "live";
 const set = k => ev => setF({
  ...f,
  [k]: ev.target.value
 });
 const ok = f.name.trim() && Number(f.amount) > 0 && f.victimAccount.trim() && f.ref.trim();
 const fld = (label, node) => h("label", null, label, node);
 return h(Modal, {
   label: "File a complaint",
   width: 640
  },
  h("h2", {
   className: "modal-title"
  }, "File a complaint"),
  h("p", {
   className: "sec",
   style: {
    fontSize: 13.5,
    margin: "4px 0 16px"
   }
  }, role === "consumer" ? "Tell us what happened. We start following the money as soon as an officer picks it up." : "File on behalf of a customer or a caller. It appears in the inbox as Filed."),
  h("div", {
    className: "rl-form two"
   },
   fld("Name", h("input", {
    className: "input",
    value: f.name,
    onChange: set("name")
   })),
   fld("Phone", h("input", {
    className: "input",
    value: f.phone,
    onChange: set("phone"),
    placeholder: "+91 …"
   })),
   fld("City", h("input", {
    className: "input",
    value: f.city,
    onChange: set("city")
   })),
   fld("Account the money left from", h("input", {
    className: "input",
    value: f.victimAccount,
    onChange: set("victimAccount"),
    placeholder: "Bank and last 4 digits"
   })),
   fld("Type of scam", h("select", {
    className: "select",
    value: f.scamType,
    onChange: set("scamType")
   }, SCAMS.map(s => h("option", {
    key: s
   }, s)))),
   fld("Amount lost (₹)", h("input", {
    className: "input",
    type: "number",
    min: "0",
    value: f.amount,
    onChange: set("amount")
   })),
   fld("When did it happen", h("input", {
    className: "input",
    type: "datetime-local",
    value: f.fraudTime,
    onChange: set("fraudTime")
   })),
   fld("Where did the money go", h("select", {
    className: "select",
    value: f.destination,
    onChange: set("destination")
   }, h("option", {
    value: "bank"
   }, "To a bank account / UPI"), h("option", {
    value: "crypto"
   }, "To a crypto wallet"))),
   fld(f.destination === "crypto" ? "Wallet address" : "UTR or UPI ID", h("input", {
    className: "input mono",
    value: f.ref,
    onChange: set("ref"),
    placeholder: f.destination === "crypto" ? "T… (TRON) or 0x…" : "12-digit UTR or name@bank"
   }))),
  h("div", {
   className: "rl-form",
   style: {
    marginTop: 14
   }
  }, fld("What happened (optional)", h("textarea", {
   className: "input",
   rows: 3,
   value: f.description,
   onChange: set("description")
  }))),
  h("div", {
    className: "btn-row",
    style: {
     marginTop: 14
    }
   },
   h("button", {
    className: "btn",
    disabled: !ok || busy || !useBackend,
    onClick: () => {
     if (!useBackend) return;
     setBusy(true);
     API.file(f).then(r => {
      e.close();
      e.toast(`Complaint ${r.id} filed`)
     }, err => {
      setBusy(false);
      e.toast(`Could not file: ${err.message}`)
     })
    }
   }, busy ? "Submitting…" : "Submit complaint"),
   h("button", {
    className: "btn ghost",
    onClick: e.close
   }, "Cancel")));
}

/* ------------------------------------------------------- Consumer: My complaints */
function Steps({
 items
}) {
 return h("ol", {
  className: "steps4"
 }, items.map(([l, on], i) => h("li", {
  key: i,
  className: on ? "on" : ""
 }, h("span", {
  className: "dot"
 }, on ? "✓" : i + 1), l)));
}

function CaseCard({
 c
}) {
 const e = useApp(),
  {
   D,
   S
  } = e,
  W = D.W,
  st = D.states[c.id],
  g = D.graphs[c.id];
 const [det, setDet] = R.useState(false);
 if (!st || !g) return null;
 const t = st.tot,
  notified = Object.keys(e.approvals).some(k => k.startsWith(c.id + "|")),
  crypto = t.wallet + t.exchange + t.bridge;
 const hops = g.links.filter(l => l.status === "done").sort((a, b) => a.t0 - b.t0);
 return h(Card, {
   title: `${c.type}`,
   sub: `${c.id} · reported ${tfmt(c.reportedAt,S.clock)} · ${inr(c.amount)} lost`,
   style: {
    marginTop: 18
   }
  },
  h(Steps, {
   items: [
    ["Filed", true],
    ["Tracing", true],
    ["Bank notified", notified],
    ["Money held", t.secured > 0]
   ]
  }),
  h("div", {
   className: "rl-mine-money"
  }, h("div", {
   className: "cell-main",
   style: {
    marginBottom: 8
   }
  }, "Where is my money?"), h(Meter, {
   tot: t,
   height: 14
  })),
  h("div", {
    className: "kpis three"
   },
   h(Kpi, {
    label: "Lost",
    value: inrS(t.stolen)
   }),
   h(Kpi, {
    label: "Can still be stopped",
    value: inrS(Math.max(0, t.recoverable - t.secured)),
    tone: "rec"
   }),
   h(Kpi, {
    label: "Already secured",
    value: inrS(t.secured),
    tone: "rec"
   })),
  crypto >= 1 && h("div", {
    className: "note info"
   }, `${inrS(crypto)} of your money was converted to crypto (USDT). `,
   t.exchange - t.frozen >= 1 ? `${inrS(t.exchange-t.frozen)} reached an exchange, where it can be frozen. ` : "",
   t.wallet >= 1 ? `${inrS(t.wallet)} sits in private wallets that we are watching.` : ""),
  e.calls[e.victimId] && h("div", {
   className: "note ok"
  }, `A warning call was made to you at ${tfmt(e.calls[e.victimId].at,S.clock)}.`),
  h("div", {
   style: {
    marginTop: 12
   }
  }, h("button", {
   className: "btn ghost sm",
   onClick: () => setDet(!det)
  }, det ? "Hide details" : "Details")),
  det && h("div", {
   className: "tbl-wrap",
   style: {
    marginTop: 10
   }
  }, h("table", {
    className: "tbl"
   },
   h("thead", null, h("tr", null, ["Time", "From → To", "Amount of your money", "How"].map((x, i) => h("th", {
    key: i
   }, x)))),
   h("tbody", null, hops.map((l, i) => h("tr", {
     key: i
    },
    h("td", {
     className: "mono nowrap"
    }, tfmt(l.t0, S.clock)),
    h("td", null, nameOf(W, l.from), " → ", nameOf(W, l.to)),
    h("td", null, inrS(l.taint)),
    h("td", null, l.rail)))))));
}
function LiveCard({
 it
}) {
 const {
  c,
  payments,
  trail
 } = it, [det, setDet] = R.useState(false);
 const tracing = c.status !== "open",
  hop0 = trail.length ? Math.min(...trail.map(x => x.hop)) : 0,
  sum = f => trail.filter(f).reduce((t, x) => t + Number(x.traced_amount), 0),
  first = sum(x => x.hop === hop0),
  cash = sum(x => x.to_ref === "CASH"),
  blocked = sum(x => x.status === "blocked"),
  cryptoHop = trail.filter(x => x.leg === "crypto").map(x => x.hop),
  crypto = cryptoHop.length ? sum(x => x.leg === "crypto" && x.hop === Math.min(...cryptoHop)) : 0;
 return h(Card, {
   title: c.scam_type,
   sub: `${c.id} · reported ${liveWhen(c.reported_at)} · ${inr(Number(c.total_lost))} lost`,
   style: {
    marginTop: 18
   }
  },
  h(Steps, {
   items: [
    ["Filed", true],
    ["Tracing", tracing],
    ["Bank notified", c.status === "actioned" || c.status === "closed"],
    ["Money held", c.status === "closed"]
   ]
  }),
  h("p", {
   className: "sec",
   style: {
    fontSize: 13,
    marginTop: 12
   }
  }, c.status === "open" ? "Received. An officer will start the trace shortly." : trail.length ? `Your money has moved through ${new Set(trail.map(x => x.to_ref)).size} account(s) so far.` : "An officer has started tracing your money."),
  trail.length > 0 && h("div", {
   className: "kpis",
   style: {
    marginTop: 12
   }
  }, h(Kpi, {
   label: "Lost",
   value: inrS(Number(c.total_lost))
  }), h(Kpi, {
   label: "Followed so far",
   value: inrS(first)
  }), h(Kpi, {
   label: "Withdrawn as cash",
   value: inrS(cash),
   tone: "exit"
  }), h(Kpi, {
   label: "Stopped",
   value: inrS(blocked),
   tone: "rec"
  })),
  crypto > 0 && h("div", {
   className: "note info"
  }, `${inrS(crypto)} of your money was converted to crypto (USDT).`),
  payments.length > 0 && h("div", {
   className: "note info"
  }, `You reported ${payments.length} payment(s) totalling ${inr(payments.reduce((s, p) => s + Number(p.amount), 0))}.`),
  trail.length > 0 && h("div", {
   style: {
    marginTop: 12
   }
  }, h("button", {
   className: "btn ghost sm",
   onClick: () => setDet(!det)
  }, det ? "Hide details" : "Details")),
  det && h("div", {
   className: "tbl-wrap",
   style: {
    marginTop: 10
   }
  }, h("table", {
    className: "tbl"
   },
   h("thead", null, h("tr", null, ["Time", "From → To", "Amount of your money", "How"].map((x, i) => h("th", {
    key: i
   }, x)))),
   h("tbody", null, trail.map(l => h("tr", {
     key: l.id
    },
    h("td", {
     className: "mono nowrap"
    }, liveWhen(l.ts)),
    h("td", null, l.from_ref, " → ", l.to_ref),
    h("td", null, inrS(Number(l.traced_amount))),
    h("td", null, l.rail)))))));
}

function LiveMine({
 items
}) {
 const e = useApp();
 return h(R.Fragment, null,
  h(PageHead, {
   title: "My complaints",
   desc: "See where your complaint stands and where your money is now.",
   actions: h("button", {
    className: "btn",
    onClick: () => e.open("file")
   }, "＋ File a complaint")
  }),
  items.slice().reverse().map(it => h(LiveCard, {
   key: it.c.id,
   it
  })),
  items.length === 0 && h("div", {
   style: {
    marginTop: 18
   }
  }, h(Card, {}, h("div", {
   className: "empty"
  }, h("b", null, "You have no complaints yet."), h("span", null, "File one and we will start following your money.")))));
}
export function Mine() {
 const live = useLive();
 return live.status === "live" ? h(LiveMine, {
  items: live.items
 }) : h(Offline, {
  state: live
 })
}

/* ------------------------------------------------------------------ Cases */
export function Cases() {
 const e = useApp(),
  {
   D,
   S,
   can
  } = e,
  fired = !!S.fired.complaint;
 const rows = D.order.map(id => ({
  c: D.cases.find(q => q.id === id),
  t: D.states[id].tot
 })).filter(r => r.c);
 const sum = k => rows.reduce((s, r) => s + r.t[k], 0);
 return h(R.Fragment, null,
  h(PageHead, {
   title: "Cases",
   desc: "Ongoing complaints. Open one to follow where its money went.",
   actions: h(R.Fragment, null,
    can("file") && h("button", {
     className: "btn",
     onClick: () => e.open("file")
    }, "＋ File a complaint"),
    !fired && can("events") && h("button", {
     className: "btn accent glow",
     id: "btn-complaint",
     onClick: e.ingestComplaint
    }, "Simulate incoming 1930 complaint"),
    fired && can("events") && h("button", {
     className: "btn accent",
     onClick: e.newComplaint
    }, "New complaint (random scam)"),
    can("events") && h("button", {
     className: "btn ghost",
     onClick: () => e.open("import", "csv")
    }, "Import CSV"))
  }),
  h("div", {
    className: "kpis"
   },
   h(Kpi, {
    label: "Already secured",
    value: inrS(sum("secured")),
    tone: "rec",
    sub: "held or frozen — safe"
   }),
   h(Kpi, {
    label: "Can still be stopped",
    value: inrS(rows.reduce((s, r) => s + Math.max(0, r.t.recoverable - r.t.secured), 0)),
    tone: "rec",
    sub: "sitting in banks / exchanges, not yet held"
   }),
   h(Kpi, {
    label: "Already gone",
    value: inrS(sum("gone")),
    tone: "exit",
    sub: "cash withdrawn or bridged out"
   })),
  h(FiledList, null),
  h("div", {
   style: {
    marginTop: 18
   }
  }, h(Card, {
    title: "Ongoing complaints",
    sub: "Most urgent first. Each row adds up: Amount lost = Secured + Still stoppable + Crypto / other banks + Gone. Click a case to open its money trail.",
    bodyClass: ""
   },
   rows.length === 0 ? h("div", {
    className: "empty"
   }, h("b", null, "No complaints to show yet."), h("span", null, "Complaints filed or received will appear here.")) :
   h("div", {
    className: "tbl-wrap"
   }, h("table", {
     className: "tbl"
    },
    h("thead", null, h("tr", null, [
     ["Case", ""],
     ["Amount lost", "right"],
     ["Secured", "right"],
     ["Still stoppable", "right"],
     ["Crypto / other banks", "right"],
     ["Gone", "right"],
     ["Status", ""]
    ].map(([c, k], i) => h("th", {
     key: i,
     className: k
    }, c)))),
    h("tbody", null, rows.map(({
     c,
     t
    }) => {
     const st = caseStatus(e, c.id),
      stop = Math.max(0, t.recoverable - t.secured),
      away = Math.max(0, c.amount - t.secured - stop - t.gone);
     return h("tr", {
       key: c.id,
       className: "click",
       onClick: () => e.openCase(c.id, "trail"),
       tabIndex: 0,
       role: "button",
       onKeyDown: ev => {
        if (ev.key === "Enter") e.openCase(c.id, "trail")
       }
      },
      h("td", null, h("div", {
        className: "cell-main"
       }, h("span", {
        className: "mono"
       }, c.id), " · ", c.type),
       h("div", {
        className: "cell-sub"
       }, D.W.accounts[c.victim].name, " · reported ", tfmt(c.reportedAt, S.clock))),
      h("td", {
       className: "right nowrap"
      }, inr(c.amount)),
      h("td", {
       className: "right nowrap c-rec"
      }, inrS(t.secured)),
      h("td", {
       className: "right nowrap c-rec"
      }, inrS(stop)),
      h("td", {
       className: "right nowrap",
       title: "In private crypto wallets, or moved to a bank outside our data (trace request sent)"
      }, inrS(away)),
      h("td", {
       className: "right nowrap c-exit"
      }, inrS(t.gone)),
      h("td", null, h(Pill, {
       tone: st.tone
      }, st.label)));
    })))))));
}


/* -------------------------------------------------------- trail helpers */
const END = {
 held: "Bank hold",
 frozen: "Exchange freeze",
 crypto: "Wallet",
 converted: "Converted to crypto (P2P seller)",
 exited: "Cash withdrawn",
 outside: "Left the data (other bank)",
 stopped: "Stopped"
};
const END_GONE = {
 converted: 1,
 exited: 1,
 outside: 1
};

function trailInfo(e, c) {
 const {
  D,
  S
 } = e, W = D.W, g = D.graphs[c.id], st = D.states[c.id];
 const hops = g.links.filter(l => l.status === "done").sort((a, b) => a.t0 - b.t0);
 const first = hops.find(l => l.from === c.victim);
 const step = {};
 hops.forEach((l, i) => {
  if (!step[l.to]) step[l.to] = i + 1
 });
 const ends = Object.entries(st.st).filter(([id, x]) => END[x.status] && x.v >= 1).map(([id, x]) => ({
  id,
  status: x.status,
  v: x.v,
  label: endLbl(g, id, x.status)
 }));
 return {
  W,
  g,
  st,
  t: st.tot,
  hops,
  first,
  step,
  ends,
  held: id => !!S.holds[id]
 };
}
const endLbl = (g, id, status) => {
 const n = g.nodes.find(q => q.id === id);
 return n && n.kind === "bridge" ? "Bridge / mixer" : END[status] || status
};

function caseFullReport(e, c, now) {
 const {
  D,
  S
 } = e, {
  W,
  g,
  st,
  t,
  hops,
  first,
  step,
  ends
 } = trailInfo(e, c), V = W.accounts[c.victim], role = e.user.key;
 const L = ["PEECHA — CASE REPORT", "Synthetic demo data", `Generated: ${tfmt(S.clock,null)} IST`, `Prepared for: ${e.user.name} · ${e.user.title}`,
  `Scope: ${role==="officer"?"all banks":role==="analyst"?"accounts of "+e.user.unit+" (other banks masked)":"your own complaint (other accounts masked)"}`, "",
  "VICTIM", `  Name: ${V.name}`, `  City: ${V.masked?"—":V.city}`, `  Complaint ID: ${c.id}${c.ack?` (ack ${c.ack})`:""}`, `  Scam type: ${c.type}`,
  `  Reported: ${tfmt(c.reportedAt,null)} via ${c.channel}`, `  Amount lost: ${inr(c.amount)}`,
  "", `VICTIM ACCOUNT`, `  ${nameOf(W,c.victim)}${V.masked?"":" · "+V.ifsc}`,
  "", `FIRST ATTACKER / MULE ACCOUNT (first account that received the money)`, first ? `  ${nameOf(W,first.to)} · received ${inr(first.taint)} at ${tfmt(first.t0,null)} via ${first.rail}` :
  "  None traced yet",
  "", `STEP-BY-STEP TRAIL`, `  ${pad("Step",5)}${pad("Time",20)}${pad("From",30)}${pad("To",30)}${pad("Traced",12)}Rail`
 ];
 hops.forEach((l, i) => L.push(`  ${pad(i+1,5)}${pad(tfmt(l.t0,null),20)}${pad(nameOf(W,l.from),30)}${pad(nameOf(W,l.to),30)}${pad(inrS(l.taint),12)}${l.rail}`));
 L.push("", "WHERE THE MONEY WAS FOUND, STAGE BY STAGE", `  ${pad("Account",32)}${pad("Found at step",15)}${pad("Held now",10)}Status`);
 for (const [id, x] of Object.entries(st.st)) {
  if (id === c.victim || !step[id]) continue;
  L.push(`  ${pad(nameOf(W,id),32)}${pad("step "+step[id],15)}${pad(S.holds[id]?"yes":"no",10)}${endLbl(g,id,x.status)} · ${inrS(x.v)}`)
 }
 L.push("", "WHERE THE TRAIL ENDS");
 if (!ends.length) L.push("  No end points yet.");
 for (const x of ends) L.push(`  ${x.label}: ${nameOf(W,x.id)} · ${inrS(x.v)}`);
 L.push("", "RECOVERED / SECURED VS GONE", `  Secured (bank hold + exchange freeze): ${inrS(t.secured)}`, `  Can still be stopped: ${inrS(Math.max(0,t.recoverable-t.secured))}`,
  `  In crypto (wallet / exchange / bridge): ${inrS(t.wallet+t.exchange+t.bridge)}`, `  Gone (cash or outside): ${inrS(t.gone)}`, "", "ACTIONS TAKEN");
 const acts = actionRows(e, now).filter(r => r.case === c.id).sort((a, b) => a.t - b.t);
 if (!acts.length) L.push("  None yet.");
 for (const r of acts) L.push(`  ${pad(tfmt(r.t,null),20)}${pad(r.action,42)}${pad(r.target,32)}${pad(r.by,24)}Basis: ${r.basis}`);
 return L.join("\n");
}

function exportCase(e, c, mode) {
 const now = e.S.clock + e.holdSkew,
  body = caseFullReport(e, c, now),
  hash = sha(body);
 const txt = `${body}\n\nSHA-256: ${hash}\n`;
 if (mode === "print") {
  printText(`Peecha case report ${c.id}`, txt) || e.toast("Allow pop-ups to print");
 } else {
  dl(`peecha_case_${c.id}.txt`, txt);
  e.toast("Case report downloaded with its SHA-256 fingerprint")
 }
 e.logReport(`Case report ${c.id}`, hash);
}

/* ------------------------------------------------ Money action > Money trail */
const TrailBase = R.lazy(() => import("./Trail--XxNU5VG.js"));

function TrailList() {
 const e = useApp(),
  {
   D,
   S
  } = e;
 const rows = D.order.map(id => D.cases.find(q => q.id === id)).filter(Boolean);
 return h(R.Fragment, null,
  h(PageHead, {
   title: "Money action",
   desc: "Pick a victim account to see where its money went and what can still be stopped."
  }),
  h("div", {
   style: {
    marginTop: 6
   }
  }, h(Card, {
    title: "Victim accounts",
    sub: "Click a row to open its live money trail.",
    bodyClass: ""
   },
   rows.length === 0 ? h("div", {
    className: "empty"
   }, h("b", null, "No cases to show yet.")) :
   h("div", {
    className: "tbl-wrap"
   }, h("table", {
     className: "tbl"
    },
    h("thead", null, h("tr", null, [
     ["Victim", ""],
     ["Victim account", ""],
     ["Amount lost", "right"],
     ["Status", ""],
     ["Held?", ""],
     ["Still stoppable", "right"]
    ].map(([c, k], i) => h("th", {
     key: i,
     className: k
    }, c)))),
    h("tbody", null, rows.map(c => {
     const t = D.states[c.id].tot,
      A = D.W.accounts[c.victim],
      stt = caseStatus(e, c.id),
      stop = Math.max(0, t.recoverable - t.secured);
     return h("tr", {
       key: c.id,
       className: "click",
       onClick: () => e.openCase(c.id, "trail"),
       tabIndex: 0,
       role: "button",
       onKeyDown: ev => {
        if (ev.key === "Enter") e.openCase(c.id, "trail")
       }
      },
      h("td", null, h("div", {
       className: "cell-main"
      }, A.name), h("div", {
       className: "cell-sub mono"
      }, c.id, " · ", c.type)),
      h("td", {
       className: "mono nowrap"
      }, maskId(D.W, c.victim)),
      h("td", {
       className: "right nowrap"
      }, inr(c.amount)),
      h("td", null, h(Pill, {
       tone: stt.tone
      }, stt.label)),
      h("td", null, t.held >= 1 ? h(Pill, {
       tone: "rec-solid"
      }, "Held · " + inrS(t.held)) : h(Pill, {
       tone: "neutral"
      }, "Not held")),
      h("td", {
       className: "right nowrap c-rec"
      }, inrS(stop)));
    })))))));
}

function AccountDash() {
 const e = useApp(),
  {
   D,
   S
  } = e,
  c = D.cases.find(q => q.id === e.caseId);
 if (!c || !D.graphs[c.id]) return null;
 const {
  W,
  t,
  hops,
  st
 } = trailInfo(e, c), V = W.accounts[c.victim];
 const out = hops.filter(l => l.from === c.victim);
 const stop = Math.max(0, t.recoverable - t.secured),
  vh = !!S.holds[c.victim];
 return h(Card, {
   title: (V.name && !String(V.name).includes(V.mask)) ? `Account ${maskId(W,c.victim)} · ${V.name}` : `Account ${maskId(W,c.victim)}`,
   sub: `${c.id} · ${c.type} · ${inr(c.amount)} lost`,
   style: {
    marginBottom: 18
   }
  },
  h("p", {
   className: "sec",
   style: {
    fontSize: 13
   }
  }, `Still stoppable ${inrS(stop)} · secured ${inrS(t.secured)} · gone ${inrS(t.gone)}. Victim account is ${vh?"held":"not held"}; ${hops.filter(l=>S.holds[l.to]).length} of ${hops.length} hops lead to a held account. Full picture and actions are in the trail below.`),
  h("div", {
   className: "cell-main",
   style: {
    margin: "14px 0 6px"
   }
  }, "Transfers out of this account"),
  out.length === 0 ? h("div", {
   className: "muted"
  }, "None traced yet.") :
  h("div", {
   className: "tbl-wrap"
  }, h("table", {
    className: "tbl"
   },
   h("thead", null, h("tr", null, ["Time", "To", "Amount", "Rail", "Reference"].map((x, i) => h("th", {
    key: i
   }, x)))),
   h("tbody", null, out.map((l, i) => h("tr", {
     key: i
    },
    h("td", {
     className: "mono nowrap"
    }, tfmt(l.t0, S.clock)), h("td", null, nameOf(W, l.to)), h("td", null, inrS(l.taint)), h("td", null, l.rail),
    h("td", {
     className: "mono",
     style: {
      fontSize: 12
     }
    }, l.txs.map(id => {
     const tx = W.txns.find(q => q.id === id);
     return tx ? tx.ref : id
    }).slice(0, 2).join(", "))))))),
  h("details", {
   style: {
    marginTop: 14
   }
  }, h("summary", {
   className: "cell-main",
   style: {
    cursor: "pointer",
    margin: "0 0 6px"
   }
  }, `Every hop (${hops.length}): how much is still there and whether it is held`),
  h("div", {
   className: "tbl-wrap"
  }, h("table", {
    className: "tbl"
   },
   h("thead", null, h("tr", null, ["#", "Time", "From → To", "Traced", "Now", "Held?"].map((x, i) => h("th", {
    key: i
   }, x)))),
   h("tbody", null, hops.map((l, i) => {
    const x = st.st[l.to];
    return h("tr", {
      key: i
     },
     h("td", null, i + 1), h("td", {
      className: "mono nowrap"
     }, tfmt(l.t0, S.clock)), h("td", null, nameOf(W, l.from), " → ", nameOf(W, l.to)), h("td", null, inrS(l.taint)),
     h("td", null, x ? (x.v >= 1 ? `${inrS(x.v)} still here (${endLbl(D.graphs[c.id], l.to, x.status)})` : "Passed on · ₹0 left") : "—"),
     h("td", null, S.holds[l.to] ? h(Pill, {
      tone: "rec-solid"
     }, "Held") : h("span", {
      className: "muted"
     }, "No")))
   }))))));
}
export function TrailAction() {
 const e = useApp();
 if (!e.trailOpen || !e.D.cases.some(q => q.id === e.caseId)) return h(TrailList, null);
 return h(R.Fragment, null,
  h("div", {
   style: {
    marginBottom: 12
   }
  }, h("button", {
   className: "btn ghost",
   id: "btn-back-list",
   onClick: e.backToList
  }, "← Back to list")),
  h(AccountDash, null),
  h(R.Suspense, {
   fallback: null
  }, h(TrailBase, null)));
}

/* ----------------------------------------------------------------- Reports */
function printText(title, text) {
 const q = l => l.replace(/&/g, "&amp;").replace(/</g, "&lt;");
 let w = null;
 try { w = window.open("", "_blank") } catch {}
 if (!w || !w.document) {
  window.PeechaRT && window.PeechaRT.save(String(title).replace(/[^A-Za-z0-9-]+/g, "_") + "_printable.html", `<!doctype html><html><head><meta charset="utf-8"><title>${q(title)}</title><style>body{font:13px/1.55 ui-monospace,monospace;margin:32px;color:#111}pre{white-space:pre-wrap}h1{font:700 18px Georgia,serif}</style></head><body><h1>${q(title)}</h1><pre>${q(text)}</pre><script>setTimeout(()=>print(),300)<\/script></body></html>`, "text/html");
  return !!window.PeechaRT
 }
 w.document.write(
  `<!doctype html><html><head><meta charset="utf-8"><title>${q(title)}</title><style>body{font:13px/1.55 'IBM Plex Mono',ui-monospace,monospace;margin:32px;color:#111}pre{white-space:pre-wrap}h1{font:700 18px Georgia,serif}</style></head><body><h1>${q(title)}</h1><pre>${q(text)}</pre><script>setTimeout(()=>print(),300)<\/script></body></html>`
  );
 w.document.close();
 return true;
}
const pad = (s, n) => String(s).length >= n ? String(s).slice(0, n - 1) + "…" : String(s).padEnd(n);

function ActionReport() {
 const e = useApp(),
  {
   D,
   S
  } = e,
  role = e.user.key,
  now = S.clock + e.holdSkew;
 const [cf, setCf] = R.useState("");
 const rows = actionRows(e, now);
 const shown = cf ? rows.filter(r => r.case === cf) : rows;
 const caseIds = [...new Set([...D.order, ...e.myFiled.map(f => f.id)])];
 const build = () => {
  const L = ["PEECHA — FULL AUDIT REPORT", "Synthetic demo data", `Generated: ${tfmt(S.clock,null)} IST`, `Prepared for: ${e.user.name} · ${e.user.title}`,
   `Scope: ${role==="officer"?"all banks":"accounts of "+e.user.unit}`, cf ? `Case filter: ${cf}` : "Case filter: all cases", "", "ACTION REPORT",
   `${pad("Time",20)}${pad("Action",44)}${pad("Target",36)}${pad("Taken by",26)}Basis`
  ];
  for (const r of shown) L.push(`${pad(tfmt(r.t,null),20)}${pad(r.action,44)}${pad(r.target,36)}${pad(r.by,26)}${r.basis}`);
  if (role === "officer") {
   L.push("", "HASH-CHAINED AUDIT LOG");
   for (const x of e.log) L.push(`#${x.seq} ${x.t} [${x.kind}] ${x.actor}: ${x.text}${x.basis?` (basis: ${x.basis})`:""} | ${x.hash}`)
  }
  const body = L.join("\n"),
   hash = sha(body);
  return {
   body,
   hash
  };
 };
 const download = () => {
  const {
   body,
   hash
  } = build();
  dl("peecha_audit_report.txt", `${body}\n\nSHA-256: ${hash}\n`);
  e.logReport("Full audit report", hash);
  e.toast("Report downloaded with its SHA-256 fingerprint")
 };
 const print = () => {
  const {
   body,
   hash
  } = build();
  printText("Peecha audit report", `${body}\n\nSHA-256: ${hash}`) || e.toast("Allow pop-ups to print")
 };
 const basisTone = b => b === "Consumer complaint" ? "info" : b === "Officer decision" ? "rec-solid" : b === "Bank" ? "med" : "crypto";
 return h(R.Fragment, null,
  h(PageHead, {
   title: "Reports",
   desc: role === "officer" ? "Every action taken on every case, and what each one was based on." : "Every action taken on your bank's accounts, and what each one was based on.",
   actions: h(R.Fragment, null,
    h("button", {
     className: "btn",
     onClick: download
    }, "Download full audit report"),
    h("button", {
     className: "btn ghost",
     onClick: print
    }, "Print / PDF"))
  }),
  h("div", {
    className: "kpis"
   },
   h(Kpi, {
    label: "Actions taken",
    value: rows.length,
    sub: "all cases"
   }),
   h(Kpi, {
    label: "Officer decisions",
    value: rows.filter(r => r.basis === "Officer decision").length,
    tone: "primary",
    sub: "holds, requests, calls"
   }),
   h(Kpi, {
    label: "AI drafts approved",
    value: rows.filter(r => r.basis.startsWith("AI draft")).length,
    sub: "each approved by a person"
   })),
  h("div", {
   style: {
    marginTop: 18
   }
  }, h(Card, {
    title: "Reports by case",
    sub: "One report per case: victim, trail, where the money ended, actions and basis.",
    bodyClass: ""
   },
   D.cases.length === 0 ? h("div", {
    className: "empty"
   }, h("b", null, "No cases yet.")) :
   h("div", {
    className: "tbl-wrap"
   }, h("table", {
     className: "tbl"
    },
    h("thead", null, h("tr", null, ["Case", "Victim", "Amount lost", "Report"].map((c, i) => h("th", {
     key: i
    }, c)))),
    h("tbody", null, D.order.map(id => D.cases.find(q => q.id === id)).filter(Boolean).map(c => h("tr", {
      key: c.id
     },
     h("td", null, h("div", {
      className: "cell-main mono"
     }, c.id), h("div", {
      className: "cell-sub"
     }, c.type)),
     h("td", null, D.W.accounts[c.victim].name),
     h("td", {
      className: "nowrap"
     }, inr(c.amount)),
     h("td", null, h("div", {
       className: "btn-row"
      },
      h("button", {
       className: "btn sm",
       "data-case-dl": c.id,
       onClick: () => exportCase(e, c, "txt")
      }, "Download report"),
      h("button", {
       className: "btn ghost sm",
       onClick: () => exportCase(e, c, "print")
      }, "Print / PDF")))))))))),
  h("div", {
   style: {
    marginTop: 18
   }
  }, h(Card, {
    title: "Action report",
    right: h("select", {
     className: "select",
     "aria-label": "Filter by case",
     value: cf,
     onChange: ev => setCf(ev.target.value)
    }, h("option", {
     value: ""
    }, "All cases"), caseIds.map(c => h("option", {
     key: c,
     value: c
    }, c))),
    bodyClass: ""
   },
   shown.length === 0 ? h("div", {
    className: "empty"
   }, h("b", null, "No actions yet.")) :
   h("div", {
    className: "tbl-wrap"
   }, h("table", {
     className: "tbl"
    },
    h("thead", null, h("tr", null, ["Time", "Action", "Target", "Taken by", "Basis"].map((c, i) => h("th", {
     key: i
    }, c)))),
    h("tbody", null, shown.map((r, i) => h("tr", {
      key: i
     },
     h("td", {
      className: "mono nowrap"
     }, tfmt(r.t, S.clock)),
     h("td", null, r.action, r.case ? h("div", {
      className: "cell-sub mono"
     }, r.case) : null),
     h("td", {
      style: {
       maxWidth: 300
      }
     }, r.target),
     h("td", {
      className: "nowrap",
      style: {
       fontSize: 13
      }
     }, r.by),
     h("td", null, h(Pill, {
      tone: basisTone(r.basis)
     }, r.basis))))))))),
  h("p", {
   className: "muted",
   style: {
    fontSize: 12,
    marginTop: 12
   }
  }, "The downloaded report ends with a SHA-256 fingerprint. Downloading it is itself logged in the audit trail."));
}

/* consumer: own complaint report */
function caseReportText(e, c) {
 const {
  D,
  S
 } = e, W = D.W, g = D.graphs[c.id], st = D.states[c.id], t = st.tot;
 const notified = Object.keys(e.approvals).some(k => k.startsWith(c.id + "|"));
 const L = ["PEECHA — COMPLAINT REPORT", "Synthetic demo data. For use when contacting your bank or the police.", "",
  `Complaint number: ${c.id}`, `Acknowledgement: ${c.ack||"—"}`, `Type of scam: ${c.type}`, `Reported: ${tfmt(c.reportedAt,null)} via ${c.channel}`, `Amount lost: ${inr(c.amount)}`,
  "", `STATUS: Filed [done] > Tracing [done] > Bank notified [${notified?"done":"not yet"}] > Money held [${t.secured>0?"done":"not yet"}]`, "", "PAYMENTS FROM YOUR ACCOUNT"
 ];
 for (const l of g.links.filter(l => l.from === c.victim))
  for (const id of l.txs) {
   const tx = W.txns.find(q => q.id === id);
   if (tx) L.push(`  ${tfmt(tx.t,null)} · ${inr(tx.amt||0)} · ${tx.rail} · reference ${tx.ref} · paid to ${nameOf(W,tx.to)}`)
  }
 L.push("", "WHERE YOUR MONEY WENT (other accounts are masked)");
 for (const l of g.links.filter(l => l.status === "done").sort((a, b) => a.t0 - b.t0)) L.push(
  `  ${tfmt(l.t0,null)} · ${nameOf(W,l.from)} -> ${nameOf(W,l.to)} · ${inrS(l.taint)} of your money · ${l.rail}`);
 const ti = trailInfo(e, c);
 L.splice(5, 0, `Victim: ${W.accounts[c.victim].name}, ${W.accounts[c.victim].city}`);
 L.push("", "FIRST ACCOUNT YOUR MONEY REACHED", ti.first ? `  ${nameOf(W,ti.first.to)} · ${inr(ti.first.taint)} at ${tfmt(ti.first.t0,null)}` : "  Not traced yet", "", "WHERE THE TRAIL ENDS");
 if (!ti.ends.length) L.push("  No end points yet.");
 for (const x of ti.ends) L.push(`  ${x.label}: ${nameOf(W,x.id)} · ${inrS(x.v)}`);
 L.push("", "WHERE IT IS NOW", `  Secured (held or frozen): ${inrS(t.secured)}`, `  Can still be stopped: ${inrS(Math.max(0,t.recoverable-t.secured))}`,
  `  Converted to crypto: ${inrS(t.wallet+t.exchange+t.bridge)}`, `  Gone (cash or bridged out): ${inrS(t.gone)}`, "", "ACTIONS TAKEN SO FAR");
 let n = 0;
 for (const it of e.pack(c.id)) {
  const ap = e.approvals[`${c.id}|${it.id}`];
  if (ap) {
   n++;
   L.push(`  ${tfmt(ap.at,null)} · ${KIND[it.kind]||it.kind}${it.kind==="hold"?` · ${it.targets.length} account(s)`:""} · approved by an officer`)
  }
 }
 if (!n) L.push("  None approved yet.");
 return L.join("\n");
}

function filedReportText(e, f) {
 return ["PEECHA — COMPLAINT REPORT", "Synthetic demo data. For use when contacting your bank or the police.", "",
  `Complaint number: ${f.id}`, `Type of scam: ${f.scamType}`, `Filed: ${tfmt(f.filedAt,null)} (${f.filedVia})`, `Name: ${f.name}`, `City: ${f.city||"—"}`, `Phone: ${f.phone||"—"}`,
  `Account the money left from: ${f.victimAccount}`, `Amount lost: ${inr(f.amount)}`, `When it happened: ${f.fraudTime||"—"}`, "", "PAYMENT (as you entered it)",
  `  Paid to: ${f.destination==="crypto"?"a crypto wallet":"a bank account / UPI"}`, `  ${f.destination==="crypto"?"Wallet address":"UTR / UPI ID"}: ${f.ref}`, "",
  "WHAT HAPPENED", `  ${f.description||"—"}`, "", `STATUS: Filed [done] > Tracing [${f.status!=="filed"?"done":"not yet"}] > Bank notified [not yet] > Money held [not yet]`, "",
  "WHERE YOUR MONEY WENT", "  Not traced yet.", "", "ACTIONS TAKEN SO FAR", "  None yet."
 ].join("\n");
}

function liveReportText({
 c,
 payments,
 trail
}, mine = true) {
 const L = ["PEECHA — COMPLAINT REPORT", "For use when contacting your bank or the police.", "",
  `Complaint number: ${c.id}`, `Type of scam: ${c.scam_type}`, `Reported: ${liveWhen(c.reported_at)} (${c.filed_via})`, `Name: ${c.name}`, `City: ${c.city||"—"}`,
  `Amount lost: ${inr(Number(c.total_lost))}`, `When it happened: ${liveWhen(c.fraud_time)}`, "",
  `STATUS: Filed [done] > Tracing [${c.status!=="open"?"done":"not yet"}] > Bank notified [${c.status==="actioned"||c.status==="closed"?"done":"not yet"}] > Money held [${c.status==="closed"?"done":"not yet"}]`, "",
  mine ? "PAYMENTS FROM YOUR ACCOUNT" : "PAYMENTS REPORTED BY THE VICTIM"
 ];
 if (!payments.length) L.push("  None recorded.");
 for (const p of payments) L.push(`  ${liveWhen(p.paid_at)} · ${inr(Number(p.amount))} · ${p.destination_type==="crypto"?`crypto wallet ${p.wallet_address}`:`reference ${p.utr||p.paid_to_upi_id||p.paid_to_account_no||"—"}`}`);
 L.push("", "WHAT HAPPENED", `  ${c.incident_description||"—"}`, "", mine ? "WHERE YOUR MONEY WENT (other accounts are masked)" : "WHERE THE MONEY WENT");
 if (!trail.length) L.push("  Not traced yet.");
 for (const l of trail) L.push(`  ${liveWhen(l.ts)} · ${l.from_ref} -> ${l.to_ref} · ${inrS(Number(l.traced_amount))} of ${mine?"your":"the victim's"} money · ${l.rail}`);
 return L.join("\n")
}

function ConsumerReports() {
 const e = useApp(),
  live = useLive(),
  {
   D
  } = e;
 const items = live.items.map(it => ({
  id: it.c.id,
  title: it.c.scam_type,
  sub: `${inr(Number(it.c.total_lost))} lost`,
  text: () => liveReportText(it, e.user.key === "consumer")
 }));
 const make = list => {
  const body = list.map(i => i.text()).join("\n\n" + "=".repeat(60) + "\n\n");
  return {
   body,
   hash: sha(body)
  }
 };
 const down = (list, name) => {
  const {
   body,
   hash
  } = make(list);
  dl(name, `${body}\n\nSHA-256 fingerprint: ${hash}\nKeep this fingerprint: it shows the report has not been changed.\n`);
  e.logReport(name, hash);
  e.toast("Report downloaded")
 };
 const prt = list => {
  const {
   body,
   hash
  } = make(list);
  printText("Peecha complaint report", `${body}\n\nSHA-256 fingerprint: ${hash}`) || e.toast("Allow pop-ups to print")
 };
 return h(R.Fragment, null,
  h(PageHead, {
   title: "Reports",
   desc: e.user.key === "consumer" ? "Download a report of your complaint to give to your bank or the police, or to ask for a statement." : "Download a report of each complaint, with its payments and money trail, to share with a bank or the police.",
   actions: items.length ? h("button", {
    className: "btn",
    onClick: () => down(items, "my_complaints_report.txt")
   }, e.user.key === "consumer" ? "Download all my reports" : "Download all reports") : null
  }),
  items.length === 0 ? h("div", {
   style: {
    marginTop: 18
   }
  }, h(Card, {}, h("div", {
   className: "empty"
  }, h("b", null, "You have no complaints yet."), h("span", null, "File a complaint to get a report.")))) :
  items.map(i => h(Card, {
    key: i.id,
    title: i.title,
    sub: `${i.id} · ${i.sub}`,
    style: {
     marginTop: 18
    }
   },
   h("p", {
    className: "sec",
    style: {
     fontSize: 13
    }
   }, "Includes: complaint summary, your payments with their reference numbers, where the money went (other people's accounts are masked), actions taken so far, status and a fingerprint."),
   h("div", {
     className: "btn-row"
    },
    h("button", {
     className: "btn",
     onClick: () => down([i], `report_${i.id}.txt`)
    }, "Download report (.txt)"),
    h("button", {
     className: "btn ghost",
     onClick: () => prt([i])
    }, "Print / PDF")))));
}
export function Reports() {
 const live = useLive();
 return live.status === "live" ? h(ConsumerReports, null) : h(Offline, {
  state: live
 })
}
