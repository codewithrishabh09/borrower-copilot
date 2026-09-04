# /Lokta_Borrower_Copilot/anita.md

## Anita — Test Run-Through

### Profile (from brief)

| Field | Value |

|---|---|
| Age | 35 |
| Location | Hubballi |
| Income type | Informal (delivery-platform rider + home tailoring) |
| Income | ₹26,000–30,000/month |
| Household | Two children; husband unemployed 8 months |
| Existing debt | ₹35,000 outstanding across 3 app loans, 30%+ interest |
| Credit history | One EMI bounced last month |
| Requested amount | ₹1,50,000 |
| Purpose | Electric scooter (to increase delivery capacity) |

### Inputs used in this test run

- Lowest typical monthly income: ₹26,000
- Highest typical monthly income: ₹30,000
- Total existing EMI: Skip (not stated in PDF — only ₹35,000 outstanding balance given, no installment figure)
- Household expenses: Skip (not stated)
- Credit score known: Skip / No (not stated, no bureau history mentioned)
- Missed/bounced EMI: **Yes** (explicitly stated — one bounce last month)
- Emergency savings (months): Skip (not stated)
- Upcoming major expense (12 months): Skip / Yes-leaning (not stated, but household context — unemployed spouse — argues against a clean "No")

### App outputs (this run)

| Output | Result |

|---|---|
| O1 — Verdict | **BORROW LESS** |
| O2 — Safe amount | ₹2,93,201 |
| O2 — Likely lender sanction | ₹1,61,261 |
| O3 — Fair rate | 11% – 19% |
| O3 — Estimated APR | 15.83% |
| O4 — Safe monthly EMI | ₹8,160 |
| O4 — Requested EMI (at ₹1,50,000) | ₹4,175 |
| Confidence | 28% |

### Financial snapshot as computed by the app

| Field | Value |

|---|---|
| Usable monthly income | ₹27,200 |
| Monthly expenses | ₹0 |
| Existing EMI | ₹0 |
| Disposable income | ₹27,200 |

### Borrowing cost

| Field | Value |

|---|---|
| Monthly EMI | ₹4,175 |
| Estimated APR | 15.83% |
| Processing fee | ₹2,250 |
| Total interest | ₹50,381 |
| Net amount received | ₹1,47,750 |

### Income stress test

| Scenario | Stressed income | Result | EMI ratio |

|---|---|---|---|
| Income drops 10% | ₹24,480 | Affordable | 17.05% |
| Income drops 20% | ₹21,760 | Affordable | 19.19% |
| Income drops 30% | ₹19,040 | Affordable | 21.93% |

### Why this recommendation (app's stated reasons)

- Credit score information was unavailable → lower confidence
- A recent missed payment can increase repayment risk and affect pricing
- Income appears variable → conservative risk approach used
- Requested loan is above the calculated affordability limit → recommends reducing toward ₹2,93,201
