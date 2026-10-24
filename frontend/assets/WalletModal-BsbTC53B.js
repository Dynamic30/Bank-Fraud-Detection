import {
 u as b,
 m as k,
 j as e,
 G as v,
 a as d,
 E as p,
 w as j,
 A as u,
 n as w,
 l as h,
 U as y,
 b as T,
 o as S
} from "./index-DAvlYmAS.js";
import {
 txList as z
} from "./AccountModal-BJD0wbb7.js";

function D({
 id: a
}) {
 const n = b(),
  {
   D: i,
   S: t
  } = n,
  o = i.W,
  l = o.wallets[a];
 if (!l) return null;
 const x = k(o, a, t.clock),
  r = i.inTrail[a] || [],
  f = t.freezes[a] != null,
  N = z(n, a, 30),
  m = l.owner && o.accounts[l.owner];
 return e.jsxs(v, {
  label: `Wallet ${a}`,
  width: 980,
  children: [e.jsxs("div", {
   style: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap"
   },
   children: [e.jsx(d, {
    tone: "crypto",
    children: "TRON · USDT (TRC20)"
   }), l.kind === "exchange" && e.jsx(d, {
    tone: "info",
    children: p[l.exchange]
   }), f && e.jsxs(d, {
    tone: "rec-solid",
    children: ["🔒 Frozen since ", j(t.freezes[a], t.clock)]
   }), r.map(s => e.jsxs(d, {
    tone: "changed",
    children: ["On trail of ", s]
   }, s))]
  }), e.jsx("h2", {
   className: "modal-title",
   children: l.kind === "exchange" ? `${p[l.exchange]} deposit address` : l.label
  }), e.jsxs("p", {
   className: "mono sec",
   style: {
    fontSize: 13,
    marginTop: 6,
    wordBreak: "break-all"
   },
   children: [a, " ", e.jsx("button", {
    className: "link-btn",
    onClick: () => {
     try {
      navigator.clipboard.writeText(a), n.toast("Address copied")
     } catch {}
    },
    children: "copy"
   })]
  }), e.jsx("p", {
   className: "muted",
   style: {
    fontSize: 12,
    marginTop: 4
   },
   children: "Synthetic address for the demo (contains “syn”). Use the live TronGrid lookup on the Crypto page for real public addresses."
  }), e.jsxs("div", {
   className: "modal-grid",
   children: [e.jsx("div", {
    children: e.jsxs("div", {
     className: "sec-block",
     children: [e.jsx("div", {
      className: "sec-title",
      children: "On-chain transfers"
     }), e.jsx("div", {
      className: "tbl-wrap",
      children: e.jsxs("table", {
       className: "tbl",
       children: [e.jsx("thead", {
        children: e.jsxs("tr", {
         children: [e.jsx("th", {
          children: "Time"
         }), e.jsx("th", {
          children: "Counterparty"
         }), e.jsx("th", {
          className: "right",
          children: "USDT"
         }), e.jsx("th", {
          children: "Tx hash"
         }), e.jsx("th", {
          children: "Result"
         })]
        })
       }), e.jsx("tbody", {
        children: N.map(s => {
         const c = s.out ? s.to : s.from,
          g = s.rail === "P2P" ? s.amtOut : s.amount;
         return e.jsxs("tr", {
          children: [e.jsx("td", {
           className: "mono nowrap",
           children: j(s.t, t.clock)
          }), e.jsxs("td", {
           children: [s.out ? "→ " : "← ", e.jsx(u, {
            id: c,
            children: w(o, c)
           }), e.jsx("div", {
            className: "cell-sub",
            children: s.rail === "P2P" ? "P2P order release" : "TRC20 transfer"
           })]
          }), e.jsxs("td", {
           className: `right nowrap ${s.out?"":"c-rec"}`,
           children: [s.out ? "−" : "+", h(g || 0).replace(" USDT", "")]
          }), e.jsx("td", {
           className: "mono cell-sub",
           children: s.rail === "P2P" ? s.ref : `${s.ref.slice(0,10)}…`
          }), e.jsx("td", {
           children: s.status === "blocked" ? e.jsx("span", {
            className: "pill rec-solid",
            children: "⛔ Frozen"
           }) : s.status === "failed" ? e.jsx("span", {
            className: "pill neutral",
            children: "Failed"
           }) : e.jsx("span", {
            className: "pill neutral",
            children: "Done"
           })
          })]
         }, s.id)
        })
       })]
      })
     })]
    })
   }), e.jsxs("div", {
    children: [e.jsxs("div", {
     className: "sec-block",
     children: [e.jsx("div", {
      className: "sec-title",
      children: "Risk flags"
     }), x.length ? x.map(s => e.jsx("div", {
      className: `flag t-${s.tone}`,
      children: s.text
     }, s.k)) : e.jsx("p", {
      className: "sec",
      style: {
       fontSize: 13
      },
      children: "No labels or watch-list contact."
     }), m && e.jsxs("div", {
      className: "kv",
      style: {
       marginTop: 10
      },
      children: [e.jsx("span", {
       children: "Linked bank account"
      }), e.jsx("span", {
       children: e.jsx(u, {
        id: m.id
       })
      })]
     }), e.jsxs("div", {
      className: "kv",
      children: [e.jsx("span", {
       children: "Balance now"
      }), e.jsx("span", {
       children: h(i.sim.bal[a] ?? l.open0)
      })]
     }), r.map(s => {
      const c = i.states[s].st[a];
      return c ? e.jsxs("div", {
       className: "kv",
       children: [e.jsxs("span", {
        children: ["Victim money here (", s, ")"]
       }), e.jsxs("span", {
        style: {
         display: "flex",
         gap: 8,
         alignItems: "center"
        },
        children: ["≈ ", h(c.v / y), " · ", T(c.v), " ", e.jsx(S, {
         status: c.status
        })]
       })]
      }, s) : null
     })]
    }), e.jsxs("div", {
     className: "sec-block",
     children: [e.jsx("div", {
      className: "sec-title",
      children: "What can be done"
     }), e.jsx("p", {
      className: "sec",
      style: {
       fontSize: 13,
       lineHeight: 1.55
      },
      children: l.kind === "exchange" ?
       "This is a custodial exchange deposit address: the exchange can freeze the user account and stop withdrawals. Approve the freeze request in the action pack." :
       "Self-custody wallet: nobody can freeze it except the USDT issuer. Peecha keeps watching it and drafts an issuer request; the moment funds hit an exchange, a freeze request is drafted."
     }), r[0] && e.jsxs("div", {
      className: "btn-row",
      style: {
       marginTop: 10
      },
      children: [e.jsx("button", {
       className: "btn",
       onClick: () => {
        n.close(), n.openCase(r[0], "action")
       },
       children: "Open action pack"
      }), e.jsx("button", {
       className: "btn ghost",
       onClick: () => {
        n.close(), n.openCase(r[0], "crypto")
       },
       children: "Show crypto leg on trail"
      })]
     })]
    })]
   })]
  })]
 })
}
export {
 D as
 default
};