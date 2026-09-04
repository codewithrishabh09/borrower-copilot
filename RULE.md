# 🏦 Borrower Copilot — RULES.md

**Version:** 1.0
**Challenge:** Lokta Build Challenge — Borrower Copilot
**Purpose:** Educational borrower self-assessment for Indian borrowers
**Currency:** Indian Rupees (₹)

---

# 1. Product Purpose

Borrower Copilot is an educational financial self-assessment tool.

It helps a borrower answer four questions before approaching a lender:

1. **Should I borrow at all?**
2. **How much can I safely borrow compared with how much a lender may sanction?**
3. **What is a fair estimated interest-rate range for my profile?**
4. **What monthly EMI should I avoid exceeding?**

The application also generates a Negotiation Card that helps the borrower compare a lender's offer against the application's estimates.

Borrower Copilot prioritises:

> **Financial affordability over maximum borrowing availability.**

---

# 2. Product Safety Boundaries

Borrower Copilot is:

* An educational affordability assessment.
* Based entirely on user-provided information.
* A transparent rule-based estimation tool.
* A borrowing comparison and negotiation aid.

Borrower Copilot is not:

* A bank.
* A lender.
* A loan approval system.
* A credit bureau.
* A guaranteed interest-rate calculator.
* A guaranteed lender eligibility model.
* Professional financial advice.

All calculations are estimates.

The application does not independently verify:

* Income.
* Employment.
* Business revenue.
* Credit score.
* Collateral ownership.
* Existing debt.
* Loan offers.

---

# 3. Core Principle: Safe Borrowing and Lender Eligibility Are Different

Borrower Copilot calculates two separate concepts.

## 3.1 Safe Borrowing Capacity

The amount that appears financially manageable according to the application's affordability rules.

This is the amount the borrower should prioritise.

## 3.2 Likely Lender Sanction Range

An estimate of the borrowing amount that a lender might consider based on the available profile information.

This is not a lender decision.

The two values may differ.

A lender may be willing to sanction more than is financially safe.

A lender may also sanction less than the application's estimated safe amount.

### Borrower Copilot rule

> **The borrower should use the Safe Borrowing Amount as the primary financial limit.**

---

# 4. Assessment Outputs

The application produces four primary outputs.

| Output | Description                                            |
| ------ | ------------------------------------------------------ |
| O1     | BORROW / BORROW_LESS / DO_NOT_BORROW                   |
| O2     | Safe Borrowing Amount and Likely Lender Sanction Range |
| O3     | Fair Interest-Rate Range and Estimated APR             |
| O4     | Safe Monthly EMI Ceiling and tenure trade-off          |

The application also produces:

* Reasons for the recommendation.
* Financial risk signals.
* Income stress-test results.
* Assessment confidence.
* Suggested actions.
* Negotiation Card.

---

# 5. Minimum Assessment Inputs

The application requires a small set of core inputs before generating the four primary outputs.

These inputs are collected through an adaptive flow rather than a fixed questionnaire.

The core information required is:

• Borrowing purpose
• Requested amount
• Desired tenure
• Suggested or selected loan product
• Net monthly income or income range
• Income type
• Household expenses
• Existing monthly EMI
• Credit score, if known
• Recent repayment difficulty, if applicable

If some non-essential information is unknown, the application must still continue.

Missing information:

• Does not become zero.
• Does not automatically become a negative signal.
• Widens estimated ranges.
• Reduces assessment confidence.
However:

> **Missing information widens uncertainty and may reduce assessment confidence.**

Unknown information is never converted to zero.

---

# 6. Adaptive Additional Questions

Additional questions are asked only when they can change at least one output.

## 6.1 Salaried Borrowers

Additional questions may include:

* Employment duration.
* Employer stability.
* Variable-income share.
* Upcoming large expenses.
* Emergency savings.

## 6.2 Self-Employed Borrowers

Additional questions may include:

* Business age.
* Average income range.
* Income documented through ITR or records.
* Collateral availability.
* Collateral value.
* Business purpose of borrowing.

