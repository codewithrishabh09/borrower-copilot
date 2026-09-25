import Home from "./pages/Home";
import Questions from "./pages/Questions";
import AnalyzingScreen from "./pages/AnalyzingScreen";
import Results from "./pages/Results";

import type { BorrowerProfile } from "./types/borrower";
import type { BorrowerAnalysisResult } from "./engine/borrowerAnalyzer";

import { analyzeBorrower } from "./engine/borrowerAnalyzer";
import { validateBorrowerProfile } from "./validation/borrowerValidation";

import { useLocalStorage } from "./hooks/useLocalStorage";

type AppScreen =
  | "home"
  | "questions"
  | "analyzing"
  | "results"
  | "analysis_error";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong while building your assessment.";
}

function App() {
  const [screen, setScreen] =
    useLocalStorage<AppScreen>("appScreen", "home");

  const [borrowerProfile, setBorrowerProfile] =
    useLocalStorage<BorrowerProfile | null>(
      "borrowerProfile",
      null,
    );

  const [analysis, setAnalysis] =
    useLocalStorage<BorrowerAnalysisResult | null>(
      "borrowerAnalysis",
      null,
    );

  const [analysisError, setAnalysisError] =
    useLocalStorage<string | null>(
      "analysisError",
      null,
    );

  function handleAssessmentComplete(
    profile: BorrowerProfile,
  ) {
    const validation =
      validateBorrowerProfile(profile);

    if (!validation.isValid) {
      setBorrowerProfile(profile);
      setAnalysis(null);

      setAnalysisError(
        validation.errors
          .map((error) => error.message)
          .join(" "),
      );

      setScreen("analysis_error");
      return;
    }

    try {
      /*
       * Run the complete financial analysis before
       * moving to the analysis animation.
       *
       * This prevents Results.tsx from unexpectedly
       * crashing while rendering.
       */
      const result =
        analyzeBorrower(profile);

      setBorrowerProfile(profile);
      setAnalysis(result);
      setAnalysisError(null);

      setScreen("analyzing");
    } catch (error) {
      console.error(
        "Borrower Copilot analysis failed:",
        error,
      );

      setBorrowerProfile(profile);
      setAnalysis(null);

      setAnalysisError(
        getErrorMessage(error),
      );

      setScreen("analysis_error");
    }
  }

  function handleAnalysisComplete() {
    /*
     * Normal flow:
     *
     * Analysis was already calculated and stored.
     */
    if (analysis) {
      setScreen("results");
      return;
    }

    /*
     * Recovery path:
     *
     * This handles an older localStorage state where
     * the application was already on the analyzing screen
     * but no cached analysis existed.
     */
    if (borrowerProfile) {
      try {
        const result =
          analyzeBorrower(borrowerProfile);

        setAnalysis(result);
        setAnalysisError(null);
        setScreen("results");

        return;
      } catch (error) {
        console.error(
          "Borrower Copilot recovery analysis failed:",
          error,
        );

        setAnalysisError(
          getErrorMessage(error),
        );
      }
    }

    setScreen("analysis_error");
  }

  function handleStartAgain() {
    setBorrowerProfile(null);
    setAnalysis(null);
    setAnalysisError(null);

    setScreen("home");
  }

  /* ---------------------------------
     Home
  ---------------------------------- */

  if (screen === "home") {
    return (
      <Home
        onStart={() => {
          setAnalysis(null);
          setAnalysisError(null);

          setScreen("questions");
        }}
      />
    );
  }

  /* ---------------------------------
     Questions
  ---------------------------------- */

  if (screen === "questions") {
    return (
      <Questions
        onComplete={handleAssessmentComplete}
        onExit={() => setScreen("home")}
      />
    );
  }

  /* ---------------------------------
     Analyzing
  ---------------------------------- */

  if (screen === "analyzing") {
    return (
      <AnalyzingScreen
        onComplete={handleAnalysisComplete}
      />
    );
  }

  /* ---------------------------------
     Results
  ---------------------------------- */

  if (
    screen === "results" &&
    analysis
  ) {
    return (
      <Results
        analysis={analysis}
        onStartAgain={handleStartAgain}
      />
    );
  }

  /* ---------------------------------
     Analysis Error
  ---------------------------------- */

  if (screen === "analysis_error") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#FAF9F8] px-6 py-10 text-[#211A1E]">
        <section className="w-full max-w-xl rounded-3xl border border-[#E6DFE2] bg-white p-8 shadow-sm sm:p-10">

          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-xl font-bold text-red-700">
            !
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-red-700">
            Assessment could not be completed
          </p>

          <h1 className="mt-2 text-2xl font-semibold tracking-tight">
            We found a problem with the information or calculation.
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#756A70]">
            Your answers were not lost. Please review the issue below and start a new assessment.
          </p>

          {analysisError && (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm leading-6 text-red-800">
                {analysisError}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleStartAgain}
            className="mt-7 w-full rounded-xl bg-[#4B2440] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#3B1C32]"
          >
            Start new assessment
          </button>

        </section>
      </main>
    );
  }

  /* ---------------------------------
     Fallback
  ---------------------------------- */

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF9F8] px-6">
      <div className="max-w-md rounded-2xl border border-[#E6DFE2] bg-white p-8 text-center shadow-sm">

        <p className="text-sm font-medium text-[#756A70]">
          We could not restore your assessment.
        </p>

        <p className="mt-2 text-sm leading-6 text-[#84777E]">
          Please start a new borrowing assessment.
        </p>

        <button
          type="button"
          onClick={handleStartAgain}
          className="mt-6 rounded-xl bg-[#4B2440] px-5 py-3 text-sm font-semibold text-white"
        >
          Start again
        </button>

      </div>
    </main>
  );
}

export default App;