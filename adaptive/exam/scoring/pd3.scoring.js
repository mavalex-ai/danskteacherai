// Backend2/adaptive/exam/scoring/pd3.scoring.js

/**
 * PD3 Scoring Rubric v0.1
 * Deterministic, heuristic-based scoring
 */

const WEIGHTS = {
  taskFulfilment: 0.3,
  coherence: 0.25,
  language: 0.25,
  register: 0.2
};

// =========================
// Helpers
// =========================

function wordCount(text = "") {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function includesAny(text, keywords = []) {
  const lower = text.toLowerCase();
  return keywords.some(k => lower.includes(k));
}

// =========================
// Individual criteria
// =========================

function scoreTaskFulfilment({ task, answer }) {
  let score = 0.5;

  if (!answer || answer.length < 20) return 0;

  // Covers both sides (fordel / ulempe etc.)
  if (includesAny(answer, ["fordel", "ulempe", "positiv", "negativ"])) {
    score += 0.25;
  }

  // Mentions work / society context
  if (task?.context && includesAny(answer, [task.context])) {
    score += 0.15;
  }

  return Math.min(1, score);
}

function scoreCoherence(answer = "") {
  let score = 0.4;

  if (includesAny(answer, ["for det første", "for det andet", "desuden", "derfor"])) {
    score += 0.3;
  }

  if (answer.includes("\n") || answer.includes(".")) {
    score += 0.3;
  }

  return Math.min(1, score);
}

function scoreLanguageControl(answer = "") {
  let score = 0.5;

  // Very naive heuristic for v0.1
  const longWords = answer.split(/\s+/).filter(w => w.length > 6);
  if (longWords.length > 5) {
    score += 0.25;
  }

  if (!includesAny(answer, ["jeg er", "jeg har", "jeg synes"])) {
    score += 0.15;
  }

  return Math.min(1, score);
}

function scoreRegister(answer = "") {
  let score = 0.4;

  // Penalize informal markers
  if (includesAny(answer, ["mega", "super", "lol", "haha"])) {
    score -= 0.2;
  }

  // Reward semi-formal phrases
  if (includesAny(answer, ["jeg mener", "det er vigtigt", "man kan sige"])) {
    score += 0.4;
  }

  return Math.max(0, Math.min(1, score));
}

// =========================
// Main scorer
// =========================

export function scorePD3Answer({ task, userAnswer }) {
  const taskFulfilment = scoreTaskFulfilment({ task, answer: userAnswer });
  const coherence = scoreCoherence(userAnswer);
  const language = scoreLanguageControl(userAnswer);
  const register = scoreRegister(userAnswer);

  const totalScore =
    taskFulfilment * WEIGHTS.taskFulfilment +
    coherence * WEIGHTS.coherence +
    language * WEIGHTS.language +
    register * WEIGHTS.register;

  return {
    totalScore: Number(totalScore.toFixed(2)),
    breakdown: {
      taskFulfilment: Number(taskFulfilment.toFixed(2)),
      coherence: Number(coherence.toFixed(2)),
      language: Number(language.toFixed(2)),
      register: Number(register.toFixed(2))
    }
  };
}