## 6.3 Informal or Variable-Income Borrowers

Additional questions may include:

* Income range.
* Income variability.
* Number of dependants.
* Existing high-cost loans.
* Recent repayment problems.
* Emergency savings.

---

# 7. Question-to-Output Impact Matrix

Every additional question must affect at least one calculation or output.

| Question                | Calculation Affected        | Output               |
| ----------------------- | --------------------------- | -------------------- |
| Employment history      | Income reliability          | O1, O2, O4           |
| Business history        | Income reliability          | O1, O2, O3           |
| Income variability      | Usable income               | O1, O2, O4           |
| Emergency savings       | Financial safety adjustment | O1, O4               |
| Collateral              | Product routing             | O2, O3               |
| Collateral value        | Secured borrowing estimate  | O2                   |
| Co-applicant income     | Lender estimate             | O2                   |
| Missed payment          | Risk signal                 | O1, O2, O3           |
| Existing high-cost debt | Risk and affordability      | O1, O2, O4           |
| Upcoming large expense  | Disposable income           | O1, O4               |
| Existing lender offer   | Negotiation comparison      | O3, Negotiation Card |

Questions that do not affect an output should not be included.

---

# 8. Loan Product Routing

The borrower first selects a loan purpose.

The application may additionally suggest an alternative borrowing path when the profile supports one.

## Supported Products

| Product                | Typical Purpose                                     |
| ---------------------- | --------------------------------------------------- |
| Personal Loan          | Personal expenses                                   |
| Business Loan          | Business working capital or expansion               |
| Secured Business / LAP | Business borrowing supported by property collateral |
| Vehicle Loan           | Vehicle purchase                                    |
| Two-Wheeler Loan       | Motorcycle or scooter purchase                      |
| Home Loan              | Residential property                                |
| Education Loan         | Education                                           |
| Gold-backed Borrowing  | Borrowing against available gold                    |
| Other                  | Other borrowing purpose                             |

---

# 9. Product Routing Rules

## Business + Valuable Unencumbered Collateral

If:

* Loan purpose is Business, and
* Collateral is available, and
* Collateral is reported as unencumbered,

then the application compares:

> Business Loan vs Secured Business / LAP.

The application does not assume that secured borrowing is always better.

It presents secured borrowing as a possible comparison option.

## Vehicle Purchase

If the purpose is purchasing a vehicle, the application suggests:

* Vehicle-specific financing.
* Secured financing where appropriate.

## Small Vehicle or Scooter

If the purpose is purchasing a scooter or motorcycle, the application suggests:

* Two-Wheeler financing.

---

# 10. Income Reliability

Income reliability affects how much reported income is considered usable.

## Reliability Levels

### 🟢 HIGH

Examples:

* Salaried income.
* Employment history of at least 24 months.
* Low income variability.

### 🟡 MEDIUM

Examples:

* Salaried employment with shorter history.
* Self-employment with established history.
* Moderate income variability.

### 🔴 LOW

Examples:

* Informal income.
* High income variability.
* Limited employment history.
* Limited business history.

---

# 11. Usable Monthly Income

The application does not always use 100% of reported income.

## Income Reliability Adjustment

| Reliability | Usable Income Percentage |
| ----------- | -----------------------: |
| High        |                      90% |
| Medium      |                      75% |
| Low         |                      60% |

### Formula

```text
Usable Monthly Income
=
Reported Monthly Income
×
Income Reliability Factor
```

For variable income, the borrower should provide an average or range.

Where a range is available:

```text
Usable Income Base
=
Lower Income Bound
+
50% × (Upper Income Bound − Lower Income Bound)
```

The reliability factor is then applied.

This avoids assuming that the borrower's highest income period will continue indefinitely.

---

# 12. Disposable Income

```text
Disposable Income
=
Usable Monthly Income
−
Monthly Household Expenses
−
Existing Monthly EMI
```

Disposable Income represents the remaining estimated monthly capacity before a new loan.

If Disposable Income is less than or equal to zero:

