import type { Question } from "../questions/mustQuestions";
import type { BorrowerProfile } from "../types/borrower";

import { mustQuestions } from "../questions/mustQuestions";
import { adaptiveQuestions } from "../questions/adaptiveQuestions";

export type AnswerValue = string | number | boolean | undefined;

/**
 * Returns true when a question should be visible
 * for the current borrower profile.
 */
export function shouldShowQuestion(
  question: Question,
  profile: BorrowerProfile,
): boolean {
  if (!question.dependsOn) {
    return true;
  }

  const { questionId, value } = question.dependsOn;

  const currentValue =
    profile[questionId as keyof BorrowerProfile];

  return currentValue === value;
}

/**
 * Returns all currently visible questions.
 *
 * Must questions are always evaluated first.
 * Adaptive questions are shown based on previous answers.
 */
export function getVisibleQuestions(
  profile: BorrowerProfile,
): Question[] {
  const allQuestions = [
    ...mustQuestions,
    ...adaptiveQuestions,
  ];

  return allQuestions.filter((question) =>
    shouldShowQuestion(question, profile),
  );
}

/**
 * Updates a single borrower answer.
 *
 * The function returns a new object instead of
 * mutating the existing borrower profile.
 */
export function updateBorrowerAnswer(
  profile: BorrowerProfile,
  questionId: string,
  value: AnswerValue,
): BorrowerProfile {
  return {
    ...profile,
    [questionId]: value,
  };
}

/**
 * Checks whether a question has been answered.
 */
export function hasAnswer(
  profile: BorrowerProfile,
  questionId: string,
): boolean {
  const value =
    profile[questionId as keyof BorrowerProfile];

  return (
    value !== undefined &&
    value !== null
  );
}

/**
 * Checks whether the current question can be submitted.
 */
export function isQuestionValid(
  question: Question,
  profile: BorrowerProfile,
): boolean {
  if (!question.required) {
    return true;
  }

  return hasAnswer(profile, question.id);
}