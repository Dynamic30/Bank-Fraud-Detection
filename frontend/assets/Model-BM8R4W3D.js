import {
 u as F,
 F as P,
 e as y,
 j as e,
 P as T,
 K as w,
 v as u,
 C as v,
 a as S
} from "./index-DAvlYmAS.js";

function $({
 curve: i,
 thr: m
}) {
 const [t, a] = y.useState(null), n = 560, r = 250, l = 44, x = 20, j = 16, c = 34, d = o => l + (o - 10) / 85 * (n - l - x), g = o => j + (1 - o) * (r - j - c), s = o => i.map((b, f) =>
  `${f?"L":"M"}${d(b.t).toFixed(1)},${g(b[o]).toFixed(1)}`).join(" "), h = i[i.length - 1], N = o => i.reduce((b, f) => Math.abs(f.t - o) < Math.abs(b.t - o) ? f : b, i[0]), k = o => {
  const b = o.currentTarget.getBoundingClientRect(),
   M = 10 + ((o.clientX - b.left) / b.width * n - l) / (n - l - x) * 85;
  a(N(Math.max(10, Math.min(95, M))))
 }, p = t || N(m);
 return e.jsxs("div", {
  style: {
   position: "relative"
  },
  children: [e.jsxs("div", {
   className: "chart-legend",
   children: [e.jsxs("span", {
    children: [e.jsx("i", {
     style: {
      background: "var(--s1)"
     }
    }), "Precision (flags that are real mules)"]
   }), e.jsxs("span", {
    children: [e.jsx("i", {
     style: {
      background: "var(--s2)"
     }
    }), "Recall (mules that get flagged)"]
   })]
  }), e.jsxs("svg", {
   viewBox: `0 0 ${n} ${r}`,
   className: "chart",
   onMouseMove: k,
   onMouseLeave: () => a(null),
   role: "img",
   "aria-label": "Precision and recall by score threshold",
   children: [
    [0, .25, .5, .75, 1].map(o => e.jsxs("g", {
     children: [e.jsx("line", {
      x1: l,
      x2: n - x,
      y1: g(o),
      y2: g(o),
      className: "grid-l"
     }), e.jsxs("text", {
      x: l - 8,
      y: g(o) + 4,
      textAnchor: "end",
      className: "axis-t",
      children: [o * 100, "%"]
     })]
    }, o)), [10, 30, 50, 70, 90].map(o => e.jsx("text", {
     x: d(o),
     y: r - 12,
     textAnchor: "middle",
     className: "axis-t",
     children: o
    }, o)), e.jsx("text", {
     x: (l + n - x) / 2,
     y: r,
     textAnchor: "middle",
     className: "axis-t",
     children: "score threshold"
    }), e.jsx("line", {
     x1: d(m),
     x2: d(m),
     y1: j,
     y2: r - c,
     className: "thr-l"
    }), e.jsxs("text", {
     x: d(m) + 4,
     y: j + 10,
     className: "axis-t",
     style: {
      fontWeight: 600
     },
     children: ["hold ≥ ", m]
    }), e.jsx("path", {
     d: s("precision"),
     fill: "none",
     stroke: "var(--s1)",
     strokeWidth: "2",
     strokeLinejoin: "round"
    }), e.jsx("path", {
     d: s("recall"),
     fill: "none",
     stroke: "var(--s2)",
     strokeWidth: "2",
     strokeLinejoin: "round"
    }), e.jsx("text", {
     x: d(h.t) - 4,
     y: g(h.precision) - 8,
     textAnchor: "end",
     className: "dlabel",
     children: "Precision"
    }), e.jsx("text", {
     x: d(h.t) - 4,
     y: g(h.recall) + 16,
     textAnchor: "end",
     className: "dlabel",
     children: "Recall"
    }), e.jsx("line", {
     x1: d(p.t),
     x2: d(p.t),
     y1: j,
     y2: r - c,
     className: "cross"
    }), e.jsx("circle", {
     cx: d(p.t),
     cy: g(p.precision),
     r: "4.5",
     fill: "var(--s1)",
     stroke: "var(--card-bg)",
     strokeWidth: "2"
    }), e.jsx("circle", {
     cx: d(p.t),
     cy: g(p.recall),
     r: "4.5",
     fill: "var(--s2)",
     stroke: "var(--card-bg)",
     strokeWidth: "2"
    })
   ]
  }), e.jsxs("div", {
   className: "chart-tip",
   style: {
    left: `${d(p.t)/n*100}%`
   },
   children: [e.jsxs("b", {
    children: ["Threshold ", p.t]
   }), e.jsxs("span", {
    children: [e.jsx("i", {
     style: {
      background: "var(--s1)"
     }
    }), "Precision ", u(p.precision)]
   }), e.jsxs("span", {
    children: [e.jsx("i", {
     style: {
      background: "var(--s2)"
     }
    }), "Recall ", u(p.recall)]
   })]
  })]
 })
}