> The Safe New EMI is zero.

---

# 13. Safe Monthly EMI

Borrower Copilot calculates a maximum recommended new EMI.

## Safety Factors

| Income Reliability | Safe New EMI Percentage of Disposable Income |
| ------------------ | -------------------------------------------: |
| High               |                                          50% |
| Medium             |                                          40% |
| Low                |                                          30% |

### Formula

```text
Safe Monthly EMI
=
max(
    0,
    Disposable Income × Safety Factor
)
```

This means the application intentionally leaves part of disposable income uncommitted.

The remaining amount provides room for:

* Unexpected expenses.
* Income fluctuations.
* Household needs.
* Financial uncertainty.

---

# 14. Emergency Savings Adjustment

If the borrower reports emergency savings, the Safe EMI may be adjusted.

Emergency savings are expressed in months of current household expenses.

| Savings Buffer     | Safe EMI Adjustment |
| ------------------ | ------------------: |
| Less than 1 month  |                −10% |
| 1–3 months         |       No adjustment |
| More than 3 months |         No increase |

The application does not increase borrowing capacity simply because the borrower has savings.

Savings can reduce the assessment when the financial buffer is extremely low, but do not increase the Safe EMI above the base calculation.

---

# 15. Existing EMI Pressure

Existing EMI obligations are already included in Disposable Income.

The application also identifies elevated repayment pressure.

```text
Existing EMI Ratio
=
Existing EMI
÷
Usable Monthly Income
```

| Existing EMI Ratio | Signal            |
| ------------------ | ----------------- |
| ≤ 20%              | Low pressure      |
| >20% and ≤35%      | Moderate pressure |
| >35%               | High pressure     |

High existing repayment pressure becomes an additional risk signal.

---

# 16. Requested Loan EMI

Monthly EMI is calculated using the standard amortising loan formula.

```text
EMI
=
P × r × (1 + r)^n
÷
((1 + r)^n − 1)
```

Where:

```text
P = Principal loan amount
r = Monthly interest rate
n = Number of monthly payments
```

For example:

```text
Monthly Rate
=
Annual Interest Rate
÷
12
÷
100
```

The application calculates EMI using the midpoint of the estimated fair interest-rate range.

---

# 17. Requested EMI Affordability Ratio

```text
Requested EMI Ratio
=
Requested EMI
÷
Safe Monthly EMI
```

If Safe Monthly EMI is zero, the ratio is treated as unaffordable.

| Ratio           | Interpretation       |
| --------------- | -------------------- |
| ≤ 1.00          | Within safe ceiling  |
| >1.00 and ≤1.25 | Moderate pressure    |
| >1.25           | Significant pressure |

---

# 18. Affordable Loan Amount

The Affordable Loan Amount is calculated by reversing the EMI formula.

The application uses:

* Safe Monthly EMI.
* Estimated midpoint interest rate.
* Selected tenure.

### Formula

```text
Affordable Principal
=
EMI ×
((1 + r)^n − 1)
÷
(r × (1 + r)^n)
```

Where:

```text
EMI = Safe Monthly EMI
r = Monthly estimated interest rate
n = Number of monthly payments
```

The Affordable Loan Amount is a financial safety estimate.

It is not a loan approval.

---

# 19. Fair Interest-Rate Range

Borrower Copilot estimates a range rather than a single rate.

The final range is based on:

```text
Base Product Range
+
Profile Adjustments
+
Uncertainty Widening
```

---

# 20. Base Product Rate Assumptions

These are educational assumptions for the challenge.

They are not guaranteed lender offers.

| Product                | Base Estimated Annual Rate Range | Processing Fee Assumption |
| ---------------------- | -------------------------------- | ------------------------: |
| Personal Loan          | 11%–18%                          |                      2.0% |
| Business Loan          | 12%–20%                          |                      2.0% |
| Secured Business / LAP | 9%–14%                           |                      1.5% |
| Vehicle Loan           | 8%–13%                           |                      1.0% |
| Two-Wheeler Loan       | 10%–18%                          |                      1.5% |
| Home Loan              | 8%–11%                           |                      0.5% |
| Education Loan         | 9%–14%                           |                      1.0% |
| Gold-backed Borrowing  | 9%–16%                           |                      1.0% |

