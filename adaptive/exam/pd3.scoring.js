// Backend2/adaptive/exam/pd3.scoring.js

/**
 * Very first PD3 scoring heuristic (v0.1)
 * Rule-based approximation (not AI yet)
 */

/**
 * Core scoring function
 */
export function scorePD3Answer({ answer, task }) {
  // --- Basic safety ---
  if (!answer || typeof answer !== "string") {
    return {
      total: 0,
      breakdown: {},
      feedback: "Der mangler et svar på opgaven."
    };
  }

  const length = answer.trim().length;

  // --- Simple heuristics ---
  const taskFulfilment =
    length > 120 ? 0.8 :
    length > 60 ? 0.6 :
    0.4;

  const coherence =
    answer.includes("for det første") ||
    answer.includes("på den anden side")
      ? 0.7
      : 0.5;

  const language = length > 100 ? 0.75 : 0.6;

  const register =
    task?.context === "work" &&
    answer.match(/jeg mener|efter min mening/i)
      ? 0.65
      : 0.4;

  const breakdown = {
    taskFulfilment,
    coherence,
    language,
    register
  };

  const total =
    taskFulfilment * 0.3 +
    coherence * 0.25 +
    language * 0.3 +
    register * 0.15;

  const feedback = generateFeedback(breakdown);

  return {
    total,
    breakdown,
    feedback
  };
}

/**
 * Examiner-style feedback (DA)
 */
function generateFeedback(breakdown) {
  const parts = [];

  if (breakdown.taskFulfilment >= 0.7) {
    parts.push("Du opfylder opgaven klart og besvarer alle dele relevant.");
  } else {
    parts.push("Opgaven er delvist besvaret, men nogle dele kunne uddybes mere.");
  }

  if (breakdown.coherence >= 0.7) {
    parts.push("Teksten hænger godt sammen og er let at følge.");
  } else {
    parts.push("Sammenhængen i teksten kunne være tydeligere.");
  }

  if (breakdown.language >= 0.7) {
    parts.push("Du viser god sproglig kontrol med passende ordforråd.");
  } else {
    parts.push("Der er sproglige usikkerheder, som påvirker forståelsen.");
  }

  if (breakdown.register >= 0.6) {
    parts.push(
      "Stilen passer overordnet til en arbejdsmæssig eller semi-formel kontekst."
    );
  } else {
    parts.push(
      "Stilen passer ikke helt til en arbejdsmæssig eller semi-formel kontekst."
    );
  }

  return parts.join(" ");
}

/**
 * ✅ DEFAULT EXPORT
 * This is what sessionController imports
 */
export default function evaluatePD3Answer({ answer, task }) {
  return scorePD3Answer({ answer, task });
}
