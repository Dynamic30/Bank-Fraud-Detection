import {
 u as A,
 e as d,
 j as e,
 P as B,
 K as x,
 w as L,
 f as M,
 B as k,
 C as P,
 S as T,
 a as h,
 r as H,
 k as W
} from "./index-DAvlYmAS.js";

function z() {
 const l = A(),
  {
   D: c,
   S: r
  } = l,
  m = c.W,
  [j, N] = d.useState(""),
  [p, g] = d.useState("high"),
  [b, w] = d.useState(""),
  [u, C] = d.useState(60),
  o = l.settings.holdThr,
  v = l.settings.callLo,
  f = d.useMemo(() => Object.keys(c.scores).sort((s, n) => c.scores[n].score - c.scores[s].score), [c.scores]),
  t = f.filter(s => {
   const n = m.accounts[s],
    a = c.scores[s].score,
    i = a >= o ? "high" : a >= v ? "med" : "low";
   return !(p !== "all" && i !== p || b && n.bank !== b || j && !`${n.name} ${n.mask} ${n.id} ${n.occ} ${n.city}`.toLowerCase().includes(j.toLowerCase()))
  }),
  S = s => f.filter(n => s(c.scores[n].score)).length,
  $ = () => {
   const s = n => `"${String(n).replace(/"/g,'""')}"`;
   W("mule_scores.csv", ["account,name,bank,occupation,opened_days,score,top_reason", ...t.map(n => {
    const a = m.accounts[n];
    return [a.id, a.name, k[a.bank], a.occ, a.opened, Math.round(c.scores[n].score), c.scores[n].reasons[0] || ""].map(s).join(",")
   })].join(`
`), "text/csv"), l.toast(`${t.length} accounts exported`)
  };
 return e.jsxs(e.Fragment, {
  children: [e.jsx(B, {
   title: "Mule radar",
   desc: "Every account in the data, scored 0–100 for mule behaviour with plain-language reasons. Click any row for the full score breakdown and its transactions.",
   sources: ["Behaviour model", "Graph links"],
   actions: e.jsxs("button", {
    className: "btn ghost",
    onClick: $,
    children: ["Export CSV (", t.length, ")"]
   })
  }), e.jsxs("div", {
   className: "kpis",
   children: [e.jsx(x, {
    label: "Accounts scored",
    value: f.length.toLocaleString("en-IN"),
    sub: `re-scored at ${L(r.clock,r.clock)}`
   }), e.jsx(x, {
    label: `High (≥ ${o})`,
    value: S(s => s >= o),
    tone: "primary",
    sub: "hold candidates",
    onClick: () => g("high")
   }), e.jsx(x, {
    label: `Medium (${v}–${o-1})`,
    value: S(s => s >= v && s < o),
    sub: "watch / warning call",
    onClick: () => g("med")
   }), e.jsx(x, {
    label: "Held now",
    value: Object.keys(r.holds).length,
    tone: "rec",
    sub: "debit holds in place"
   })]
  }), e.jsx("section", {
   className: "card",
   style: {
    marginTop: 18
   },
   children: e.jsxs("div", {
    className: "filters",
    children: [e.jsx("input", {
     className: "input",
     placeholder: "Search name, account, city…",
     value: j,
     onChange: s => N(s.target.value),
     "aria-label": "Search accounts"
    }), e.jsx(M, {
     options: [
      ["high", "High"],
      ["med", "Medium"],
      ["low", "Low"],
      ["all", "All"]
     ],
     value: p,
     onChange: g
    }), l.user.key === "officer" && e.jsxs("select", {
     className: "select",
     value: b,
     onChange: s => w(s.target.value),
     "aria-label": "Bank",
     children: [e.jsx("option", {
      value: "",
      children: "All banks"
     }), Object.entries(k).map(([s, n]) => e.jsx("option", {
      value: s,
      children: n
     }, s))]
    }), e.jsxs("span", {
     className: "muted",
     style: {
      fontSize: 12.5,
      marginLeft: "auto"
     },
     children: [t.length, " accounts"]
    })]
   })
  }), e.jsxs(P, {
   style: {
    marginTop: 18
   },
   bodyClass: "",
   children: [e.jsx("div", {
    className: "tbl-wrap",
    children: e.jsxs("table", {
     className: "tbl",
     children: [e.jsx("thead", {
      children: e.jsxs("tr", {
       children: [e.jsx("th", {
        children: "Account"
       }), e.jsx("th", {
        children: "Profile"
       }), e.jsx("th", {
        children: "Score"
       }), e.jsx("th", {
        children: "Top reason"
       }), e.jsx("th", {
        children: "Status"
       })]
      })
     }), e.jsxs("tbody", {
      children: [t.slice(0, u).map(s => {
       const n = m.accounts[s],
        a = c.scores[s],
        i = c.inTrail[s];
       return e.jsxs("tr", {
        className: "click",
        ...H(() => l.open("account", s)),
        children: [e.jsxs("td", {
         children: [e.jsx("div", {
          className: "cell-main",
          children: n.name
         }), e.jsxs("div", {
          className: "cell-sub",
          children: [k[n.bank], " · ", e.jsx("span", {
           className: "mono",
           children: n.mask
          })]
         })]
        }), e.jsxs("td", {
         children: [e.jsxs("div", {
          children: [n.occ, ", ", n.ageY]
         }), e.jsxs("div", {
          className: "cell-sub",
          children: [n.city, " · opened ", n.opened, " d ago"]
         })]
        }), e.jsx("td", {
         children: e.jsx(T, {
          score: a.score
         })
        }), e.jsx("td", {
         style: {
          maxWidth: 380,
          fontSize: 13
         },
         children: a.reasons[0] || e.jsx("span", {
          className: "muted",
          children: "No strong signal"
         })
        }), e.jsx("td", {
         children: e.jsxs("div", {
          style: {
           display: "flex",
           gap: 6,
           flexWrap: "wrap"
          },
          children: [r.holds[s] != null && e.jsx(h, {
           tone: "rec-solid",
           children: "🔒 Held"
          }), i && i.map(y => e.jsx(h, {
           tone: "changed",
           children: y
          }, y)), l.calls[s] && e.jsx(h, {
           tone: "accent",
           children: "Warned"
          }), l.reviewed[s] && e.jsx(h, {
           tone: "neutral",
           children: l.reviewed[s].verdict === "fp" ? "False alarm" : "Confirmed"
          }), !i && r.holds[s] == null && a.score >= o && e.jsx(h, {
           tone: "info",
           children: "Alert"
          })]
         })
        })]
       }, s)
      }), t.length === 0 && e.jsx("tr", {
       children: e.jsx("td", {
        colSpan: 5,
        children: e.jsx("div", {
         className: "empty",
         children: e.jsx("b", {
          children: "No accounts match."
         })
        })
       })
      })]
     })]
    })
   }), t.length > u && e.jsx("div", {
    style: {
     padding: 14,
     textAlign: "center"
    },
    children: e.jsxs("button", {
     className: "btn ghost sm",
     onClick: () => C(u + 120),
     children: ["Show more (", t.length - u, " left)"]
    })
   })]
  }), e.jsx("p", {
   className: "muted",
   style: {
    fontSize: 12,
    marginTop: 12
   },
   children: "All accounts and people are synthetic. Scores update on every re-trace."
  })]
 })
}
export {
 z as
 default
};