function R() {
 const i = y.useRef(null),
  [m, t] = y.useState([]);
 return y.useEffect(() => () => {
  i.current && i.current.terminate()
 }, []), [m, n => {
  if (!i.current) try {
   i.current = new Worker(new URL("" + new URL("bench.worker-74ah-u4p.js", import.meta.url).href, import.meta.url), {
    type: "module"
   }), i.current.onmessage = r => t(l => [...l, r.data]), i.current.onerror = r => t(l => [...l, {
    kind: "error",
    message: r.message || "Worker failed"
   }])
  } catch {
   t(l => [...l, {
    kind: "error",
    message: "This browser cannot run background workers."
   }]);
   return
  }
  i.current.postMessage(n)
 }]
}

function W({
 thr: i,
 lr: m
}) {
 const [t, a] = R(), [n, r] = y.useState({}), l = [...t].reverse().find(s => s.kind === "gbdt"), x = t.filter(s => s.kind === "robust").map(s => s.row), j = t.filter(s => s.kind === "scale").map(s =>
  s.row), c = [...t].reverse().find(s => s.kind === "error");
 y.useEffect(() => {
  const s = t[t.length - 1];
  s && (s.kind === "gbdt" && r(h => ({
   ...h,
   gbdt: !1
  })), s.kind === "robust-done" && r(h => ({
   ...h,
   robust: !1
  })), s.kind === "scale" && r(h => ({
   ...h,
   scale: !1
  })), s.kind === "error" && r({}))
 }, [t]);
 const d = s => x.reduce((h, N) => h + N[s], 0) / Math.max(1, x.length),
  g = s => {
   const h = d(s);
   return Math.sqrt(x.reduce((N, k) => N + (k[s] - h) ** 2, 0) / Math.max(1, x.length))
  };
 return e.jsxs(v, {
  title: "Stress tests",
  sub: "Run live in a background thread. They answer the three hard questions a judge will ask about the model and the engine.",
  style: {
   marginTop: 18
  },
  children: [c && e.jsx("div", {
   className: "note",
   children: c.message
  }), e.jsxs("div", {
   className: "bench",
   children: [e.jsxs("div", {
    className: "bench-q",
    children: [e.jsx("div", {
     className: "sec-title",
     style: {
      fontSize: 15
     },
     children: "“Is a simple model enough?”"
    }), e.jsx("p", {
     className: "sec",
     style: {
      fontSize: 12.5
     },
     children: "Same features, gradient-boosted trees (120 rounds, depth 3) — the XGBoost family used in production."
    }), e.jsx("button", {
     className: "btn sm",
     disabled: n.gbdt,
     onClick: () => {
      r(s => ({
       ...s,
       gbdt: !0
      })), a({
       kind: "gbdt",
       thr: i
      })
     },
     children: n.gbdt ? "Training…" : "Train boosted trees"
    }), l && e.jsxs("table", {
     className: "tbl mini",
     style: {
      marginTop: 10
     },
     children: [e.jsx("thead", {
      children: e.jsxs("tr", {
       children: [e.jsxs("th", {
        children: ["At ≥ ", i]
       }), e.jsx("th", {
        className: "right",
        children: "Precision"
       }), e.jsx("th", {
        className: "right",
        children: "Recall"
       }), e.jsx("th", {
        className: "right",
        children: "False / 1,000"
       })]
      })
     }), e.jsxs("tbody", {
      children: [e.jsxs("tr", {
       children: [e.jsx("td", {
        children: "Logistic (in use)"
       }), e.jsx("td", {
        className: "right",
        children: u(m.precision)
       }), e.jsx("td", {
        className: "right",
        children: u(m.recall)
       }), e.jsx("td", {
        className: "right",
        children: m.falsePer1000.toFixed(1)
       })]
      }), e.jsxs("tr", {
       children: [e.jsx("td", {
        children: "Boosted trees"
       }), e.jsx("td", {
        className: "right",
        children: u(l.at.precision)
       }), e.jsx("td", {
        className: "right",
        children: u(l.at.recall)
       }), e.jsx("td", {
        className: "right",
        children: l.at.falsePer1000.toFixed(1)
       })]
      })]
     })]
    }), l && e.jsxs("p", {
     className: "muted",
     style: {
      fontSize: 12,
      marginTop: 6
     },
     children: ["Trained in ", l.ms.toFixed(0), " ms. Trees catch more of the quiet mules (", u(l.at.recall),
      " recall) at the cost of a few more false alarms; the logistic model stays the explainer because its attributions are exact."
     ]
    })]
   }), e.jsxs("div", {
    className: "bench-q",
    children: [e.jsx("div", {
     className: "sec-title",
     style: {
      fontSize: 15
     },
     children: "“You made the data — isn’t that circular?”"
    }), e.jsx("p", {
     className: "sec",
     style: {
      fontSize: 12.5
     },
     children: "Generate 5 brand-new worlds (new people, new rings, new noise), retrain from scratch, test again."
    }), e.jsx("button", {
     className: "btn sm",
     disabled: n.robust,
     onClick: () => {
      r(s => ({
       ...s,
       robust: !0
      })), a({
       kind: "robust",
       seeds: [11, 22, 33, 44, 55],
       thr: i
      })
     },
     children: n.robust ? `Running… ${x.length}/5` : "Run 5 fresh worlds"
    }), x.length > 0 && e.jsxs("table", {
     className: "tbl mini",
     style: {
      marginTop: 10
     },
     children: [e.jsx("thead", {
      children: e.jsxs("tr", {
       children: [e.jsx("th", {
        children: "World"
       }), e.jsx("th", {
        className: "right",
        children: "Precision"
       }), e.jsx("th", {
        className: "right",
        children: "Recall"
       }), e.jsx("th", {
        className: "right",
        children: "False / 1,000"
       })]
      })
     }), e.jsxs("tbody", {
      children: [x.map(s => e.jsxs("tr", {
       children: [e.jsxs("td", {
        className: "mono",
        children: ["seed ", s.seed]
       }), e.jsx("td", {
        className: "right",
        children: u(s.precision)
       }), e.jsx("td", {
        className: "right",
        children: u(s.recall)
       }), e.jsx("td", {
        className: "right",
        children: s.falsePer1000.toFixed(1)
       })]
      }, s.seed)), x.length === 5 && e.jsxs("tr", {
       className: "sel-row",
       children: [e.jsx("td", {
        children: e.jsx("b", {
         children: "Mean ± sd"
        })
       }), e.jsxs("td", {
        className: "right",
        children: [u(d("precision")), " ± ", (g("precision") * 100).toFixed(1)]
       }), e.jsxs("td", {
        className: "right",
        children: [u(d("recall")), " ± ", (g("recall") * 100).toFixed(1)]
       }), e.jsx("td", {
        className: "right",
        children: d("falsePer1000").toFixed(1)
       })]
      })]
     })]
    }), e.jsx("p", {
     className: "muted",
     style: {
      fontSize: 12,
      marginTop: 6
     },
     children: "Still synthetic. On site we also report the public synthetic AML benchmark dataset."
    })]
   }), e.jsxs("div", {
    className: "bench-q",
    children: [e.jsx("div", {
     className: "sec-title",
     style: {
      fontSize: 15
     },
     children: "“Will it scale?”"
    }), e.jsx("p", {
     className: "sec",
     style: {
      fontSize: 12.5
     },
     children: "Random transfers through the same FIFO engine, single thread, in this browser."
    }), e.jsx("div", {
     className: "btn-row",
     children: [1e5, 3e5, 1e6].map(s => e.jsxs("button", {
      className: "btn ghost sm",
      disabled: n.scale,
      onClick: () => {
       r(h => ({
        ...h,
        scale: !0
       })), a({
        kind: "scale",
        n: s
       })
      },
      children: [s >= 1e6 ? "10 lakh" : `${s/1e5} lakh`, " txns"]
     }, s))
    }), n.scale && e.jsx("p", {
     className: "muted",
     style: {
      fontSize: 12,
      marginTop: 6
     },
     children: "Replaying…"
    }), j.length > 0 && e.jsxs("table", {
     className: "tbl mini",
     style: {
      marginTop: 10
     },
     children: [e.jsx("thead", {
      children: e.jsxs("tr", {
       children: [e.jsx("th", {
        className: "right",
        children: "Transactions"
       }), e.jsx("th", {
        className: "right",
        children: "Accounts"
       }), e.jsx("th", {
        className: "right",
        children: "Full replay"
       }), e.jsx("th", {
        className: "right",
        children: "Per second"
       })]
      })
     }), e.jsx("tbody", {
      children: j.map((s, h) => e.jsxs("tr", {
       children: [e.jsx("td", {
        className: "right",
        children: s.n.toLocaleString("en-IN")
       }), e.jsx("td", {
        className: "right",
        children: s.accounts.toLocaleString("en-IN")
       }), e.jsxs("td", {
        className: "right",
        children: [(s.simMs / 1e3).toFixed(2), " s"]
       }), e.jsx("td", {
        className: "right",
        children: Math.round(s.perSec).toLocaleString("en-IN")
       })]
      }, h))
     })]
    }), e.jsx("p", {
     className: "muted",
     style: {
      fontSize: 12,
      marginTop: 6
     },
     children: "A complaint only needs the accounts its money touched, so production traces a sub-graph from Neo4j instead of replaying everything."
    })]
   })]
  })]
 })
}

