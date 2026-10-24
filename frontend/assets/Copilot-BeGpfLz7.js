import {
 u as F,
 e as b,
 j as n,
 b as N,
 h as L,
 i as $,
 l as A,
 U as T,
 v as E,
 p as z
} from "./index-DAvlYmAS.js";
import {
 agentSummary as H
} from "./Trail--XxNU5VG.js";
const G = {
 inbox: "the case inbox",
 trail: "the money trail",
 accounts: "the mule radar",
 crypto: "the crypto exit",
 action: "the action pack",
 prevent: "prevention calls",
 model: "model metrics",
 audit: "the audit trail",
 settings: "settings"
};

function U(e, m) {
 const k = e.D.W,
  d = (m.match(/AC\d{4}/i) || [])[0];
 if (d && k.accounts[d.toUpperCase()]) return d.toUpperCase();
 const y = m.toLowerCase(),
  c = Object.values(k.accounts).find(u => u.name.length > 6 && y.includes(u.name.toLowerCase()));
 return c ? c.id : null
}

function V(e, m, k) {
 const {
  D: d,
  S: y,
  caseId: c
 } = e, u = d.W, h = m.toLowerCase(), f = d.graphs[c], i = d.states[c], x = U(e, m) || (/(why|kyun|explain)/.test(h) ? k : null);
 if (x && /(why|kyun|explain|flag|score|mule)/.test(h)) {
  const s = u.accounts[x],
   t = d.scores[x];
  if (!t) return `${s.name} is ${s.role==="p2p"?"a P2P crypto seller — a counterparty Peecha asks for order details, not a scored mule":"the victim, so not scored"}.`;
  const o = t.contribs.filter(l => l.pts > 1).slice(0, 4).map(l => `• ${l.label}: +${l.pts.toFixed(0)} pts — ${l.text}`).join(`
`);
  return `${s.name} (${s.occ}, ${s.mask}) scores ${Math.round(t.score)}/100.

${o||"No single signal stands out."}

The score is a suggestion: a hold needs an officer's approval.`
 }
 if (!f) return null;
 if (/hindi|हिंदी|samjhao|batao|hinglish/.test(h)) {
  const s = i.tot,
   t = f.c,
   o = new Set(f.edges.filter(p => p.status === "done").map(p => p.to)),
   l = s.recoverable - s.secured;
  return `${t.id}: ${u.accounts[t.victim].name} ji ke ${N(t.amount)} ${L(t.fraudAt)} baje gaye. Paisa ${f.nodes.filter(p=>p.kind==="bank"&&o.has(p.id)).length} mule accounts se ghumaya gaya${f.edges.some(p=>p.rail==="P2P")?", aur ek hissa P2P seller ke through USDT crypto mein badla gaya":""}.

${s.secured>=1?`${$(s.secured)} hold/freeze ho chuka hai. `:""}${l>=1?`Abhi ${$(l)} aur roka ja sakta hai. `:"Jo roka ja sakta tha, sab secure ho gaya hai. "}${s.gone>=1?`${$(s.gone)} nikal chuka hai (ATM cash ya bridge).`:""}

Agla kadam: ${l>=1?"Action pack mein bache hue drafts approve karein — har minute keemti hai.":"Crypto wallets par nazar rakhein aur victim ko update dein."}`
 }
 if (/summar|brief|overview|what happened|kya hua/.test(h)) return H(e, c);
 if (/save|stop|recover|bach|what can|kitna/.test(h)) {
  const s = f.nodes.filter(t => i.st[t.id].status === "recoverable" || i.st[t.id].status === "exchange").sort((t, o) => i.st[o.id].v - i.st[t.id].v);
  return s.length ? `${$(i.tot.recoverable-i.tot.secured)} on ${c} can still be stopped:
${s.slice(0,6).map(t=>`• ${t.title}${u.wallets[t.id]?"":` (${u.accounts[t.id].mask})`}: ${N(i.st[t.id].v)}${t.kind==="exchange"?" — exchange freeze":" — debit hold"}`).join(`
`)}

All of these are drafted in the action pack, waiting for approval.` :
   `Everything recoverable on ${c} is already secured (${$(i.tot.secured)}). ${i.tot.wallet>1?`${$(i.tot.wallet)} sits in self-custody wallets — the issuer request and on-chain watch cover it.`:""}`
 }
 if (/first|priority|order|which account|kaun/.test(h)) return `Hold in this order (largest victim money first):
${f.nodes.filter(t=>t.kind==="bank"&&i.st[t.id].v>=1).sort((t,o)=>i.st[o.id].v-i.st[t.id].v).map((t,o)=>`${o+1}. ${t.title} — ${N(i.st[t.id].v)}${y.holds[t.id]!=null?" (already held)":""}`).join(`
`)||"No bank account on this trail still holds victim money."}`;
 if (/\bstr\b|suspicious transaction report|fiu/.test(h)) {
  const s = e.pack(c).find(t => t.kind === "str");
  return s ? `${s.text.slice(0,1100)}${s.text.length>1100?"…":""}

(Full draft in the Action pack.)` : null
 }
 if (/crypto|usdt|wallet|exchange|p2p/.test(h)) {
  const s = f.edges.filter(o => o.rail === "P2P" && o.status === "done");
  if (!s.length) return `No crypto leg on ${c} yet. Peecha keeps watching the trail.`;
  const t = i.tot;
  return `${$(s.reduce((o,l)=>o+l.taint,0))} of the victim's money was paid to P2P seller(s) and released as ${A(s.reduce((o,l)=>o+l.amtOut,0))} on TRON.
Now: ≈ ${A(t.exchange/T)} at an exchange deposit (${t.frozen?"frozen":"freezable"}), ≈ ${A(t.wallet/T)} in self-custody wallets, ≈ ${N(t.bridge)} gone through a bridge.`
 }
 if (/fifo|how.*trace|method|kaise/.test(h))
 return "FIFO = first in, first out. Each account is a queue of money lots. When it pays out, the oldest money leaves first, so every outgoing transfer carries an exact share of the victim's money. Peecha replays all transactions in time order and follows that share hop by hop — across banks, through the P2P seller and on-chain until an exchange, a watch-listed wallet or a bridge.";
 if (/precision|recall|accura|false alarm|model/.test(h)) {
  const s = d.evalr;
  return `On ${s.n} held-out synthetic accounts at threshold ${e.settings.holdThr}: precision ${E(s.precision)}, recall ${E(s.recall)}, ${s.falsePer1000.toFixed(1)} false alarms per 1,000 legit accounts. It misses "quiet" mules that hold money for hours — the event build adds graph features for those.`
 }
 if (/approve|hold all|freeze/.test(h)) {
  const s = e.pack(c).filter(t => z(e, c, t) !== "done").length;
  return `I can't approve anything — only the officer can. ${s?`${s} drafted action${s>1?"s":""} for ${c} are waiting in the Action pack.`:`Everything for ${c} is approved.`}`
 }
 return null
}
const q =
 "I can explain any account's score, summarise a case (also in Hindi), list what can still be stopped, give the hold order, describe the crypto leg, show the STR draft, or explain FIFO tracing. Type any other question: when Peecha is opened in Claude, Claude answers it live from the case data.";

