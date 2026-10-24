(function() {
 "use strict";

 function pt(r = 20261024) {
  let t = r >>> 0;
  const d = () => {
   t = t + 1831565813 >>> 0;
   let s = t;
   return s = Math.imul(s ^ s >>> 15, s | 1), s ^= s + Math.imul(s ^ s >>> 7, s | 61), ((s ^ s >>> 14) >>> 0) / 4294967296
  };
  return {
   next: d,
   range: (s, m) => s + (m - s) * d(),
   int: (s, m) => Math.floor(s + (m - s + 1) * d()),
   chance: s => d() < s,
   pick: s => s[Math.floor(d() * s.length)],
   logu: (s, m) => Math.exp(Math.log(s) + (Math.log(m) - Math.log(s)) * d()),
   shuffle: s => {
    const m = s.slice();
    for (let A = m.length - 1; A > 0; A--) {
     const I = Math.floor(d() * (A + 1));
     [m[A], m[I]] = [m[I], m[A]]
    }
    return m
   },
   hex: s => Array.from({
    length: s
   }, () => "0123456789ABCDEF" [Math.floor(d() * 16)]).join(""),
   b58: s => Array.from({
    length: s
   }, () => "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz" [Math.floor(d() * 58)]).join(""),
   digits: s => Array.from({
    length: s
   }, () => Math.floor(d() * 10)).join("")
  }
 }
 const at = 1440,
  l = (r, t, d = 0) => r * at + t * 60 + d;

 function $t(r) {
  const t = Math.max(0, Math.round(r));
  if (t < 60) return `${t} min`;
  if (t < at) return `${Math.floor(t/60)} h ${t%60?`${t%60} min`:""}`.trim();
  const d = Math.floor(t / at);
  return `${d} day${d>1?"s":""}`
 }

 function Nt(r) {
  return `₹${Math.round(r||0).toLocaleString("en-IN")}`
 }

 function W(r) {
  const t = Math.round(r || 0),
   d = Math.abs(t);
  return d >= 1e7 ? `₹${(t/1e7).toFixed(2)} Cr` : d >= 1e5 ? `₹${(t/1e5).toFixed(2)} L` : Nt(t)
 }

 function q(r, t = 0) {
  return `${(r*100).toFixed(t)}%`
 }
 const ht = l(6, 14, 18),
  Rt = 92,
  Ut = {
   BKID: "Bank of India",
   SBIN: "State Bank of India",
   PUNB: "Punjab National Bank",
   CNRB: "Canara Bank",
   UBIN: "Union Bank of India",
   HDFC: "HDFC Bank",
   ICIC: "ICICI Bank",
   UTIB: "Axis Bank",
   KKBK: "Kotak Mahindra Bank",
   IDFB: "IDFC First Bank",
   AUBL: "AU Small Finance Bank",
   FINO: "Fino Payments Bank",
   AIRP: "Airtel Payments Bank",
   IMPT: "Imported data"
  },
  Et = {
   A: "Exchange A",
   B: "Exchange B"
  },
  Ft = ["Rahul", "Amit", "Rohit", "Vikas", "Sanjay", "Arjun", "Imran", "Karan", "Deepak", "Sahil", "Nikhil", "Manoj", "Ravi", "Ankit", "Sourav", "Bikash", "Pranjal", "Abhishek", "Faizan", "Gaurav",
   "Harsh", "Joydeep", "Kunal", "Mrinal", "Nitin", "Pankaj", "Rajib", "Suresh", "Tarun", "Vivek"
  ],
  jt = ["Pooja", "Meena", "Anjali", "Priya", "Neha", "Sneha", "Ritu", "Kavita", "Sunita", "Rekha", "Bhaswati", "Dipika", "Farah", "Gargi", "Ishita", "Jyoti", "Komal", "Lipika", "Mousumi", "Nandini",
   "Pallavi", "Rashmi", "Shabnam", "Tanvi", "Urmila"
  ],
  xt = ["Sharma", "Verma", "Das", "Saikia", "Bora", "Kalita", "Nath", "Gogoi", "Baruah", "Hussain", "Ali", "Singh", "Kumar", "Yadav", "Gupta", "Mishra", "Patel", "Reddy", "Iyer", "Menon", "Dutta",
   "Sen", "Roy", "Chakraborty", "Hazarika", "Deka", "Khan", "Joshi", "Mehta", "Pandey"
  ],
  Ht = ["Guwahati", "Jorhat", "Dibrugarh", "Silchar", "Tezpur", "Shillong", "Kolkata", "Patna", "Ranchi", "Delhi", "Jaipur", "Pune", "Bengaluru", "Hyderabad", "Lucknow", "Bhopal", "Chandigarh",
   "Indore", "Nagpur", "Bhubaneswar"
  ],
  Kt = ["Kirana Store", "Medical Hall", "Mobile Point", "Tea Stall", "Sweets", "Hardware", "Garments", "Electronics", "Hostel", "Coaching Centre", "Pharmacy", "Bakery", "Stationers", "Auto Parts",
   "Travels", "Dhaba", "Salon", "Book Depot"
  ],
  mt = ["Shree", "Maa Kamakhya", "New", "Royal", "Sai", "Brahmaputra", "City", "Lakshmi", "Ganesh", "Star", "Jai Hind", "Northeast", "Durga", "Krishna"];

 function gt(r = 20261024) {
  const t = pt(r),
   d = {},
   u = {},
   s = [];
  let m = 0,
   A = 1e3;
  const I = Object.keys(Ut).filter(n => n !== "IMPT"),
   K = () => `D-${t.hex(4)}`,
   C = n => `${t.pick(n==="F"?jt:Ft)} ${t.pick(xt)}`;

  function k(n) {
   const i = n.id || `AC${++A}`,
    a = n.bank || t.pick(I),
    h = n.g || (t.chance(.5) ? "M" : "F"),
    c = {
     id: i,
     kind: "bank",
     bank: a,
     g: h,
     mask: `••${t.int(1e3,9999)}`,
     ifsc: `${a}0SYN${t.int(100,999)}`,
     name: n.name || C(h),
     ageY: n.ageY || t.int(19, 60),
     occ: n.occ || "Salaried",
     income: n.income ?? 3e4,
     opened: n.opened ?? t.int(200, 3e3),
     device: n.device || K(),
     city: n.city || t.pick(Ht),
     phone: `+91 9${t.int(1e3,9999)}•••${t.int(100,999)}`,
     role: n.role || "normal",
     label: n.label || 0,
     open0: n.open0 ?? 1e4,
     ...n
    };
   return c.id = i, c.bank = a, d[i] = c, c
  }

  function v(n) {
   const i = n.id || `T${t.b58(33)}`,
    a = {
     id: i,
     kind: "wallet",
     chain: "TRON",
     label: "Unlabelled wallet",
     flags: [],
     open0: 0,
     ...n
    };
   return a.id = i, u[i] = a, a
  }

  function T(n) {
   return n === "TRC20" ? t.hex(64).toLowerCase() : n === "NEFT" || n === "RTGS" ? `${n==="NEFT"?"N":"R"}${t.digits(15)}` : n === "P2P" ? `P2P-${t.digits(9)}` : n === "ATM" ? `ATM-${t.digits(8)}` : t
    .digits(12)
  }

  function o(n, i, a, h, c, g = {}) {
   const w = `TX${String(++m).padStart(6,"0")}`;
   return s.push({
    id: w,
    t: Math.round(n),
    from: i,
    to: a,
    amt: h == null ? null : Math.round(h * 100) / 100,
    cur: g.cur || "INR",
    rail: c,
    ref: T(c),
    ...g
   }), w
  }

  function $(n, i = .04) {
   return t.chance(i) ? l(n, t.chance(.5) ? 23 : t.int(0, 4), t.int(0, 59)) : l(n, t.int(8, 21), t.int(0, 59))
  }
  const H = l(6, 18, 0),
   D = n => n <= H,
   y = [
    ["Salaried", .4, 25e3, 15e4],
    ["Student", .18, 3e3, 12e3],
    ["Homemaker", .12, 2e3, 8e3],
    ["Self-employed", .14, 3e4, 2e5],
    ["Retired", .08, 15e3, 6e4],
    ["Gig worker", .08, 12e3, 35e3]
   ],
   U = () => {
    let n = t.next();
    for (const i of y)
     if ((n -= i[1]) <= 0) return i;
    return y[0]
   },
   j = [];
  for (let n = 0; n < 720; n++) {
   const [i, , a, h] = U(), c = Math.round(t.logu(a, h) / 100) * 100, g = i === "Student" ? t.int(18, 24) : i === "Retired" ? t.int(60, 78) : t.int(22, 58), w = t.chance(.09) ? t.int(10, 90) : t.int(
    120, 4200);
   j.push(k({
    occ: i,
    income: c,
    ageY: g,
    opened: w,
    open0: Math.max(2500, c * t.range(.4, 2.6)),
    role: "normal"
   }))
  }
  const N = [];
  for (let n = 0; n < 150; n++) N.push(k({
   name: `${t.pick(mt)} ${t.pick(Kt)}`,
   occ: "Business",
   income: Math.round(t.logu(3e5, 25e5)),
   ageY: t.int(28, 60),
   opened: t.int(200, 4500),
   open0: t.logu(4e4, 5e5),
   role: "business"
  }));
  const Y = j.filter(n => n.occ === "Salaried");
  for (let n = 0; n < 40; n++) {
   const i = t.pick(j),
    a = t.pick(j);
   i !== a && (a.device = i.device)
  }
  for (const n of j) {
   for (let a = 0; a <= 6; a++) {
    const h = n.occ === "Student" ? t.int(0, 2) : t.int(0, 3);
    for (let c = 0; c < h; c++) {
     const g = $(a);
     D(g) && o(g, n.id, t.pick(N).id, t.logu(80, Math.min(9e3, n.income * .15 + 500)), "UPI")
    }
   }
   const i = () => t.int(0, 6);
   if (n.occ === "Salaried" || n.occ === "Homemaker")
    for (let a = 0, h = t.int(0, 2); a < h; a++) {
     const c = $(i());
     D(c) && o(c, t.pick(j).id, n.id, t.logu(500, 15e3), "UPI")
    }
   if (n.occ === "Student")
    for (let a = 0, h = t.int(1, 2); a < h; a++) {
     const c = $(i());
     D(c) && o(c, t.pick(Y).id, n.id, t.logu(2e3, 12e3), "UPI")
    }
   if (n.occ === "Self-employed")
    for (let a = 0, h = t.int(3, 8); a < h; a++) {
     const c = $(i()),
      g = t.logu(2e3, 6e4);
     if (D(c) && (o(c, t.chance(.5) ? `EXT:${t.pick(I)}` : t.pick(j).id, n.id, g, t.pick(["UPI", "IMPS", "NEFT"])), t.chance(.45))) {
      const w = c + t.int(180, 1800);
      D(w) && o(w, n.id, `EXT:${t.pick(I)}`, g * t.range(.3, .6), "NEFT")
     }
    }
   if (n.occ === "Retired") {
    const a = l(1, t.int(9, 12), t.int(0, 59));
    o(a, `EXT:${t.pick(I)}`, n.id, n.income, "NEFT")
   }
   if (n.occ === "Gig worker") {
    for (let a = 0; a <= 6; a++)
     if (t.chance(.7)) {
      const h = l(a, t.int(20, 23), t.int(0, 59));
      D(h) && o(h, "EXT:UTIB", n.id, t.logu(300, 2500), "IMPS")
     }
   }
  }
  for (const n of N)
   for (let i = 0; i <= 5; i++) t.chance(.75) && o(l(i, t.int(21, 23), t.int(0, 59)), n.id, `EXT:${t.pick(I)}`, null, "NEFT", {
    sweepPct: t.range(.6, .9)
   });
  const X = N.slice(0, 12);
  for (let n = 0; n < 25; n++) {
   const i = k({
     name: `${t.pick(mt)} ${t.pick(["Collections","Agencies","Distributors","Telecom Recharge","Bill Pay Point"])}`,
     occ: "Business",
     income: Math.round(t.logu(2e5, 15e5)),
     ageY: t.int(25, 55),
     opened: t.int(40, 900),
     open0: t.logu(2e3, 2e4),
     role: "business",
     tricky: "sweeper"
    }),
    a = t.pick(X);
   for (let h = 0, c = t.int(5, 12); h < c; h++) {
    const g = $(t.int(0, 6), .02);
    if (!D(g)) continue;
    o(g, t.chance(.6) ? t.pick(j).id : `EXT:${t.pick(I)}`, i.id, t.logu(2e3, 45e3), "UPI");
    const w = g + t.int(8, 45);
    D(w) && o(w, i.id, a.id, null, "IMPS", {
     sweepPct: t.range(.85, .96)
    })
   }
  }
  const P = N.filter(n => /Hostel|Coaching|Book/.test(n.name));
  for (let n = 0; n < 22; n++) {
   const i = k({
    occ: "Student",
    income: t.int(4e3, 12e3),
    ageY: t.int(18, 23),
    opened: t.int(60, 1500),
    open0: t.logu(300, 4e3),
    role: "normal",
    tricky: "fee-payer"
   });
   for (let a = 0, h = t.int(1, 2); a < h; a++) {
    const c = $(t.int(0, 6), .01);
    if (!D(c)) continue;
    o(c, t.pick(Y).id, i.id, t.logu(8e3, 3e4), t.pick(["UPI", "IMPS"]));
    const g = c + t.int(12, 50);
    D(g) && o(g, i.id, t.pick(P.length ? P : N).id, null, "UPI", {
     sweepPct: t.range(.82, .95)
    })
   }
  }
  const e = (n, i = {}) => v({
    kind: "exchange",
    exchange: n,
    label: `${Et[n]} · user deposit address`,
    ...i
   }),
   f = [];
  for (let n = 0; n < 3; n++) f.push(v({
   label: "Scam cluster SC-7 (demo watchlist)",
   flags: ["watchlist"],
   open0: t.logu(2e3, 4e4)
  }));
  const b = [],
   B = ["Zenith OTC Services", "Brahmaputra Digital Traders", "Nova Coin Exchange Desk", "Eastgate VDA Traders"];
  for (let n = 0; n < 4; n++) {
   const i = k({
    name: B[n],
    occ: "P2P crypto seller (VDA)",
    income: 25e5,
    ageY: t.int(26, 40),
    opened: t.int(300, 1100),
    open0: t.logu(2e4, 12e4),
    role: "p2p",
    bank: ["HDFC", "ICIC", "UTIB", "KKBK"][n]
   });
   i.wallet = v({
    label: `${i.name} · P2P seller wallet`,
    owner: i.id,
    open0: 5e4
   }).id, b.push(i)
  }
  for (let n = 0; n < 45; n++) {
   const i = t.pick(j),
    a = t.pick(b),
    h = v({
     label: "Retail buyer wallet",
     owner: i.id
    }),
    c = $(t.int(0, 6));
   if (!D(c)) continue;
   const g = o(c, i.id, a.id, t.logu(2e3, 4e4), "UPI"),
    w = c + t.int(2, 9);
   if (o(w, a.id, h.id, null, "P2P", {
     match: g,
     cur: "USDT"
    }), t.chance(.5)) {
    const E = w + t.int(60, 2e3);
    D(E) && o(E, h.id, e(t.pick(["A", "B"])).id, null, "TRC20", {
     cur: "USDT",
     sweepPct: .99
    })
   }
  }
  const M = Array.from({
   length: 36
  }, () => v({
   label: "Unlabelled wallet",
   open0: t.logu(100, 2e4)
  }));
  for (let n = 0; n < 70; n++) {
   const i = t.pick(M),
    a = t.chance(.2) ? e(t.pick(["A", "B"])) : t.pick(M),
    h = l(t.int(0, 6), t.int(0, 23), t.int(0, 59));
   D(h) && i !== a && o(h, i.id, a.id, null, "TRC20", {
    cur: "USDT",
    sweepPct: t.range(.05, .4)
   })
  }
  for (let n = 0; n < 6; n++) {
   const i = l(t.int(0, 6), t.int(0, 23), t.int(0, 59));
   D(i) && o(i, t.pick(f).id, t.pick(M).id, null, "TRC20", {
    cur: "USDT",
    sweepPct: t.range(.05, .2)
   })
  }

  function p(n) {
   for (let i = 0; i <= 6; i++)
    for (let a = 0, h = t.int(0, 2); a < h; a++) {
     const c = $(i);
     D(c) && o(c, n.id, t.pick(N).id, t.logu(60, 1500), "UPI")
    }
   if (t.chance(.5)) {
    const i = $(t.int(0, 5));
    o(i, t.pick(Y).id, n.id, t.logu(1e3, 6e3), "UPI")
   }
  }
  for (let n = 0; n < 18; n++) {
   const i = t.pick(j);
   i.tricky = "group-pay";
   const a = $(t.int(1, 6), .03),
    h = t.int(3, 7);
   for (let g = 0; g < h; g++) {
    const w = a + g * t.int(2, 12);
    D(w) && o(w, t.pick(j).id, i.id, t.logu(1500, 6e3), "UPI")
   }
   const c = a + h * 12 + t.int(5, 40);
   D(c) && o(c, i.id, t.chance(.5) ? t.pick(j).id : `EXT:${t.pick(I)}`, null, "UPI", {
    sweepPct: t.range(.5, .8)
   })
  }
  const R = [],
   x = [49999, 49500, 49e3, 45e3, 9999, 24999];
  for (let n = 1; n <= 26; n++) {
   const i = t.chance(.38),
    a = [K(), K()],
    h = `R${String(n).padStart(2,"0")}`,
    c = F => {
     const O = i ? t.pick(["Salaried", "Self-employed", "Student"]) : t.pick(["Student", "Student", "Homemaker", "Self-employed", "Gig worker", "Student"]);
     return k({
      occ: O,
      income: O === "Student" ? t.int(3e3, 9e3) : t.int(8e3, i ? 6e4 : 2e4),
      ageY: O === "Student" ? t.int(18, 23) : t.int(21, 40),
      opened: i ? t.int(90, 700) : t.int(6, 110),
      device: t.chance(i ? .35 : .8) ? t.pick(a) : K(),
      open0: t.logu(100, 3e3),
      role: "mule",
      label: 1,
      ring: h,
      layer: F
     })
    },
    g = Array.from({
     length: t.int(1, 2)
    }, () => c(1)),
    w = Array.from({
     length: t.int(2, 4)
    }, () => c(2));
   for (const F of [...g, ...w]) p(F);
   R.push(...w);
   const E = v({
     label: "Unlabelled wallet"
    }),
    G = e(t.pick(["A", "B"])),
    z = new Set;
   for (let F = 0, O = Math.max(t.int(2, 5), g.length);
    (F < O || w.some(J => !z.has(J.id))) && !(F > 12); F++) {
    const J = t.int(1, 6),
     ot = J === 6 ? l(6, t.int(0, 12), t.int(0, 59)) : $(J, i ? .05 : .25),
     ct = g[F % g.length],
     ut = t.chance(.4) ? t.pick(x) : t.logu(15e3, 15e4);
    o(ot, `EXT:${t.pick(I)}`, ct.id, ut, t.pick(["IMPS", "UPI", "NEFT"]));
    const ft = i ? t.int(120, 600) : t.int(4, 45),
     nt = Math.min(w.length, t.int(i ? 1 : 2, i ? 2 : 3)),
     Tt = [...w.filter(V => !z.has(V.id)), ...t.shuffle(w.filter(V => z.has(V.id)))].slice(0, nt);
    Tt.forEach(V => z.add(V.id));
    const It = t.range(.9, .98);
    Tt.forEach((V, vt) => {
     const Ct = ot + ft + vt * t.int(1, 6);
     o(Ct, ct.id, V.id, null, "IMPS", {
      sweepPct: It / nt / (1 - It * vt / nt)
     });
     const Zt = i ? t.int(180, 720) : t.int(8, 90),
      et = Ct + Zt,
      Bt = t.next();
     if (Bt < .4) o(et, V.id, "CASH", null, "ATM", {
      sweepPct: .5
     }), o(et + t.int(2, 15), V.id, "CASH", null, "ATM", {
      sweepPct: .92
     });
     else if (Bt < .7) {
      const Dt = t.pick(b),
       qt = o(et, V.id, Dt.id, null, "UPI", {
        sweepPct: .95
       }),
       Wt = et + t.int(2, 9);
      o(Wt, Dt.id, E.id, null, "P2P", {
       match: qt,
       cur: "USDT"
      })
     } else o(et, V.id, `EXT:${t.pick(I)}`, null, "IMPS", {
      sweepPct: .95
     })
    })
   }
   for (let F = 1; F <= 6; F++) {
    const O = l(F, 23, t.int(0, 50));
    D(O) && o(O, E.id, G.id, null, "TRC20", {
     cur: "USDT",
     sweepPct: .98
    });
    const J = l(F, 23, 55);
    D(J) && t.chance(.6) && o(J + t.int(30, 300), G.id, t.chance(.3) ? t.pick(f).id : "BRIDGE", null, "TRC20", {
     cur: "USDT",
     sweepPct: .97
    })
   }
  }
  for (let n = 0; n < 8; n++) {
   const i = k({
    occ: t.pick(["Student", "Student", "Gig worker"]),
    income: t.int(8e3, 16e3),
    ageY: t.int(18, 23),
    opened: t.int(20, 75),
    open0: t.logu(800, 4e3),
    role: "early",
    label: 1
   });
   p(i);
   const a = n < 5 ? l(6, t.int(9, 13), t.int(0, 59)) : l(5, t.int(10, 20), t.int(0, 59));
   o(a, `EXT:${t.pick(I)}`, i.id, t.pick([1e4, 12e3, 15e3, 14500, 18e3]), "UPI");
   const h = t.int(25, 70);
   o(a + h, i.id, t.chance(.5) ? t.pick(R).id : `EXT:${t.pick(I)}`, null, "IMPS", {
    sweepPct: t.range(.4, .55)
   }), o(a + h + t.int(30, 90), i.id, `EXT:${t.pick(I)}`, null, "IMPS", {
    sweepPct: t.range(.55, .8)
   })
  }
  const S = [];
  {
   const n = k({
     id: "AC0907",
     name: "Prakash Gogoi",
     g: "M",
     occ: "Retired",
     ageY: 67,
     income: 52e3,
     opened: 6100,
     city: "Dibrugarh",
     bank: "ICIC",
     open0: 124e4,
     role: "victim"
    }),
    i = k({
     id: "AC0911",
     name: "Shakti Enterprises",
     occ: "Business (current a/c)",
     ageY: 29,
     income: 8e4,
     opened: 52,
     city: "Kolkata",
     bank: "IDFB",
     open0: 4200,
     role: "mule",
     label: 1,
     layer: 1,
     device: "D-6611"
    }),
    a = k({
     id: "AC0912",
     name: "Bikash Roy",
     g: "M",
     occ: "Gig worker",
     ageY: 24,
     income: 14e3,
     opened: 33,
     city: "Kolkata",
     bank: "FINO",
     open0: 600,
     role: "mule",
     label: 1,
     layer: 2,
     device: "D-6611"
    }),
    h = k({
     id: "AC0913",
     name: "Shabnam Khan",
     g: "F",
     occ: "Homemaker",
     ageY: 27,
     income: 4e3,
     opened: 41,
     city: "Howrah",
     bank: "AIRP",
     open0: 300,
     role: "mule",
     label: 1,
     layer: 2,
     device: "D-6612"
    }),
    c = k({
     id: "AC0914",
     name: "Nitin Yadav",
     g: "M",
     occ: "Student",
     ageY: 21,
     income: 6e3,
     opened: 18,
     city: "Patna",
     bank: "AUBL",
     open0: 250,
     role: "mule",
     label: 1,
     layer: 2,
     device: "D-6612"
    }),
    g = v({
     id: "TQm4cZsyn7RkV2pWdB8xN3hLf6Jy9aEoT1",
     label: "Unlabelled wallet"
    }),
    w = b[2],
    E = o(l(1, 15, 10), n.id, i.id, 49e4, "RTGS"),
    G = o(l(1, 15, 40), n.id, i.id, 49e4, "RTGS");
   o(l(1, 15, 52), i.id, a.id, 24e4, "IMPS"), o(l(1, 15, 58), i.id, h.id, 245e3, "IMPS"), o(l(1, 16, 20), i.id, c.id, 485e3, "NEFT");
   const z = o(l(1, 16, 35), a.id, w.id, 238e3, "IMPS");
   o(l(1, 16, 41), w.id, g.id, null, "P2P", {
    match: z,
    cur: "USDT"
   }), o(l(1, 17, 5), h.id, "EXT:SBIN", 244e3, "IMPS");
   const F = o(l(1, 18, 10), c.id, w.id, 48e4, "IMPS");
   o(l(1, 18, 17), w.id, g.id, null, "P2P", {
    match: F,
    cur: "USDT"
   }), o(l(1, 19, 2), g.id, f[0].id, null, "TRC20", {
    cur: "USDT",
    sweepPct: .99
   }), S.push({
    id: "C-2954",
    ack: "31412210048217",
    type: "Digital arrest",
    victim: n.id,
    amount: 98e4,
    fraudAt: l(1, 15, 10),
    reportedAt: l(2, 9, 30),
    taintTx: [E, G],
    channel: "1930 helpline",
    story: 'Caller posing as a CBI officer kept the victim on a video call for 6 hours and made him transfer savings to a "verification account".',
    seedHolds: {
     [i.id]: l(2, 10, 5),
     [a.id]: l(2, 10, 5),
     [h.id]: l(2, 10, 5),
     [c.id]: l(2, 10, 5)
    },
    seedApproved: l(2, 10, 5)
   })
  } {
   const n = k({
     id: "AC0931",
     name: "Rekha Sharma",
     g: "F",
     occ: "Retired",
     ageY: 58,
     income: 41e3,
     opened: 5200,
     city: "Jorhat",
     bank: "HDFC",
     open0: 72e4,
     role: "victim"
    }),
    i = k({
     id: "AC0932",
     name: "Arjun Mehta",
     g: "M",
     occ: "Self-employed",
     ageY: 26,
     income: 22e3,
     opened: 70,
     city: "Jaipur",
     bank: "CNRB",
     open0: 1800,
     role: "mule",
     label: 1,
     layer: 1,
     device: "D-5A20"
    }),
    a = k({
     id: "AC0933",
     name: "Kavita Joshi",
     g: "F",
     occ: "Homemaker",
     ageY: 29,
     income: 3e3,
     opened: 38,
     city: "Jaipur",
     bank: "PUNB",
     open0: 900,
     role: "mule",
     label: 1,
     layer: 1,
     device: "D-5A20"
    }),
    h = k({
     id: "AC0934",
     name: "Faizan Ali",
     g: "M",
     occ: "Student",
     ageY: 21,
     income: 5e3,
     opened: 15,
     city: "Lucknow",
     bank: "FINO",
     open0: 400,
     role: "mule",
     label: 1,
     layer: 2,
     device: "D-5A21"
    }),
    c = k({
     id: "AC0935",
     name: "Ritu Pandey",
     g: "F",
     occ: "Student",
     ageY: 20,
     income: 4e3,
     opened: 22,
     city: "Lucknow",
     bank: "AIRP",
     open0: 250,
     role: "mule",
     label: 1,
     layer: 2,
     device: "D-5A21"
    }),
    g = k({
     id: "AC0936",
     name: "Gaurav Mishra",
     g: "M",
     occ: "Salaried",
     ageY: 24,
     income: 18e3,
     opened: 40,
     city: "Kanpur",
     bank: "SBIN",
     open0: 1500,
     role: "mule",
     label: 1,
     layer: 2,
     device: "D-5A22"
    }),
    w = v({
     id: "TJx9pKsyn2WqLmB4vC7dR8nF5hY3aZoE6u",
     label: "Unlabelled wallet"
    }),
    E = e("B", {
     id: "TXdKe2syn9LpQ4wVb7Nm3cF8jH6rT5aZy1"
    }),
    G = b[1],
    z = o(l(4, 10, 30), n.id, i.id, 2e5, "NEFT"),
    F = o(l(4, 10, 41), n.id, i.id, 16e4, "NEFT"),
    O = o(l(4, 10, 55), n.id, a.id, 1e5, "IMPS");
   o(l(4, 10, 52), i.id, h.id, 99e3, "IMPS"), o(l(4, 11, 0), i.id, c.id, 99500, "IMPS"), o(l(4, 11, 12), i.id, "EXT:UBIN", 12e4, "IMPS"), o(l(4, 11, 25), i.id, g.id, 38e3, "IMPS"), o(l(4, 11, 6), a
    .id, "CASH", 49e3, "ATM"), o(l(4, 11, 15), a.id, g.id, 49e3, "IMPS");
   const J = o(l(4, 11, 20), h.id, G.id, 98e3, "UPI");
   o(l(4, 11, 27), G.id, w.id, null, "P2P", {
    match: J,
    cur: "USDT"
   }), o(l(4, 12, 5), w.id, E.id, null, "TRC20", {
    cur: "USDT",
    sweepPct: .99
   }), o(l(4, 13, 0), E.id, "BRIDGE", null, "TRC20", {
    cur: "USDT",
    sweepPct: .99
   }), o(l(4, 11, 25), c.id, "CASH", 49e3, "ATM"), o(l(4, 11, 32), c.id, "CASH", 49e3, "ATM"), o(l(4, 12, 10), g.id, "EXT:KKBK", 85e3, "IMPS"), S.push({
    id: "C-2987",
    ack: "31412240019935",
    type: "Investment scam",
    victim: n.id,
    amount: 46e4,
    fraudAt: l(4, 10, 30),
    reportedAt: l(4, 11, 5),
    taintTx: [z, F, O],
    channel: "NCRP portal",
    story: 'Victim was added to a "stock tips" WhatsApp group and paid into a fake trading app that showed fake profits.',
    seedHolds: {
     [g.id]: l(4, 11, 40),
     [i.id]: l(4, 11, 40),
     [a.id]: l(4, 11, 40),
     [h.id]: l(4, 11, 40),
     [c.id]: l(4, 11, 40)
    },
    seedFreezes: {
     [E.id]: l(4, 13, 20)
    },
    seedApproved: l(4, 11, 40)
   })
  } {
   const n = k({
     id: "AC0951",
     name: "Anil Verma",
     g: "M",
     occ: "Salaried",
     ageY: 52,
     income: 64e3,
     opened: 4300,
     city: "Guwahati",
     bank: "SBIN",
     open0: 34e4,
     role: "victim"
    }),
    i = k({
     id: "AC0952",
     name: "Rohit Saikia",
     g: "M",
     occ: "Student",
     ageY: 20,
     income: 6e3,
     opened: 34,
     city: "Guwahati",
     bank: "BKID",
     open0: 2340,
     role: "mule",
     label: 1,
     layer: 1,
     device: "D-77A1",
     story: 'Rented his account for a ₹5,000 "commission" offered on Telegram.'
    }),
    a = k({
     id: "AC0953",
     name: "Pooja Das",
     g: "F",
     occ: "Homemaker",
     ageY: 24,
     income: 3e3,
     opened: 61,
     city: "Guwahati",
     bank: "PUNB",
     open0: 1150,
     role: "mule",
     label: 1,
     layer: 2,
     device: "D-77A1"
    }),
    h = k({
     id: "AC0954",
     name: "Imran Ali",
     g: "M",
     occ: "Student",
     ageY: 22,
     income: 5e3,
     opened: 19,
     city: "Nagaon",
     bank: "FINO",
     open0: 500,
     role: "mule",
     label: 1,
     layer: 2,
     device: "D-3F02"
    }),
    c = k({
     id: "AC0955",
     name: "Karan Bora",
     g: "M",
     occ: "Student",
     ageY: 19,
     income: 4e3,
     opened: 27,
     city: "Tezpur",
     bank: "AIRP",
     open0: 800,
     role: "mule",
     label: 1,
     layer: 2,
     device: "D-3F02"
    }),
    g = k({
     id: "AC0956",
     name: "Meena Kalita",
     g: "F",
     occ: "Homemaker",
     ageY: 31,
     income: 3e3,
     opened: 45,
     city: "Guwahati",
     bank: "UBIN",
     open0: 1700,
     role: "mule",
     label: 1,
     layer: 2,
     device: "D-91C4"
    }),
    w = k({
     id: "AC0957",
     name: "Deepak Nath",
     g: "M",
     occ: "Gig worker",
     ageY: 23,
     income: 9e3,
     opened: 12,
     city: "Shillong",
     bank: "AUBL",
     open0: 300,
     role: "mule",
     label: 1,
     layer: 3,
     device: "D-91C4"
    }),
    E = k({
     id: "AC0958",
     name: "Sahil Hussain",
     g: "M",
     occ: "Student",
     ageY: 21,
     income: 5e3,
     opened: 9,
     city: "Silchar",
     bank: "KKBK",
     open0: 200,
     role: "mule",
     label: 1,
     layer: 3,
     device: "D-91C4"
    }),
    G = b[0],
    z = b[1],
    F = v({
     id: "TNw8hVsyn4QzK7pLc2mB9xR5dF3jY6aE1t",
     label: "Unlabelled wallet"
    }),
    O = v({
     id: "TGr5bQsyn8MvN2kX7pW4cJ9hL3fD6eA1yz",
     label: "Unlabelled wallet",
     open0: 320
    }),
    J = e("A", {
     id: "TYc7kPsyn3RmW9vB2nQ5xH8jL4fD6eZa2s"
    });
   o(l(3, 2, 14), O.id, f[1].id, 300, "TRC20", {
    cur: "USDT"
   });
   const ot = o(l(6, 13, 2), n.id, i.id, 12e4, "IMPS"),
    ct = o(l(6, 13, 9), n.id, i.id, 8e4, "UPI");
   o(l(6, 13, 21), i.id, a.id, 49e3, "IMPS"), o(l(6, 13, 24), i.id, h.id, 48500, "IMPS"), o(l(6, 13, 28), i.id, c.id, 49500, "IMPS"), o(l(6, 13, 40), i.id, g.id, 45e3, "IMPS"), o(l(6, 13, 47), a.id,
    "CASH", 4e4, "ATM"), o(l(6, 14, 5), a.id, w.id, 9e3, "IMPS"), o(l(6, 13, 52), h.id, w.id, 48e3, "IMPS");
   const ut = o(l(6, 13, 58), c.id, G.id, 49e3, "UPI");
   o(l(6, 14, 4), G.id, F.id, null, "P2P", {
    match: ut,
    cur: "USDT"
   });
   const ft = o(l(6, 14, 15), w.id, G.id, 5e4, "UPI");
   o(l(6, 14, 20), G.id, F.id, null, "P2P", {
    match: ft,
    cur: "USDT"
   }), o(l(6, 14, 31), F.id, O.id, 1070, "TRC20", {
    cur: "USDT"
   }), o(l(6, 14, 38), g.id, E.id, 44e3, "IMPS"), o(l(6, 14, 44), O.id, J.id, 1065, "TRC20", {
    cur: "USDT"
   }), o(l(6, 14, 50), w.id, "CASH", 7e3, "ATM");
   const nt = o(l(6, 14, 55), E.id, z.id, 43500, "UPI");
   o(l(6, 15, 1), z.id, F.id, null, "P2P", {
    match: nt,
    cur: "USDT"
   }), o(l(6, 15, 10), J.id, "BRIDGE", null, "TRC20", {
    cur: "USDT",
    sweepPct: .995
   }), o(l(6, 15, 20), F.id, O.id, 470, "TRC20", {
    cur: "USDT"
   }), o(l(6, 15, 32), O.id, J.id, 468, "TRC20", {
    cur: "USDT"
   }), o(l(6, 15, 50), J.id, "BRIDGE", null, "TRC20", {
    cur: "USDT",
    sweepPct: .995
   }), o(l(6, 15, 25), i.id, "CASH", 1e4, "ATM"), S.push({
    id: "C-3021",
    ack: "31412260057321",
    type: "Fake job / task scam",
    victim: n.id,
    amount: 2e5,
    fraudAt: l(6, 13, 2),
    reportedAt: l(6, 14, 20),
    taintTx: [ot, ct],
    channel: "1930 helpline",
    story: 'Victim was offered a part-time "hotel review" job on Telegram, earned small payouts, then paid ₹2 lakh to "unlock" a VIP task.',
    event: "complaint",
    demo: !0
   })
  }
  return s.sort((n, i) => n.t - i.t || (n.id < i.id ? -1 : 1)), {
   accounts: d,
   wallets: u,
   txns: s,
   cases: S,
   sellers: b.map(n => n.id),
   watch: f.map(n => n.id)
  }
 }
 const L = .01,
  kt = r => r.startsWith("EXT:"),
  bt = r => r === "CASH" || r === "BRIDGE" || kt(r),
  St = r => r.to === "CASH" ? `CASH@${r.from}` : r.to,
  Pt = r => Math.floor((r % 1440 + 1440) % 1440 / 60);

 function st(r, {
  clock: t,
  holds: d = {},
  freezes: u = {},
  cases: s = [],
  method: m = "fifo"
 }) {
  const {
   accounts: A,
   wallets: I,
   txns: K
  } = r, C = {};
  for (const e of s)
   for (const f of e.taintTx) C[f] = e.id;
  const k = {},
   v = {},
   T = {},
   o = {},
   $ = {},
   H = {},
   D = {},
   y = {};
  for (const e of s) $[e.id] = [], T[e.id] = {}, o[e.id] = {};
  const U = e => {
    let f = k[e];
    if (!f) {
     const b = A[e] || I[e];
     f = k[e] = {
      lots: [],
      h: 0,
      bal: 0
     }, b && b.open0 > 0 && (f.lots.push({
      amt: b.open0,
      t: -1e9,
      taint: null,
      src: "open",
      inflow: !1
     }), f.bal = b.open0)
    }
    return f
   },
   j = e => y[e] || (y[e] = {
    inAmt: 0,
    outAmt: 0,
    inN: 0,
    outN: 0,
    senders: new Set,
    receivers: new Set,
    night: 0,
    below: 0,
    pt60: 0,
    dwell: [],
    outYoung: 0,
    outP2P: 0,
    outCash: 0,
    txN: 0,
    firstIn: null,
    lastT: null,
    fastEvents: 0
   }),
   N = (e, f, b, B) => {
    const M = v[e] || (v[e] = {});
    M[f] = Math.max(0, (M[f] || 0) + b), M[f] < .5 && (M[f] = 0);
    const p = T[f][e] || (T[f][e] = []);
    p.length && p[p.length - 1][0] === B ? p[p.length - 1][1] = M[f] : p.push([B, M[f]])
   },
   Y = (e, f, b) => {
    const B = {
     taint: {},
     pieces: []
    };
    let M = f;
    const p = m === "prorata";
    let R = null;
    if (p && e.bal > L) {
     R = {};
     for (let S = e.h; S < e.lots.length; S++) {
      const n = e.lots[S];
      if (n.taint && n.amt > L)
       for (const i in n.taint) R[i] = (R[i] || 0) + n.taint[i]
     }
    }
    const x = (S, n) => {
     const i = n / S.amt;
     if (S.taint && !p)
      for (const a in S.taint) {
       const h = S.taint[a] * i;
       B.taint[a] = (B.taint[a] || 0) + h, S.taint[a] -= h
      }
     S.amt -= n, B.pieces.push({
      amt: n,
      t: S.t,
      inflow: S.inflow
     })
    };
    if (b) {
     const S = e.lots.find(n => n.src === b && n.amt > L);
     if (S) {
      const n = Math.min(M, S.amt);
      if (p && S.taint) {
       const i = n / S.amt;
       for (const a in S.taint) {
        const h = S.taint[a] * i;
        B.taint[a] = (B.taint[a] || 0) + h, S.taint[a] -= h, R && (R[a] = Math.max(0, (R[a] || 0) - h))
       }
      }
      x(S, n), M -= n
     }
    }
    if (p && R && M > L) {
     const S = Math.min(1, M / Math.max(L, e.bal - (f - M)));
     for (const n in R) B.taint[n] = (B.taint[n] || 0) + R[n] * S;
     for (let n = e.h; n < e.lots.length; n++) {
      const i = e.lots[n];
      if (i.taint)
       for (const a in i.taint) i.taint[a] *= 1 - S
     }
    }
    if (m === "lifo") {
     for (let S = e.lots.length - 1; S >= e.h && M > L; S--) {
      const n = e.lots[S];
      if (n.amt <= L) continue;
      const i = Math.min(M, n.amt);
      x(n, i), M -= i
     }
     for (; e.h < e.lots.length && e.lots[e.h].amt <= L;) e.h++
    } else
     for (; M > L && e.h < e.lots.length;) {
      const S = e.lots[e.h];
      if (S.amt <= L) {
       e.h++;
       continue
      }
      const n = Math.min(M, S.amt);
      x(S, n), M -= n, S.amt <= L && e.h++
     }
    return e.bal -= f - Math.max(0, M), B
   },
   X = (e, f) => {
    const b = {};
    let B = f;
    for (let M = e.h; M < e.lots.length && B > L; M++) {
     const p = e.lots[M];
     if (p.amt <= L) continue;
     const R = Math.min(B, p.amt);
     if (p.taint)
      for (const x in p.taint) b[x] = (b[x] || 0) + p.taint[x] * (R / p.amt);
     B -= R
    }
    return b
   };
  for (const e of K) {
   if (e.t > t) {
    H[e.id] = "future";
    continue
   }
   const {
    from: f,
    to: b
   } = e, B = kt(f), M = d[f] != null && e.t >= d[f] ? "hold" : u[f] != null && e.t >= u[f] ? "freeze" : null;
   let p = e.amt;
   const R = B ? null : U(f);
   if (!B)
    if (e.match && p == null) {
     const c = R.lots.find(g => g.src === e.match && g.amt > L);
     p = c ? c.amt : 0
    } else p == null && (p = R.bal * (e.sweepPct || 1), p = e.cur === "USDT" ? Math.floor(p * 100) / 100 : Math.floor(p));
   if (M) {
    H[e.id] = "blocked";
    const c = R ? X(R, p || 0) : {};
    for (const g in c) c[g] >= 1 && $[g] && $[g].push({
     tx: e.id,
     from: f,
     to: St(e),
     t: e.t,
     amt: p,
     cur: e.cur,
     taint: c[g],
     rail: e.rail,
     status: "blocked",
     by: M
    });
    continue
   }
   if (!B && (!(p > L) || p > R.bal + L)) {
    H[e.id] = "failed";
    continue
   }
   const x = B ? {
    taint: {},
    pieces: []
   } : Y(R, p, e.match);
   let S = x.taint;
   C[e.id] && (S = {
    [C[e.id]]: p
   });
   const n = e.rail === "P2P" ? p / Rt : p,
    i = St(e);
   for (const c in S) T[c] && ((!C[e.id] || C[e.id] !== c) && N(f, c, -S[c], e.t), bt(e.to) ? (o[c][i] = (o[c][i] || 0) + S[c], (T[c][i] || (T[c][i] = [])).push([e.t, o[c][i]])) : N(b, c, S[c], e.t),
    S[c] >= 1 && $[c].push({
     tx: e.id,
     from: f,
     to: i,
     t: e.t,
     amt: p,
     amtOut: n,
     cur: e.cur,
     outCur: e.rail === "P2P" ? "USDT" : e.cur,
     taint: S[c],
     rail: e.rail,
     status: "done"
    }));
   if (!bt(b)) {
    const c = U(b),
     g = {};
    let w = !1;
    for (const E in S) S[E] > .001 && (g[E] = S[E], w = !0);
    c.lots.push({
     amt: n,
     t: e.t,
     taint: w ? g : null,
     src: e.id,
     inflow: !0
    }), c.bal += n
   }
   H[e.id] = "done", D[e.id] = {
    amt: p,
    out: n
   };
   const a = Pt(e.t) >= 23 || Pt(e.t) <= 4,
    h = e.cur === "INR" && (p >= 45e3 && p < 5e4 || p >= 9e3 && p < 1e4 || p >= 24e3 && p < 25e3);
   if (A[f]) {
    const c = j(f);
    c.outAmt += p, c.outN++, c.txN++, c.lastT = e.t, A[b] && A[b].role === "business" || c.receivers.add(e.to === "CASH" ? "CASH" : e.to), a && c.night++, h && c.below++;
    const g = A[b];
    g && g.opened < 90 && (c.outYoung += p), g && g.role === "p2p" && (c.outP2P += p), b === "CASH" && (c.outCash += p);
    let w = 0;
    for (const E of x.pieces)
     if (E.inflow) {
      const G = e.t - E.t;
      c.dwell.push([G, E.amt]), G <= 60 && (c.pt60 += E.amt, w += E.amt)
     } w > 5e3 && c.fastEvents++
   }
   if (A[b]) {
    const c = j(b);
    c.inAmt += n, c.inN++, c.txN++, c.lastT = e.t, A[f] && A[f].role === "business" || c.senders.add(f), c.firstIn == null && (c.firstIn = e.t), a && c.night++, h && c.below++
   }
  }
  const P = {};
  for (const e in k) P[e] = k[e].bal;
  return {
   status: H,
   exec: D,
   bal: P,
   tb: v,
   hist: T,
   sinkIn: o,
   edges: $,
   stats: y
  }
 }
 const lt = Math.log10,
  _ = [{
   k: "pass",
   label: "Pass-through (money in → out)",
   sign: 1
  }, {
   k: "fanOut",
   label: "Fan-out to individuals",
   sign: 1
  }, {
   k: "fanIn",
   label: "Fan-in from individuals",
   sign: 1
  }, {
   k: "age",
   label: "New account",
   sign: -1
  }, {
   k: "volInc",
   label: "Volume vs profile",
   sign: 1
  }, {
   k: "night",
   label: "Night-time activity",
   sign: 1
  }, {
   k: "below",
   label: "Just-below-limit amounts",
   sign: 1
  }, {
   k: "device",
   label: "Shared device",
   sign: 1
  }, {
   k: "young",
   label: "Money to new accounts",
   sign: 1
  }, {
   k: "p2p",
   label: "P2P crypto seller link",
   sign: 1
  }, {
   k: "cash",
   label: "ATM cash-out share",
   sign: 1
  }],
  Mt = 7 * 1440;

 function yt(r) {
  if (!r || !r.dwell || !r.dwell.length) return null;
  const t = r.dwell.slice().sort((s, m) => s[0] - m[0]),
   d = t.reduce((s, m) => s + m[1], 0);
  let u = 0;
  for (const [s, m] of t)
   if (u += m, u >= d / 2) return s;
  return t[t.length - 1][0]
 }

 function rt(r) {
  const t = {};
  for (const d of Object.values(r.accounts)) t[d.device] = (t[d.device] || 0) + 1;
  return t
 }

 function dt(r, t, d) {
  const u = t || {
    inAmt: 0,
    outAmt: 0,
    senders: new Set,
    receivers: new Set,
    night: 0,
    below: 0,
    pt60: 0,
    dwell: [],
    outYoung: 0,
    outP2P: 0,
    outCash: 0,
    txN: 0
   },
   s = yt(u),
   m = Math.max(r.income, 2e3) * 7 / 30;
  return {
   pass: u.inAmt > 5e3 ? .5 * Math.min(1, u.pt60 / u.inAmt) + .5 * Math.min(1, u.outAmt / u.inAmt) : 0,
   pt60: u.inAmt > 0 ? Math.min(1, u.pt60 / u.inAmt) : 0,
   dwell: lt(1 + Math.min(s ?? Mt, Mt)),
   flow: u.inAmt > 5e3 ? Math.min(1, u.outAmt / u.inAmt) : 0,
   fanOut: Math.log1p(u.receivers.size),
   fanIn: Math.log1p(u.senders.size),
   age: lt(1 + r.opened),
   volInc: Math.max(-2, Math.min(3, lt((u.inAmt + 1) / m))),
   night: u.txN ? u.night / u.txN : 0,
   below: Math.min(u.below, 5) / 5,
   device: Math.min((d[r.device] || 1) - 1, 4),
   young: u.outAmt ? u.outYoung / u.outAmt : 0,
   p2p: u.outAmt ? u.outP2P / u.outAmt : 0,
   cash: u.outAmt ? u.outCash / u.outAmt : 0
  }
 }
 const it = r => r.kind === "bank" && r.role !== "p2p" && r.role !== "victim",
  Yt = r => {
   let t = 0;
   for (let d = 0; d < r.length; d++) t = t * 31 + r.charCodeAt(d) >>> 0;
   return t % 10 >= 7
  },
  Q = r => 1 / (1 + Math.exp(-r));

 function wt(r, t) {
  const d = (typeof performance < "u" ? performance : Date).now(),
   u = rt(r),
   s = [];
  for (const y of Object.values(r.accounts)) it(y) && s.push({
   id: y.id,
   y: y.label,
   test: Yt(y.id),
   x: dt(y, t.stats[y.id], u)
  });
  const m = s.filter(y => !y.test),
   A = _.map(y => y.k),
   I = {},
   K = {};
  for (const y of A) {
   const U = m.map(Y => Y.x[y]),
    j = U.reduce((Y, X) => Y + X, 0) / U.length,
    N = Math.sqrt(U.reduce((Y, X) => Y + (X - j) ** 2, 0) / U.length) || 1;
   I[y] = j, K[y] = N
  }
  const C = m.map(y => A.map(U => (y.x[U] - I[U]) / K[U])),
   k = m.map(y => y.y),
   v = new Array(A.length).fill(0);
  let T = 0;
  const o = .4,
   $ = .002,
   H = C.length;
  for (let y = 0; y < 700; y++) {
   const U = new Array(A.length).fill(0);
   let j = 0;
   for (let N = 0; N < H; N++) {
    let Y = T;
    for (let P = 0; P < A.length; P++) Y += v[P] * C[N][P];
    const X = Q(Y) - k[N];
    j += X;
    for (let P = 0; P < A.length; P++) U[P] += X * C[N][P]
   }
   T -= o * j / H;
   for (let N = 0; N < A.length; N++) v[N] -= o * (U[N] / H + $ * v[N]), v[N] * _[N].sign < 0 && (v[N] = 0)
  }
  const D = (typeof performance < "u" ? performance : Date).now() - d;
  return {
   w: Object.fromEntries(A.map((y, U) => [y, v[U]])),
   b: T,
   mean: I,
   std: K,
   ms: D,
   trainN: m.length,
   testN: s.length - m.length,
   trainPos: m.filter(y => y.y).length,
   testPos: s.filter(y => y.test && y.y).length,
   testIds: new Set(s.filter(y => y.test).map(y => y.id))
  }
 }

 function Gt(r, t, d, u) {
  const s = d || {};
  switch (r) {
   case "pass":
    return u.pt60 >= .2 ? `${W(s.inAmt)} came in and ${q(u.flow)} moved on — ${q(u.pt60)} within 60 minutes` :
     `${W(s.inAmt)} came in and ${q(u.flow)} moved on; only ${q(Math.max(0,1-u.flow))} stayed`;
   case "dwell": {
    const m = yt(s);
    return m == null ? "Money never left the account" : `Money stayed a median of only ${$t(m)}`
   }
   case "fanOut":
    return `Sent money on to ${s.receivers?s.receivers.size:0} different individuals or cash points`;
   case "fanIn":
    return `Received money from ${s.senders?s.senders.size:0} different individuals or banks`;
   case "age":
    return `Account opened only ${t.opened} days ago`;
   case "volInc":
    return `${t.occ} profile, but ${W(s.inAmt)} flowed in this week (expected ~${W(Math.max(t.income,2e3)*7/30)})`;
   case "night":
    return `${q(u.night)} of transactions between 11 pm and 5 am`;
   case "below":
    return `${s.below} transfers just under common limits (₹49,xxx / ₹9,xxx)`;
   case "device":
    return `Same device as ${u.device} other account${u.device>1?"s":""}`;
   case "young":
    return `${q(u.young)} of outgoing money went to accounts opened < 90 days ago`;
   case "p2p":
    return `${W(s.outP2P)} paid to a P2P crypto seller`;
   case "cash":
    return `${q(u.cash)} of outgoing money withdrawn as ATM cash`;
   default:
    return r
  }
 }

 function Lt(r, t, d, u = {}) {
  const s = rt(r),
   m = _.map(C => C.k),
   A = {},
   I = {};
  for (const C of Object.values(r.accounts)) {
   if (!it(C)) continue;
   const k = dt(C, t.stats[C.id], s);
   I[C.id] = k;
   let v = d.b;
   for (const T of m) v += d.w[T] * ((k[T] - d.mean[T]) / d.std[T]);
   A[C.id] = v
  }
  const K = {};
  for (const C of Object.values(r.accounts)) {
   if (!it(C)) continue;
   const k = t.stats[C.id],
    v = I[C.id],
    T = m.map(P => ({
     k: P,
     label: _.find(e => e.k === P).label,
     phi: d.w[P] * ((v[P] - d.mean[P]) / d.std[P]),
     value: v[P]
    })),
    o = [],
    $ = u.traced && u.traced[C.id];
   if ($ && C.role !== "victim") {
    const P = Object.values($).reduce((e, f) => e + f, 0);
    P >= 1e3 && o.push({
     k: "traced",
     label: "Complaint money traced in",
     phi: 1.6,
     text: `Received ${W(P)} traced from complaint ${Object.keys($).join(", ")}`
    })
   }
   if (k) {
    let P = 0;
    for (const e of new Set([...k.senders, ...k.receivers])) A[e] != null && e !== C.id && Q(A[e]) >= .85 && P++;
    P && o.push({
     k: "linked",
     label: "Linked high-risk accounts",
     phi: Math.min(2, P) * .45,
     text: `Transacts directly with ${P} high-risk account${P>1?"s":""}`
    })
   }
   const H = [...T, ...o],
    D = H.reduce((P, e) => P + e.phi, 0),
    y = d.b + D,
    U = 100 * Q(d.b),
    j = Math.min(99, 100 * Q(y)),
    N = Math.abs(D) > 1e-6 ? (j - U) / D : 100 * Q(d.b) * (1 - Q(d.b));
   for (const P of H) P.pts = P.phi * N;
   const Y = H.slice().sort((P, e) => e.pts - P.pts);
   for (const P of T) P.text = Gt(P.k, C, k, v);
   const X = Y.filter(P => P.pts > 1.5).slice(0, 3).map(P => P.text);
   K[C.id] = {
    score: j,
    base: U,
    contribs: Y,
    reasons: X,
    x: v
   }
  }
  return K
 }

 function Ot(r, t, d, u) {
  let s = 0,
   m = 0,
   A = 0,
   I = 0;
  const K = [],
   C = [...d.testIds];
  for (const T of C) {
   const o = r.accounts[T].label,
    $ = t[T].score >= u;
   $ && o ? s++ : $ && !o ? m++ : !$ && o ? A++ : I++
  }
  for (let T = 10; T <= 95; T += 5) {
   let o = 0,
    $ = 0,
    H = 0;
   for (const D of C) {
    const y = r.accounts[D].label,
     U = t[D].score >= T;
    U && y ? o++ : U && !y ? $++ : !U && y && H++
   }
   K.push({
    t: T,
    precision: o + $ ? o / (o + $) : 1,
    recall: o + H ? o / (o + H) : 0
   })
  }
  const k = s + m ? s / (s + m) : 1,
   v = s + A ? s / (s + A) : 0;
  return {
   tp: s,
   fp: m,
   fn: A,
   tn: I,
   precision: k,
   recall: v,
   f1: k + v ? 2 * k * v / (k + v) : 0,
   falsePer1000: m / Math.max(1, m + I) * 1e3,
   curve: K,
   n: C.length
  }
 }
 const Z = () => (typeof performance < "u" ? performance : Date).now(),
  At = r => 1 / (1 + Math.exp(-r)),
  tt = _.map(r => r.k);

 function Xt(r, t, d) {
  const u = rt(r);
  return Object.values(r.accounts).filter(it).map(s => ({
   id: s.id,
   y: s.label,
   test: d.testIds.has(s.id),
   x: tt.map(m => dt(s, t.stats[s.id], u)[m])
  }))
 }

 function zt(r, t, d, {
  rounds: u = 120,
  depth: s = 3,
  lr: m = .15,
  bins: A = 24,
  lambda: I = 1
 } = {}) {
  const K = Z(),
   C = Xt(r, t, d),
   k = C.filter(e => !e.test),
   v = C.filter(e => e.test),
   T = tt.map((e, f) => {
    const b = k.map(M => M.x[f]).sort((M, p) => M - p),
     B = [];
    for (let M = 1; M < A; M++) B.push(b[Math.floor(M * b.length / A)]);
    return [...new Set(B)]
   }),
   o = Math.log((k.filter(e => e.y).length + 1) / (k.filter(e => !e.y).length + 1)),
   $ = k.map(() => o),
   H = [],
   D = (e, f, b, B) => {
    const M = e.reduce((a, h) => a + f[h], 0),
     p = e.reduce((a, h) => a + b[h], 0),
     R = {
      v: -M / (p + I)
     };
    if (B === 0 || e.length < 8) return R;
    let x = null;
    const S = M * M / (p + I);
    for (let a = 0; a < tt.length; a++)
     for (const h of T[a]) {
      let c = 0,
       g = 0,
       w = 0;
      for (const F of e) k[F].x[a] <= h && (c += f[F], g += b[F], w++);
      if (w < 3 || w > e.length - 3) continue;
      const E = M - c,
       G = p - g,
       z = c * c / (g + I) + E * E / (G + I) - S;
      (!x || z > x.gain) && (x = {
       gain: z,
       j: a,
       c: h
      })
     }
    if (!x || x.gain < .001) return R;
    const n = e.filter(a => k[a].x[x.j] <= x.c),
     i = e.filter(a => k[a].x[x.j] > x.c);
    return {
     j: x.j,
     c: x.c,
     l: D(n, f, b, B - 1),
     r: D(i, f, b, B - 1)
    }
   },
   y = (e, f) => e.j == null ? e.v : y(f[e.j] <= e.c ? e.l : e.r, f),
   U = k.map((e, f) => f);
  for (let e = 0; e < u; e++) {
   const f = $.map(At),
    b = f.map((p, R) => p - k[R].y),
    B = f.map(p => Math.max(1e-6, p * (1 - p))),
    M = D(U, b, B, s);
   H.push(M);
   for (let p = 0; p < k.length; p++) $[p] += m * y(M, k[p].x)
  }
  const j = Z() - K,
   N = e => 100 * At(o + m * H.reduce((f, b) => f + y(b, e), 0)),
   Y = e => {
    let f = 0,
     b = 0,
     B = 0,
     M = 0;
    for (const p of v) {
     const R = N(p.x) >= e;
     R && p.y ? f++ : R ? b++ : p.y ? B++ : M++
    }
    return {
     tp: f,
     fp: b,
     fn: B,
     tn: M,
     precision: f + b ? f / (f + b) : 1,
     recall: f + B ? f / (f + B) : 0,
     falsePer1000: b / Math.max(1, b + M) * 1e3
    }
   },
   X = tt.map(() => 0),
   P = e => {
    e.j != null && (X[e.j]++, P(e.l), P(e.r))
   };
  return H.forEach(P), {
   ms: j,
   rounds: u,
   depth: s,
   metrics: Y,
   importance: tt.map((e, f) => ({
    k: e,
    n: X[f]
   }))
  }
 }

 function Jt(r, t) {
  const d = Z(),
   u = gt(r),
   s = st(u, {
    clock: ht,
    cases: []
   }),
   m = wt(u, s),
   A = Lt(u, s, m, {}),
   I = Ot(u, A, m, t);
  return {
   seed: r,
   precision: I.precision,
   recall: I.recall,
   falsePer1000: I.falsePer1000,
   accounts: Object.keys(u.accounts).length,
   txns: u.txns.length,
   ms: Z() - d
  }
 }

 function Vt(r) {
  const t = pt(r),
   d = Math.max(100, Math.floor(r / 12)),
   u = {};
  for (let T = 0; T < d; T++) u[`S${T}`] = {
   id: `S${T}`,
   kind: "bank",
   role: "normal",
   open0: 5e4,
   opened: 400,
   income: 3e4,
   device: `d${T}`
  };
  const s = Z(),
   m = new Array(r);
  let A = 0;
  for (let T = 0; T < r; T++) A += t.next() * .6, m[T] = {
   id: `X${T}`,
   t: Math.floor(A),
   from: `S${Math.floor(t.next()*d)}`,
   to: `S${Math.floor(t.next()*d)}`,
   amt: Math.round(t.logu(50, 2e4)),
   cur: "INR",
   rail: "UPI"
  };
  const I = Z() - s,
   K = m.slice(0, 20).map(T => T.id),
   C = Z(),
   k = st({
    accounts: u,
    wallets: {},
    txns: m
   }, {
    clock: A + 1,
    cases: [{
     id: "BENCH",
     taintTx: K
    }]
   }),
   v = Z() - C;
  return {
   n: r,
   accounts: d,
   genMs: I,
   simMs: v,
   perSec: r / (v / 1e3),
   hops: k.edges.BENCH.length
  }
 }
 self.onmessage = r => {
  const t = r.data || {};
  try {
   if (t.kind === "gbdt") {
    const d = gt(),
     u = st(d, {
      clock: ht,
      cases: []
     }),
     s = wt(d, u),
     m = zt(d, u, s),
     A = t.thr || 70;
    self.postMessage({
     kind: "gbdt",
     ms: m.ms,
     at: m.metrics(A),
     curve: [50, 60, 70, 80, 90].map(I => ({
      t: I,
      ...m.metrics(I)
     })),
     importance: m.importance
    })
   } else if (t.kind === "robust") {
    for (const d of t.seeds) self.postMessage({
     kind: "robust",
     row: Jt(d, t.thr || 70)
    });
    self.postMessage({
     kind: "robust-done"
    })
   } else t.kind === "scale" && self.postMessage({
    kind: "scale",
    row: Vt(t.n)
   })
  } catch (d) {
   self.postMessage({
    kind: "error",
    message: String(d && d.message ? d.message : d)
   })
  }
 }
})();