---

# 21. Credit Profile Adjustments

## Known Credit Score

| Credit Score | Rate Adjustment        |
| ------------ | ---------------------- |
| ≥ 750        | −1.0 percentage point  |
| 700–749      | −0.5 percentage point  |
| 650–699      | +0.5 percentage point  |
| <650         | +2.0 percentage points |

The adjustment is applied to both ends of the base range.

## Unknown Credit Score

Unknown credit is not treated as poor credit.

Instead:

```text
Rate Range Width
=
Base Range Width
+
2 percentage points
```

The midpoint is not automatically increased unless other risk signals justify an adjustment.

Assessment confidence is reduced.

---

# 22. Additional Interest-Rate Adjustments

| Condition                | Adjustment                                 |
| ------------------------ | ------------------------------------------ |
| Recent missed payment    | +1.5 percentage points                     |
| Low income reliability   | +1.0 percentage point                      |
| High income reliability  | −0.5 percentage point                      |
| Secured collateral route | Product routing to secured product range   |
| Informal income          | +0.5 percentage point uncertainty widening |

The final rate range must remain within reasonable product bounds.

The application does not claim to reproduce actual lender pricing.

---

# 23. Interest-Rate Range Clamping

The final estimated rate is restricted to the following challenge-wide boundaries:

```text
Minimum Estimated Rate = 7%
Maximum Estimated Rate = 24%
```

If rule adjustments exceed these limits, the result is capped.

---

# 24. Likely Lender Sanction Range

The application estimates a possible lender capacity separately from safe affordability.

The estimate is deliberately presented as a range.

The base estimate is derived from:

```text
Affordable Loan Amount
×
Eligibility Multiplier
```

## Eligibility Multipliers

| Profile Signal  | Multiplier |
| --------------- | ---------: |
| Strong profile  |  1.10–1.30 |
| Neutral profile |  0.80–1.10 |
| Elevated risk   |  0.40–0.80 |

The classification considers:

* Credit information.
* Missed payments.
* Income type.
* Employment or business history.
* Collateral.
* Co-applicant availability.

The final range is:

```text
Likely Sanction Minimum
=
Affordable Loan Amount
×
Minimum Multiplier

Likely Sanction Maximum
=
Affordable Loan Amount
×
Maximum Multiplier
```

Collateral may additionally support a secured borrowing route.

The application must never present this range as an actual lender decision.

---

# 25. Collateral Routing

Collateral is not automatically added as cash to the borrower's safe affordability.

Collateral may affect:

* Product routing.
* Estimated interest-rate range.
* Likely lender sanction range.

Safe borrowing remains primarily based on repayment capacity.

This prevents a borrower from borrowing an unsafe amount simply because valuable collateral exists.

---

# 26. Co-Applicant Rules

A co-applicant is optional.

The application may ask for co-applicant information when the borrower indicates that one is available.

The co-applicant can affect:

* Likely lender sanction estimate.
* Eligibility confidence.

The co-applicant does not automatically increase the Safe Monthly EMI unless the household financial model explicitly includes the co-applicant's income.

If included, the application must clearly show that household income was adjusted.

---

# 27. APR and All-In Borrowing Cost

The application calculates:

* Monthly EMI.
* Processing fee.
* Net disbursed amount.
* Total repayment.
* Total interest.
* Estimated APR.

## Processing Fee

```text
Processing Fee
=
Loan Principal
×
Processing Fee Percentage
```

## Net Disbursed Amount

```text
Net Disbursed Amount
=
Loan Principal
−
Processing Fee
```

## Total Repayment

```text
Total Repayment
=
Monthly EMI
×
Number of Payments
```

## Total Interest

```text
Total Interest
=
Total Repayment
−
Loan Principal
```

Estimated APR is calculated using the loan cash flows:

