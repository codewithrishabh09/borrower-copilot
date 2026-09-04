# 🏦 Borrower Copilot

A private, offline self-assessment tool that helps an Indian borrower answer four questions before walking into a lender:

1. Should I borrow at all?
2. How much am I really eligible for?
3. What is a fair interest rate for me?
4. What EMI should I agree to?

The output is a one-page **Negotiation Card** the borrower can use to push back on a lender's quote.

🔒 No login. No bureau pull. No personal data stored — everything runs from what the user enters in the session.

---

## 🚀 Quick start

```bash
git clone <this-repo-url>
cd borrower-copilot
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser.

Requires Node.js 18+.

No backend, database, or API keys are needed — the app runs entirely client-side.

---

## ⚙️ How it works

1. **Adaptive questions.** The app asks a short "must" set (~8–10 questions covering purpose, amount, income type, existing EMIs, expenses, age, credit score) and then branches into additional questions based on the borrower's profile (salaried vs. self-employed vs. informal). Every additional question is there because it changes an output — see `RULES.md`.

2. **📊 Four outputs** are generated from the answers:
   - ✅ Borrow / Don't borrow / Borrow less, with a reason
   - 💰 Lender-likely sanction vs. borrower-safe amount (shown separately)
   - 📈 A fair rate band + all-in APR (including processing fee)
   - 🧮 An EMI ceiling with a stress-tested scenario (income drop / rate rise)

3. **Confidence widens with missing answers.** Unanswered questions don't get treated as zero or best-case — they widen the range and the app says so explicitly.

4. **🤝 The Negotiation Card** is a summary screen showing the borrower's fair-rate range and reasoning, meant to be shown to a lender.

All thresholds and rules are documented — with rationale — in [`RULES.md`](./RULES.md).

---

## 🚫 What this is not

- Not a credit score or ML model — it's a rules-based self-assessment.
- Not a bureau integration.
- Not exhaustive across loan products — scoped to what the three personas need (personal, secured/business, and small-ticket vehicle loans).

---

## ⚠️ Limitations & assumptions

See the "why / source or judgement" column in `RULES.md` for every place a threshold was estimated rather than sourced from an official FOIR/RBI guideline.