function A() {
 const i = F(),
  {
   D: m
  } = i,
  t = m.M,
  a = m.evalr,
  n = i.settings.holdThr,
  r = P.map(c => ({
   ...c,
   w: t.w[c.k] * c.sign
  })).sort((c, d) => d.w - c.w),
  l = Math.max(...r.map(c => c.w), .01),
  [x, j] = y.useState(null);
 return e.jsxs(e.Fragment, {
  children: [e.jsx(T, {
   title: "Model & metrics",
   desc: "How good the mule score really is — measured live on accounts the model never saw. Every number on this page is computed in your browser from the synthetic data, not typed in.",
   sources: ["Held-out test set", "Synthetic labels"]
  }), e.jsxs("div", {
   className: "kpis",
   children: [e.jsx(w, {
    label: `Precision at ≥ ${n}`,
    value: u(a.precision),
    tone: "primary",
    sub: `${a.tp} of ${a.tp+a.fp} flagged are real mules`
   }), e.jsx(w, {
    label: `Recall at ≥ ${n}`,
    value: u(a.recall),
    tone: "primary",
    sub: `${a.tp} of ${a.tp+a.fn} mules caught`
   }), e.jsx(w, {
    label: "F1",
    value: a.f1.toFixed(2),
    sub: "balance of the two"
   }), e.jsx(w, {
    label: "False alarms",
    value: `${a.falsePer1000.toFixed(1)} / 1,000`,
    sub: "legit accounts wrongly flagged"
   }), e.jsx(w, {
    label: "Training",
    value: `${t.ms.toFixed(0)} ms`,
    sub: `${t.trainN} accounts · ${t.trainPos} mules`
   })]
  }), e.jsxs("div", {
   className: "grid g-2",
   children: [e.jsx(v, {
    title: "Precision and recall by threshold",
    sub: `Test set: ${t.testN} accounts (${t.testPos} mules) the model never trained on. Move the hold threshold in Settings and watch the trade-off.`,
    children: e.jsx($, {
     curve: a.curve,
     thr: n
    })
   }), e.jsxs(v, {
    title: "Confusion matrix",
    sub: `At the hold threshold (${n}) on the ${a.n} test accounts.`,
    bodyClass: "card-body",
    children: [e.jsxs("table", {
     className: "cm",
     children: [e.jsx("thead", {
      children: e.jsxs("tr", {
       children: [e.jsx("th", {}), e.jsx("th", {
        children: "Flagged"
       }), e.jsx("th", {
        children: "Not flagged"
       })]
      })
     }), e.jsxs("tbody", {
      children: [e.jsxs("tr", {
       children: [e.jsx("th", {
        children: "Mule"
       }), e.jsxs("td", {
        className: "good",
        children: [e.jsx("b", {
         children: a.tp
        }), e.jsx("span", {
         children: "caught"
        })]
       }), e.jsxs("td", {
        className: "bad",
        children: [e.jsx("b", {
         children: a.fn
        }), e.jsx("span", {
         children: "missed"
        })]
       })]
      }), e.jsxs("tr", {
       children: [e.jsx("th", {
        children: "Legit"
       }), e.jsxs("td", {
        className: "bad",
        children: [e.jsx("b", {
         children: a.fp
        }), e.jsx("span", {
         children: "false alarm"
        })]
       }), e.jsxs("td", {
        className: "good",
        children: [e.jsx("b", {
         children: a.tn
        }), e.jsx("span", {
         children: "left alone"
        })]
       })]
      })]
     })]
    }), e.jsxs("div", {
     className: "note info",
     style: {
      marginTop: 14
     },
     children: [e.jsx("b", {
       children: "Where it misses:"
      }),
      " “quiet” mules that hold money for hours and use older accounts. The event build adds graph features (GraphSAGE) and a longer window to catch them. Medium scores never trigger a hold — only a warning call."
     ]
    })]
   })]
  }), e.jsxs("div", {
   className: "grid g-2",
   children: [e.jsxs(v, {
    title: "What the model learned",
    sub: "Weight of each signal (standardised). Every signal is monotone: it can only push risk in its natural direction, so explanations always make sense.",
    children: [e.jsx("div", {
     className: "wbars",
     onMouseLeave: () => j(null),
     children: r.map(c => e.jsxs("div", {
      className: `wbar ${x===c.k?"on":""}`,
      onMouseEnter: () => j(c.k),
      children: [e.jsx("span", {
       className: "wb-l",
       children: c.label
      }), e.jsx("span", {
       className: "wb-t",
       children: e.jsx("i", {
        style: {
         width: `${c.w/l*100}%`
        }
       })
      }), e.jsx("span", {
       className: "wb-v mono",
       children: c.w.toFixed(2)
      })]
     }, c.k))
    }), e.jsx("p", {
     className: "muted",
     style: {
      fontSize: 12,
      marginTop: 8
     },
     children: "A weight of 0 means the signal added nothing beyond the others on this data. Plus two graph signals added at scoring time: money traced from a complaint (+1.6 log-odds) and direct links to high-risk accounts."
    })]
   }), e.jsxs(v, {
    title: "How the score is built",
    sub: "Same pipeline as the production design, smaller pieces.",
    children: [e.jsxs("ol", {
     className: "steps",
     children: [e.jsxs("li", {
      children: [e.jsx("b", {
       children: "Replay"
      }), " every transaction in time order (FIFO), so pass-through, dwell time and fan-out are measured, not guessed."]
     }), e.jsxs("li", {
      children: [e.jsx("b", {
       children: "Learn"
      }), " a logistic model on 70% of accounts in the browser (", t.ms.toFixed(0), " ms), with monotone constraints. Production: XGBoost with the same constraints, trained on Nodus."]
     }), e.jsxs("li", {
      children: [e.jsx("b", {
       children: "Explain"
      }), " exactly: each signal's contribution is its weight × how far the account is from average (exact SHAP values for a linear model), shown as points that add up to the score."]
     }), e.jsxs("li", {
      children: [e.jsx("b", {
       children: "Propagate"
      }), " over the money graph: accounts that receive traced complaint money, or deal directly with high-risk accounts, move up."]
     }), e.jsxs("li", {
      children: [e.jsx("b", {
       children: "Act"
      }), " by band: ≥ ", n, " → hold candidate (officer approves), ", i.settings.callLo, "–", n - 1, " on a new account → Hindi warning call, below → leave alone."]
     })]
    }), e.jsxs("div", {
     style: {
      marginTop: 12,
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
     },
     children: [e.jsx(S, {
      tone: "neutral",
      children: "Data: synthetic, seeded"
     }), e.jsxs(S, {
      tone: "neutral",
      children: [(t.trainN + t.testN).toLocaleString("en-IN"), " accounts scored"]
     }), e.jsxs(S, {
      tone: "neutral",
      children: ["Mule share ", u((t.trainPos + t.testPos) / (t.trainN + t.testN), 1)]
     })]
    })]
   })]
  }), e.jsx(W, {
   thr: n,
   lr: a
  }), e.jsx("p", {
   className: "muted",
   style: {
    fontSize: 12,
    marginTop: 12
   },
   children: "Honesty note: these are results on synthetic data shaped like Indian UPI/IMPS mule patterns. They show the method works end to end; they are not a claim about real-world accuracy."
  })]
 })
}
export {
 A as
 default
};