```text
Month 0:
+ Net Disbursed Amount

Months 1 to n:
− Monthly EMI
```

The periodic internal rate of return is annualised:

```text
Estimated APR
=
Monthly IRR × 12
```

The APR is displayed as an estimate.

---

# 28. Income Stress Testing

Borrower Copilot tests whether the requested EMI remains manageable when income falls.

## Required Stress Scenarios

| Scenario | Income Reduction |
| -------- | ---------------: |
| Mild     |              10% |
| Moderate |              20% |
| Severe   |              30% |

### Formula

```text
Stressed Usable Income
=
Usable Monthly Income
×
(1 − Stress Percentage)
```

For each scenario:

```text
Stressed Disposable Income
=
Stressed Usable Income
−
Monthly Household Expenses
−
Existing EMI
```

Then:

```text
Stressed Safe EMI
=
Stressed Disposable Income
×
Safety Factor
```

If Stressed Disposable Income is negative, Stressed Safe EMI is zero.

---

# 29. Stress-Test Failure Rules

| Scenario                                 | Result              |
| ---------------------------------------- | ------------------- |
| Requested EMI ≤ Mild Stress Safe EMI     | Pass                |
| Requested EMI > Mild Stress Safe EMI     | Mild failure        |
| Requested EMI > Moderate Stress Safe EMI | Significant failure |
| Requested EMI > Severe Stress Safe EMI   | Severe failure      |

A moderate or severe failure influences the verdict.

---

# 30. Rule-Based Risk Signals

Borrower Copilot uses transparent risk signals rather than an opaque machine-learning score.

## Low-Risk Signals

Examples:

* Requested EMI within Safe EMI.
* High income reliability.
* Strong known credit profile.
* Stress tests manageable.
* Low existing EMI pressure.

## Moderate-Risk Signals

Examples:

* Requested EMI moderately exceeds Safe EMI.
* Unknown credit information.
* Moderate income reliability.
* Moderate stress failure.
* Moderate existing EMI pressure.

## High-Risk Signals

Examples:

* Disposable income is zero or negative.
* Requested EMI significantly exceeds Safe EMI.
* Recent missed payment.
* Severe stress failure.
* Low income reliability combined with high existing debt pressure.

---

# 31. Final Verdict Rules

The application uses a deterministic priority order.

## 🔴 DO_NOT_BORROW

Return DO_NOT_BORROW if any of the following are true:

1. Disposable Income is less than or equal to zero.
2. Safe Monthly EMI is zero.
3. Requested EMI is more than 125% of Safe Monthly EMI.
4. Requested EMI fails the moderate stress scenario and significant additional high-risk signals exist.
5. Recent missed payment is combined with:

   * Low income reliability, or
   * High existing EMI pressure.

The result must include specific reasons.

---

## 🟡 BORROW_LESS

Return BORROW_LESS if:

1. Requested EMI is above Safe Monthly EMI but not more than 125%, or
2. Requested loan amount exceeds the Affordable Loan Amount, or
3. The moderate stress scenario fails without triggering DO_NOT_BORROW, or
4. Multiple moderate-risk signals exist.

The application recommends:

```text
Recommended Borrowing Amount
=
minimum(
    Requested Amount,
    Affordable Loan Amount
)
```

---

## 🟢 BORROW

Return BORROW if all of the following are true:

1. Requested EMI is less than or equal to Safe Monthly EMI.
2. Requested amount is less than or equal to Affordable Loan Amount.
3. No DO_NOT_BORROW rule is triggered.
4. Moderate stress does not create significant repayment pressure.

BORROW does not mean approved.

---

# 32. Verdict Priority

The decision order is:

```text
DO_NOT_BORROW
        ↓
BORROW_LESS
        ↓
BORROW
```

The first matching higher-risk rule takes priority.

---

# 33. Assessment Confidence

Confidence measures:

> **How well the available information supports the assessment.**

Confidence does not represent:

* Probability of loan approval.
* Probability of default.
* Financial risk.

## Confidence Signals

