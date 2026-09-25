import Home from "./pages/Home";
import Questions from "./pages/Questions";
import AnalyzingScreen from "./pages/AnalyzingScreen";
import Results from "./pages/Results";

import type { BorrowerProfile } from "./types/borrower";

import { analyzeBorrower } from "./engine/borrowerAnalyzer";

import { useLocalStorage } from "./hooks/useLocalStorage";

type AppScreen =
  | "home"
  | "questions"
  | "analyzing"
  | "results";

function App() {
  const [screen, setScreen] =
    useLocalStorage<AppScreen>("appScreen", "home");

  const [borrowerProfile, setBorrowerProfile] =
    useLocalStorage<BorrowerProfile | null>(
      "borrowerProfile",
      null,
    );

  function handleAssessmentComplete(
    profile: BorrowerProfile,
  ) {
    setBorrowerProfile(profile);

    // Show analysis experience before results.
    setScreen("analyzing");
  }

  function handleAnalysisComplete() {
    setScreen("results");
  }

  function handleStartAgain() {
    setBorrowerProfile(null);

    setScreen("home");
  }

  /* ---------------------------------
     Home
  ---------------------------------- */

  if (screen === "home") {
    return (
      <Home
        onStart={() => {
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

  if (screen === "results" && borrowerProfile) {
    const analysis =
      analyzeBorrower(borrowerProfile);

    return (
      <Results
        analysis={analysis}
        onStartAgain={handleStartAgain}
      />
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