function mkTools(e, cur, onCall) {
 const D = e.D,
  W = D.W,
  r = x => Math.round(x || 0);
 const acc = id => {
  const s = D.scores[id],
   A = W.accounts[id];
  if (!A) return null;
  return {
   id,
   name: A.name,
   bank: A.bank,
   mask: A.mask,
   occupation: A.occ,
   accountAgeDays: A.opened,
   held: e.S.holds[id] != null,
   score: s ? Math.round(s.score) : null,
   topSignals: s ? s.contribs.filter(c => c.pts > 1).slice(0, 5).map(c => ({
    signal: c.label,
    points: Math.round(c.pts),
    detail: c.text
   })) : [],
   onCases: D.inTrail[id] || []
  }
 };
 const find = q => {
  q = String(q || "").trim();
  if (W.accounts[q.toUpperCase()]) return q.toUpperCase();
  const l = q.toLowerCase();
  if (!l) return null;
  const all = Object.values(W.accounts),
   hit = all.find(a => String(a.name).toLowerCase() === l) || all.find(a => String(a.name).toLowerCase().includes(l));
  return hit ? hit.id : null
 };
 const caseInfo = cid => {
  const c = D.cases.find(x => x.id === cid);
  if (!c) return {
   error: "No such case. Known cases: " + D.cases.map(x => x.id).join(", ")
  };
  const g = D.graphs[cid],
   st = D.states[cid],
   t = st.tot,
   v = id => st.st[id] ? r(st.st[id].v) : 0;
  return {
   id: c.id,
   type: c.type,
   amountLost: r(c.amount),
   victim: W.accounts[c.victim] && W.accounts[c.victim].name,
   story: c.story,
   money: {
    secured: r(t.secured),
    stillStoppable: r(Math.max(0, t.recoverable - t.secured)),
    gone: r(t.gone),
    inCrypto: r((t.wallet || 0) + (t.exchange || 0) + (t.bridge || 0))
   },
   accountsOnTrail: g.nodes.filter(n => n.kind === "bank" && n.id !== c.victim).map(n => ({
    id: n.id,
    name: n.title,
    held: e.S.holds[n.id] != null,
    victimMoneyNow: v(n.id),
    score: D.scores[n.id] ? Math.round(D.scores[n.id].score) : null
   })),
   cryptoAndExits: g.nodes.filter(n => n.kind !== "bank" && n.id !== c.victim).map(n => ({
    id: n.id,
    name: n.title,
    kind: n.kind,
    moneyNow: v(n.id),
    frozen: e.S.freezes && e.S.freezes[n.id] != null
   })),
   actionPack: e.pack(cid).map(it => ({
    title: it.title,
    kind: it.kind,
    status: z(e, cid, it)
   }))
  }
 };
 const wrap = (lbl, fn) => async input => {
  input = input || {};
  onCall(typeof lbl === "function" ? lbl(input) : lbl);
  return fn(input)
 };
 return [{
  name: "list_cases",
  description: "List every open fraud case with amount lost and money still stoppable (INR).",
  execute: wrap("all cases", () => D.order.map(id => {
   const c = D.cases.find(x => x.id === id),
    t = D.states[id].tot;
   return {
    id,
    type: c.type,
    victim: W.accounts[c.victim] && W.accounts[c.victim].name,
    amountLost: r(c.amount),
    stillStoppable: r(Math.max(0, t.recoverable - t.secured)),
    secured: r(t.secured)
   }
  }))
 }, {
  name: "get_case",
  description: "Full money trail of one case: money secured / still stoppable / gone, every account on the trail with held status and score, crypto wallets and exits, and the action-pack status. Use the current case if the user does not name one.",
  inputSchema: {
   type: "object",
   properties: {
    case_id: {
     type: "string",
     description: "Case id such as C-3021"
    }
   }
  },
  execute: wrap(i => "case " + (i.case_id || e.caseId), i => caseInfo(String(i.case_id || e.caseId).toUpperCase()))
 }, {
  name: "get_account",
  description: "Mule-risk score (0-100) of one bank account and the signals behind it. Accepts an account id like AC0952 or a person's name.",
  inputSchema: {
   type: "object",
   properties: {
    account: {
     type: "string"
    }
   },
   required: ["account"]
  },
  execute: wrap(i => "account " + (i.account || ""), i => {
   const id = find(i.account) || cur;
   return id ? acc(id) : {
    error: "Account not found"
   }
  })
 }, {
  name: "model_quality",
  description: "How good the mule-scoring model is on held-out test accounts, and the current decision thresholds.",
  execute: wrap("model metrics", () => ({
   precision: +D.evalr.precision.toFixed(3),
   recall: +D.evalr.recall.toFixed(3),
   falseAlarmsPer1000: +D.evalr.falsePer1000.toFixed(1),
   testAccounts: D.evalr.n,
   holdThreshold: e.settings.holdThr,
   warningCallFrom: e.settings.callLo,
   note: "Synthetic data; logistic model trained in the browser on a 70/30 split."
  }))
 }, {
  name: "risky_accounts_not_on_any_case",
  description: "Highest-score accounts that are not yet linked to any complaint (pre-emptive alerts).",
  execute: wrap("radar alerts", () => D.alerts.slice(0, 8).map(acc))
 }]
}
const ROLE_LBL = {
 officer: "cyber-cell officer",
 analyst: "bank fraud analyst (sees only their own bank; other banks are masked)",
 consumer: "fraud victim (sees only their own complaint; other accounts are masked)"
};