### High Confidence

* Credit score known.
* Income information detailed.
* Expenses known.
* Existing EMI known.
* Income history known where applicable.

### Medium Confidence

* Core financial information available.
* Some secondary information unavailable.

### Low Confidence

* Credit information unknown.
* Income highly uncertain.
* Expense information incomplete.
* Existing debt information incomplete.

Missing information widens ranges.

It should not automatically classify the borrower as financially weak.

---

# 34. Range Widening Rules

When important information is unavailable:

| Missing Information   | Effect                                       |
| --------------------- | -------------------------------------------- |
| Credit score          | Interest-rate range widens                   |
| Income history        | Income reliability becomes more conservative |
| Business history      | Rate and eligibility uncertainty increase    |
| Collateral details    | Secured route is not estimated confidently   |
| Existing debt details | Assessment confidence decreases              |

The application must not create false precision.

---

# 35. Explainability Rules

Every major output must have at least one explanation.

Examples:

### Safe EMI

> "Your safe EMI ceiling is ₹22,000 because your estimated usable income after reliability adjustment, household expenses, and existing EMI leaves approximately ₹55,000 of disposable income, and the assessment reserves part of that amount for financial safety."

### Interest Rate

> "Your estimated fair rate range is lower because you reported a strong credit score and stable salaried income."

### BORROW_LESS

> "The requested EMI is above your calculated safe EMI ceiling, so the application recommends reducing the borrowing amount."

### DO_NOT_BORROW

> "Your current repayment pressure and recent repayment difficulty indicate that an additional loan may create significant financial risk."

---

# 36. Requested Plan vs Safer Plan

The application compares:

| Requested Plan               | Safer Plan                        |
| ---------------------------- | --------------------------------- |
| Requested loan amount        | Recommended borrowing amount      |
| Requested EMI                | Safe EMI                          |
| Selected tenure              | Same tenure or alternative tenure |
| Requested repayment pressure | Safer repayment pressure          |

The difference is displayed as:

```text
Borrowing Reduction Required
=
Requested Amount
−
Recommended Amount
```

and:

```text
EMI Reduction Required
=
Requested EMI
−
Safe EMI
```

---

# 37. Tenure Trade-Off

Increasing tenure may reduce monthly EMI.

However, it can increase:

* Total interest.
* Total repayment.
* Long-term debt exposure.

The application therefore displays at least one alternative tenure comparison when relevant.

The application must not recommend a longer tenure solely to force an unsafe borrowing request into a technically affordable EMI.

---

# 38. Negotiation Card

The Negotiation Card contains:

## Borrowing Request

* Requested loan amount.
* Loan purpose.

## Recommended Financial Limit

* Safe Borrowing Amount.
* Safe Monthly EMI.

## Market Comparison Estimate

* Fair interest-rate range.
* Estimated APR range.
* Processing-fee assumption.

## Lender Comparison

* Likely lender sanction range.
* Clear statement that lender sanction does not equal safe borrowing.

## Questions for the Lender

The application may generate questions such as:

1. What is the all-in APR including processing fees?
2. What is the total repayment over the full tenure?
3. Why is the offered interest rate above my estimated fair range?
4. Can the processing fee be reduced?
5. Are there prepayment or foreclosure charges?
6. What happens to my EMI if the interest rate changes?
7. Is a secured product available at a lower borrowing cost?

## Disclaimer

> This card is an educational affordability assessment based on self-reported information. It is not a loan approval, lender decision, or financial guarantee.

---

# 39. Priya — Expected Reasoning Path

## Profile

* Age: 29.
* Income type: Salaried.
* Net income: ₹1,10,000/month.
* Employment history: 5 years.
* Existing EMI: ₹14,000.
* Household rent/expense: ₹28,000.
* Credit score: 780.
* Requested loan: ₹8,00,000.
* Purpose: Wedding.
* Product: Personal Loan.

## Adaptive Questions

The application should ask:

* Is income stable?
* Is there a variable salary component?
* How much emergency savings is available?
* Are there upcoming financial obligations?

