## Priya — Test Run-Through

### Profile (from brief)

| Field | Value |

|---|---|
| Age | 29 |
| Location | Bengaluru |
| Income type | Salaried, software engineer, large MNC, 5 years |
| Net income | ₹1,10,000/month |
| Existing EMI | ₹14,000 (car loan, 2 years left) |
| Household rent | ₹28,000/month |
| Credit score | 780 |
| Requested amount | ₹8,00,000 |
| Purpose | Wedding |
| Product | Personal Loan |

### Inputs used in this test run

- Total existing monthly EMI: ₹14,000
- Household expenses: ₹28,000
- Employment tenure: 5 years
- Missed/bounced EMI: No
- Credit score known: Yes — 780
- Emergency savings: Skip (not stated)
- Upcoming major expense: Skip / No

### App outputs (this run)

| Output | Result |

|---|---|
| O1 — Verdict | **BORROW LESS** |
| O2 — Safe amount | ₹5,57,899 |
| O2 — Likely lender sanction | ₹5,30,004 |
| O3 — Fair rate | 11.5% – 16% |
| O3 — Estimated APR | 15.18% |
| O4 — Safe monthly EMI | ₹19,000 |
| O4 — Requested EMI (at ₹8,00,000) | ₹27,245 |
| Confidence | 40% |

### Financial snapshot as computed by the app

| Field | Value |

|---|---|
| Usable monthly income | ₹1,10,000 |
| Monthly expenses | ₹28,000 |
| Existing EMI | ₹14,000 |
| Disposable income | ₹68,000 |

✅ **No zero-defaulting bug here** — unlike Ravi and Anita, all three financial inputs (income, expenses, existing EMI) came through correctly and match the stated profile exactly. This is a good sanity-check reference run: use it to confirm your fix for the Ravi/Anita bug doesn't break this correctly-working case.

### Borrowing cost

| Field | Value |

|---|---|
| Monthly EMI | ₹27,245 |
| Estimated APR | 15.18% |
| Processing fee | ₹16,000 |
| Total interest | ₹1,80,822 |
| Net amount received | ₹7,84,000 |

### Income stress test

| Scenario | Stressed income | Result | EMI ratio |

|---|---|---|---|
| Income drops 10% | ₹99,000 | Affordable | 27.52% |
| Income drops 20% | ₹88,000 | **Not safe** | 30.96% |
| Income drops 30% | ₹77,000 | **Not safe** | 35.38% |

### Why this recommendation (app's stated reasons)

- Credit score (780) indicates relatively strong repayment history
- Income appears relatively stable
- Requested amount/EMI exceeds the calculated safe limit
- Proposed EMI fails affordability in 2 of 3 stress scenarios (20% and 30% income drop)

### Sense-check against the earlier manual estimate

This matches the direction of the manual walkthrough we did earlier — lender sanction (₹5,30,004) and safe amount (₹5,57,899) are close to each other but **both are well below her ₹8,00,000 request**, confirming the "lender says yes, but it's not actually safe for her" gap the brief wants surfaced. Good result to hold up as your primary "domain reasoning" example in the walkthrough.

### ⚠ One inconsistency worth double-checking

Safe amount (₹5,57,899) is slightly **higher** than likely lender sanction (₹5,30,004) — worth confirming this is intentional. Normally you'd expect "safe" (borrower-conservative) ≤ "lender sanction" (lender-generous), since lenders often approve more than is truly safe to carry. Here it's basically reversed by a small margin. Not necessarily wrong, but be ready to explain the rule that produces this ordering in the live follow-up — this is exactly the kind of "why is this number what it is" question the brief says they'll probe.

### Negotiation Card

- Lender may quote around 14%+ on an unsecured personal loan
- Fair rate for Priya's profile: **11.5% – 16%**, all-in APR ~15.18%
- Recommended ask: reduce loan to **~₹5,57,899** (safe amount) rather than the full ₹8,00,000, or extend tenure to bring EMI down to the ₹19,000 safe ceiling
- Key negotiating point: strong credit score (780) and stable 5-year tenure support the lower end of the rate band — she shouldn't accept a rate near the top of range (16%) given her profile strength