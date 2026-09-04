## Ravi — Test Run-Through (Run 2)

### Profile (from brief)

| Field | Value |

|---|---|
| Age | 42 |
| Location | Mysuru |
| Income type | Self-employed (kirana store, 14 years) |
| Income | ₹40,000–80,000/month cash; ITR ₹4,20,000/year (~₹35,000/month) |
| Collateral | Shop premises, ~₹45,00,000, unencumbered |
| Existing EMI | ₹0 (no formal loan history) |
| Credit score | None / unknown |
| Co-applicant | Wife, ₹18,000/month |
| Requested amount | ₹15,00,000 |
| Purpose | Second stock line + delivery vehicle |

### Inputs used in this test run

| Question | Answer |

|---|---|
| Average monthly net income | ₹60,000 (midpoint of cash range) |
| Total existing monthly EMI | ₹0 |
| Household expenses | Skip |
| Credit score known | No |
| Missed/bounced EMI | No / N/A |
| ITR annual income | ₹4,20,000 |
| Collateral value | ₹45,00,000 |
| Emergency savings | Skip |
| Upcoming major expense | Skip / No |

### App outputs (this run)

| Output | Result |

|---|---|
| O1 — Verdict | **DO NOT BORROW** |
| O2 — Safe amount | ₹0 |
| O2 — Likely lender sanction | ₹0 |
| O3 — Fair rate | 11.25% – 17% |
| O3 — Estimated APR | 15.24% |
| O4 — Safe monthly EMI | ₹0 |
| O4 — Requested EMI (at ₹15,00,000) | ₹41,088 |
| Confidence | 20% |

### Financial snapshot as computed by the app

| Field | Value |

|---|---|
| Usable monthly income | ₹35,000 |
| Monthly expenses | ₹0 |
| Existing EMI | **₹60,000** |
| Disposable income | -₹25,000 |

### ⚠ Two bugs in this run — worse than the first attempt

**1. Existing EMI shows ₹60,000, but the correct value is ₹0.**
Ravi has never taken a formal loan (stated directly in the PDF). ₹60,000 isn't just wrong, it's suspicious — it exactly matches the *income* figure you entered in the earlier run. This strongly suggests a field-mapping bug: the income value from a previous session/field is bleeding into the "Existing EMI" field, or there's a stale-state issue between runs. This single error alone explains the "DO NOT BORROW" verdict — treating ₹60,000 of *phantom* existing EMI as a real obligation would sink almost any affordability calculation.

**2. Usable monthly income shows ₹35,000, not ₹60,000.**
This is actually closer to correct than the first run's ₹2,917, but it looks like the app used the **ITR figure** (₹4,20,000/year ÷ 12 = ₹35,000) rather than the ₹60,000 cash-income midpoint you entered. That's a real design decision worth making deliberately (documented income vs. actual cash income), not an accident — but right now it's unclear whether your app chose ₹35,000 on purpose or defaulted to it because the ₹60,000 field wasn't read correctly. Check which one it's actually pulling from.

**3. Monthly expenses = ₹0** despite being skipped/unknown — same unknown-treated-as-zero issue flagged in the previous runs. Per the brief's rule, this should never silently become 0.

### Why the two runs disagree

| Field | Run 1 | Run 2 |

|---|---|---|
| Usable income | ₹2,917 | ₹35,000 |
| Existing EMI | ₹0 (correct) | ₹60,000 (wrong) |
| Disposable income | -₹17,083 | -₹25,000 |

Both runs land on DO NOT BORROW / ₹0 safe amount, but for **two different broken reasons** — this is a strong signal there's a real state-management or field-binding bug in your app (values crossing between fields or sessions), not just a one-off calculation error. Worth debugging this directly rather than continuing to test until the underlying input-handling is fixed — every run right now is unreliable regardless of which number looks "more plausible."