## Expected Reasoning

Strong salaried income and a strong credit score improve:

* Income reliability.
* Interest-rate estimate.
* Assessment confidence.

Existing EMI and rent reduce affordability.

The application must independently calculate whether ₹8,00,000 fits the Safe EMI.

---

# 40. Ravi — Expected Reasoning Path

## Profile

* Age: 42.
* Income type: Self-employed.
* Business age: 14 years.
* Income range: ₹40,000–₹80,000/month.
* ITR: ₹4,20,000/year.
* Credit score: Unknown.
* Property collateral: ₹45,00,000.
* Wife income: ₹18,000/month.
* Requested amount: ₹15,00,000.
* Purpose: Business expansion.

## Adaptive Questions

The application should ask:

* Is the property unencumbered?
* What is the estimated collateral value?
* How stable is business income?
* Is the income documented?
* Is the co-applicant income available for household assessment?

## Expected Reasoning

Ravi's unknown credit information should:

* Reduce confidence.
* Widen the interest-rate range.

It must not be treated as bad credit.

Because he has valuable unencumbered collateral, the application should compare:

> Unsecured Business Loan vs Secured Business / LAP.

The application must still calculate Safe EMI from repayment capacity.

Collateral must not automatically justify unsafe borrowing.

---

# 41. Anita — Expected Reasoning Path

## Profile

* Age: 35.
* Income type: Informal.
* Income: ₹26,000–₹30,000/month.
* Existing app loans: Three.
* Outstanding debt: ₹35,000.
* Borrowing cost: 30%+.
* Recent EMI bounce: Yes.
* Household pressure: Two children and unemployed spouse.
* Requested loan: ₹1,50,000.
* Purpose: Electric scooter.

## Adaptive Questions

The application should ask:

* Existing monthly EMI.
* Household expenses.
* Dependants.
* Income variability.
* Whether the scooter creates measurable income improvement.
* Details of the recent bounced EMI.

## Expected Reasoning

Anita has multiple high-risk signals:

* Informal income.
* Variable income.
* Existing high-cost debt.
* Recent repayment difficulty.
* Significant household financial responsibility.

The application should allow DO_NOT_BORROW to be reached.

It may also explain that a productive asset can potentially improve income, but potential future income must not be treated as guaranteed income when calculating current affordability.

---

# 42. Testing Requirements

The application should test at least the following cases.

## Strong Affordability

Expected result:

```text
BORROW
```

## Moderate Financial Pressure

Expected result:

```text
BORROW_LESS
```

## Significant Financial Pressure

Expected result:

```text
DO_NOT_BORROW
```

Additional tests:

* Unknown credit score.
* High credit score.
* Recent missed payment.
* High existing EMI.
* Variable income.
* Collateral routing.
* Co-applicant availability.
* Stress-test failure.
* Zero disposable income.

---

# 43. Rules and Assumptions Register

This table documents the main calculation rules.