function _() {
 const e = F(),
  m = e.modal && e.modal.type === "account" ? e.modal.id : null,
  k = m ? `account ${e.D.W.accounts[m].name}` : `${G[e.page]||e.page} · ${e.caseId}`,
  [d, y] = b.useState([{
   who: "bot",
   text: `I'm looking at ${k}. Ask why an account is flagged, what can still be stopped, or for the STR draft. I explain and draft — the officer decides.`
  }]),
  [c, u] = b.useState(""),
  [h, f] = b.useState("explainer"),
  [ai, setAi] = b.useState(!1),
  [i, x] = b.useState(!1),
  s = b.useRef(null),
  t = b.useRef(null);
 b.useEffect(() => {
  s.current && s.current.scrollIntoView({
   behavior: "smooth"
  })
 }, [d]);
 b.useEffect(() => {
  let on = !0;
  window.PeechaRT && window.PeechaRT.sample().then(x => {
   on && setAi(!!x)
  });
  return () => {
   on = !1
  }
 }, []);
 const askClaude = async (SM, a) => {
  const hist = d.filter(x => !x.pending).slice(-6).map(x => (x.who === "me" ? "User: " : "Copilot: ") + x.text).join("\n");
  y(v => [...v, {
   who: "me",
   text: a
  }, {
   who: "bot",
   text: "Thinking…",
   pending: !0
  }]);
  const trace = [],
   setP = txt => y(v => v.map(w => w.pending ? {
    ...w,
    text: txt
   } : w)),
   tools = mkTools(e, m, nm => {
    trace.push(nm), setP("Looking up " + trace.join(" → ") + " …")
   });
  const prompt = `You are the investigation copilot inside Peecha, a tool an Indian police cyber-crime cell uses to follow money stolen in online fraud through mule bank accounts to crypto exits. All data is synthetic.
The person asking is the ${ROLE_LBL[e.user.key]||"user"}. They are looking at ${k}. Current case: ${e.caseId}.
Rules:
- Get facts with the tools. Never guess numbers, names, scores or statuses.
- Answer in at most 120 words, plain text: short lines or "• " bullets. No markdown headings or bold.
- Write money in rupees with Indian grouping (e.g. ₹1,20,000 or ₹1.2 L).
- If the question is in Hindi or Hinglish, answer in simple Hinglish.
- You explain and draft. You never approve, hold or freeze anything; only the officer decides.
- If the question is outside Peecha's case data, say so in one line.
${hist?"Conversation so far:\n"+hist+"\n":""}Question: ${a}`;
  try {
   const res = await SM(prompt, {
    modelTier: "quick",
    tools,
    onText: ({
     text: tx
    }) => setP(tx)
   });
   const tail = trace.length ? `\n\n(Claude looked up: ${[...new Set(trace)].join(", ")})` : "";
   y(v => [...v.filter(w => !w.pending), {
    who: "bot",
    text: ((res && res.text) || "").trim() + tail
   }]), f("llm")
  } catch (err) {
   const code = err && err.code;
   code === "not_granted" && (window.PeechaRT.disableAI(), setAi(!1));
   const fb = V(e, a, m) || q;
   y(v => [...v.filter(w => !w.pending), {
    who: "bot",
    text: (code === "not_granted" ? "Claude was not allowed in this view, so here is the built-in answer.\n\n" : "Claude is unavailable right now, so here is the built-in answer.\n\n") + fb
   }])
  }
 };
 const o = async (a, g, typed) => {
  const SM = typed && window.PeechaRT ? await window.PeechaRT.sample() : null;
  if (SM) return askClaude(SM, a);
  const S = V(e, a, m);
  if (S) {
   y(v => [...v, {
    who: "me",
    text: g || a
   }, {
    who: "bot",
    text: S
   }]);
   return
  }
  y(v => [...v, {
   who: "me",
   text: g || a
  }, {
   who: "bot",
   text: "…",
   pending: !0
  }]);
  let D = q;
  try {
   const v = new AbortController,
    W = setTimeout(() => v.abort(), 9e3),
    w = e.D.graphs[e.caseId],
    P = e.D.states[e.caseId],
    O = {
     clock: L(e.S.clock),
     case: w && {
      id: w.c.id,
      type: w.c.type,
      amount: w.c.amount,
      story: w.c.story,
      totals: P.tot
     },
     accounts: w ? w.nodes.filter(r => r.kind === "bank").map(r => ({
      name: r.title,
      held: e.S.holds[r.id] != null,
      victimMoneyNow: Math.round(P.st[r.id].v),
      score: Math.round(e.D.scores[r.id] ? e.D.scores[r.id].score : 0),
      reasons: e.D.scores[r.id] ? e.D.scores[r.id].reasons : []
     })) : [],
     pendingActions: e.pack(e.caseId).filter(r => z(e, e.caseId, r) !== "done").map(r => r.title),
     model: {
      precision: e.D.evalr.precision,
      recall: e.D.evalr.recall
     }
    },
    R = await fetch("./api/ask", {
     method: "POST",
     headers: {
      "content-type": "application/json"
     },
     body: JSON.stringify({
      question: a,
      context: O
     }),
     signal: v.signal
    });
   if (clearTimeout(W), R.ok) {
    const r = await R.json();
    r && r.answer && (D = r.answer, f("llm"))
   }
  } catch {}
  y(v => [...v.filter(W => !W.pending), {
   who: "bot",
   text: D
  }])
 };
 b.useEffect(() => {
  if (!e.copilotSeed) return;
  const a = e.copilotSeed,
   g = a.startsWith("why") ? `Why is ${e.D.W.accounts[a.split(" ")[1]]?e.D.W.accounts[a.split(" ")[1]].name:"this account"} flagged?` : a.startsWith("hindi") ? "Hindi mein samjhao" : a.startsWith(
    "summarise") ? "Summarise this case" : a;
  o(a, g)
 }, []);
 const l = () => {
   c.trim() && (o(c.trim(), void 0, !0), u(""))
  },
  p = typeof window < "u" && (window.SpeechRecognition || window.webkitSpeechRecognition),
  M = () => {
   if (!p) {
    y(g => [...g, {
     who: "bot",
     text: "Voice input is not supported in this browser — type your question instead."
    }]);
    return
   }
   if (i && t.current) {
    t.current.stop();
    return
   }
   const a = new p;
   a.lang = "en-IN", a.interimResults = !1, a.onresult = g => u(S => (S ? S + " " : "") + g.results[0][0].transcript), a.onend = () => x(!1), t.current = a, x(!0), a.start()
  },
  C = e.D.W,
  I = e.D.graphs[e.caseId],
  j = m || I && (I.nodes.find(a => a.kind === "bank" && a.col === 1) || {}).id;
 return n.jsxs("div", {
  className: "copilot",
  role: "dialog",
  "aria-label": "Investigation copilot",
  children: [n.jsxs("div", {
   className: "cp-head",
   children: [n.jsx("div", {
    className: "cp-av",
    children: "AI"
   }), n.jsxs("div", {
    style: {
     minWidth: 0
    },
    children: [n.jsxs("div", {
     style: {
      fontSize: 13.5,
      fontWeight: 700,
      color: "var(--copilot-accent)",
      display: "flex",
      gap: 8,
      alignItems: "center"
     },
     children: ["Investigation copilot ", n.jsx("span", {
      className: "cp-mode",
      children: h === "llm" ? "Claude · live" : ai ? "Claude ready" : "Grounded explainer"
     })]
    }), n.jsxs("div", {
     className: "muted",
     style: {
      fontSize: 11.5,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis"
     },
     children: ["Context: ", k]
    })]
   }), d.length > 1 && n.jsx("button", {
    className: "cp-chip",
    style: {
     marginLeft: "auto"
    },
    onClick: () => y(d.slice(0, 1)),
    children: "Clear"
   })]
  }), n.jsxs("div", {
   className: "cp-msgs",
   children: [d.map((a, g) => n.jsx("div", {
    className: `cp-msg ${a.who}`,
    children: a.text
   }, g)), n.jsx("div", {
    ref: s
   })]
  }), n.jsxs("div", {
   className: "cp-chips",
   children: [n.jsx("button", {
    className: "cp-chip",
    onClick: () => o(`summarise ${e.caseId}`, "Summarise this case"),
    children: "Summarise case"
   }), n.jsx("button", {
    className: "cp-chip",
    onClick: () => o("what can still be saved", "What can still be stopped?"),
    children: "What can still be stopped?"
   }), j && C.accounts[j] && n.jsxs("button", {
    className: "cp-chip",
    onClick: () => o(`why ${j}`, `Why is ${C.accounts[j].name} flagged?`),
    children: ["Why ", C.accounts[j].name.split(" ")[0], "?"]
   }), n.jsx("button", {
    className: "cp-chip",
    onClick: () => o("which account first", "Which accounts first?"),
    children: "Hold order"
   }), n.jsx("button", {
    className: "cp-chip",
    onClick: () => o("crypto leg", "Where did the crypto go?"),
    children: "Crypto leg"
   }), n.jsx("button", {
    className: "cp-chip",
    onClick: () => o("draft str", "Show the STR draft"),
    children: "STR draft"
   }), n.jsx("button", {
    className: "cp-chip",
    onClick: () => o("hindi mein samjhao", "Hindi mein samjhao"),
    children: "Hindi mein samjhao"
   })]
  }), n.jsxs("div", {
   className: "cp-input",
   children: [n.jsx("textarea", {
    value: c,
    onChange: a => u(a.target.value),
    onKeyDown: a => {
     a.key === "Enter" && !a.shiftKey && (a.preventDefault(), l())
    },
    placeholder: "Ask about a case, account or wallet…",
    "aria-label": "Ask the copilot"
   }), n.jsx("button", {
    className: "cp-send",
    style: {
     background: i ? "var(--exit)" : "var(--surface-muted)",
     color: i ? "#fff" : "var(--text-primary)"
    },
    onClick: M,
    "aria-label": "Voice input",
    title: "Voice input",
    children: i ? "■" : "🎙"
   }), n.jsx("button", {
    className: "cp-send",
    onClick: l,
    "aria-label": "Send",
    children: "➤"
   })]
  })]
 })
}
export {
 V as answer, _ as
 default
};