| What                                | Value                         | Why                                               | Source / Basis                       |
| ----------------------------------- | ----------------------------- | ------------------------------------------------- | ------------------------------------ |
| Product assessment                  | Rule-based                    | Transparency and explainability                   | My judgement                         |
| Currency                            | INR (₹)                       | India-specific challenge                          | Challenge requirement                |
| High income usable factor           | 90%                           | Avoids using 100% income                          | My judgement                         |
| Medium income usable factor         | 75%                           | Moderate uncertainty adjustment                   | My judgement                         |
| Low income usable factor            | 60%                           | Conservative variable-income treatment            | My judgement                         |
| High reliability Safe EMI factor    | 50% of disposable income      | Retains uncommitted capacity                      | My judgement                         |
| Medium reliability Safe EMI factor  | 40% of disposable income      | More conservative affordability                   | My judgement                         |
| Low reliability Safe EMI factor     | 30% of disposable income      | High uncertainty requires larger buffer           | My judgement                         |
| Existing EMI high pressure          | >35% usable income            | Indicates significant existing repayment pressure | My judgement                         |
| Strong credit score                 | ≥750                          | Used as strong-profile signal                     | My judgement                         |
| Good credit score                   | 700–749                       | Used as moderately positive signal                | My judgement                         |
| Moderate credit                     | 650–699                       | Used as moderately elevated pricing signal        | My judgement                         |
| Low credit                          | <650                          | Used as elevated-risk signal                      | My judgement                         |
| Unknown credit                      | Wider range, lower confidence | Unknown is not poor credit                        | Challenge requirement + my judgement |
| Personal base rate                  | 11%–18%                       | Educational market estimate                       | My judgement                         |
| Business base rate                  | 12%–20%                       | Educational market estimate                       | My judgement                         |
| Secured business/LAP rate           | 9%–14%                        | Secured borrowing may cost less                   | My judgement                         |
| Vehicle rate                        | 8%–13%                        | Educational estimate                              | My judgement                         |
| Two-wheeler rate                    | 10%–18%                       | Educational estimate                              | My judgement                         |
| Home rate                           | 8%–11%                        | Educational estimate                              | My judgement                         |
| Education rate                      | 9%–14%                        | Educational estimate                              | My judgement                         |
| Gold-backed rate                    | 9%–16%                        | Educational estimate                              | My judgement                         |
| Unknown credit widening             | +2 percentage points          | Prevents false precision                          | My judgement                         |
| Recent missed payment               | +1.5 percentage points        | Higher repayment uncertainty                      | My judgement                         |
| Low reliability pricing adjustment  | +1.0 percentage point         | Higher income uncertainty                         | My judgement                         |
| High reliability pricing adjustment | −0.5 percentage point         | More stable income                                | My judgement                         |
| Minimum rate clamp                  | 7%                            | Avoid unrealistic low output                      | My judgement                         |
| Maximum rate clamp                  | 24%                           | Avoid unrealistic extreme output                  | My judgement                         |
| Mild stress                         | −10% income                   | Tests manageable reduction                        | Challenge requirement                |
| Moderate stress                     | −20% income                   | Tests significant reduction                       | My judgement                         |
| Severe stress                       | −30% income                   | Tests major income disruption                     | My judgement                         |
| Moderate EMI pressure               | Requested EMI > Safe EMI      | Indicates affordability pressure                  | My judgement                         |
| Significant EMI pressure            | Requested EMI >125% Safe EMI  | Indicates substantial affordability gap           | My judgement                         |
| Negative disposable income          | DO_NOT_BORROW                 | No remaining repayment capacity                   | My judgement                         |
| Safe EMI = zero                     | DO_NOT_BORROW                 | No safe capacity for new debt                     | My judgement                         |
| Moderate stress failure             | BORROW_LESS signal            | Current request has reduced resilience            | My judgement                         |
| Collateral effect                   | Product routing, not Safe EMI | Asset value does not equal repayment ability      | My judgement                         |
| Confidence                          | Information quality           | Separate from financial risk                      | Challenge requirement + my judgement |
| Negotiation Card                    | Always educational            | Prevents false lender authority                   | Challenge requirement                |

---

# 44. Known Limitations

Borrower Copilot does not know:

* Actual lender underwriting rules.
* Actual bureau history unless provided by the borrower.
* Actual lender interest-rate offers.
* Verified income.
* Property valuation accuracy.
* Legal eligibility.
* Future employment stability.
* Future business performance.
* Future interest-rate changes.

The application therefore presents:

* Estimates.
* Ranges.
* Assumptions.
* Confidence levels.

It does not present estimates as facts.

---

# 45. Final Disclaimer

Borrower Copilot provides an educational financial assessment based on information provided by the borrower.

It does not provide:

* Loan approval.
* Lending services.
* Guaranteed interest rates.
* Guaranteed lender eligibility.
* Credit decisions.
* Professional financial advice.

Users should independently review loan terms, all fees, APR, repayment conditions, and financial risks before taking on debt.

> **A lender's willingness to lend does not automatically mean the borrower can safely afford the loan.**
