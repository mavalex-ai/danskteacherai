// Backend2/adaptive/ai/adaptiveTaskGenerator.js

/**
 * Exam-aware adaptive task generator
 * Supports Diagnostic, PD2 and PD3
 */

// =========================
// DIAGNOSTIC TASKS (EN ONLY)
// =========================
const DIAGNOSTIC_TASKS = [
  {
    type: "production",
    level: "A2",
    focus: "self_description",
    instruction:
      "Write a short text (4–6 sentences) about yourself. For example: who you are, where you live, and what you do."
  },
  {
    type: "production",
    level: "A2",
    focus: "daily_life",
    instruction:
      "Describe a typical day in your life. Write 4–6 simple sentences."
  },
  {
    type: "production",
    level: "B1",
    focus: "opinion",
    instruction:
      "Write a short text giving your opinion on a topic that interests you. Try to explain why you think so."
  },
  {
    type: "production",
    level: "B1",
    focus: "work_or_study",
    instruction:
      "Write a short text about your work or studies. What do you do, and what do you like or dislike about it?"
  }
];

// =========================
// LEVEL LIMITS PER EXAM
// =========================
const EXAM_LEVEL_LIMITS = {
  PD2: ["A2", "B1"],
  PD3: ["B1", "B2"]
};

// =========================
// PD2 TASK TEMPLATES
// =========================
const PD2_TASK_TEMPLATES = [
  {
    exam: "PD2",
    type: "production",
    level: "A2",
    focus: "daily_life",
    instruction: "Skriv 5 korte sætninger om din hverdag."
  },
  {
    exam: "PD2",
    type: "production",
    level: "A2",
    focus: "family",
    instruction: "Beskriv din familie med 4–6 enkle sætninger."
  },
  {
    exam: "PD2",
    type: "grammar",
    level: "B1",
    focus: "verb_tense",
    instruction: "Udfyld sætningerne med korrekt nutid eller datid."
  },
  {
    exam: "PD2",
    type: "reading",
    level: "B1",
    focus: "comprehension",
    instruction: "Læs teksten og besvar 5 korte spørgsmål."
  }
];

// =========================
// PD3 TASK TEMPLATES
// =========================
const PD3_TASK_TEMPLATES = [
  {
    exam: "PD3",
    type: "argumentative_text",
    level: "B1",
    register: "semi-formal",
    context: "work",
    instruction:
      "Din arbejdsplads overvejer hjemmearbejde. Skriv en tekst, hvor du beskriver én fordel og én ulempe ved hjemmearbejde."
  },
  {
    exam: "PD3",
    type: "structured_response",
    level: "B2",
    register: "semi-formal",
    context: "society",
    instruction:
      "Mange mener, at sociale medier har for stor indflydelse på samfundet. Skriv en struktureret tekst, hvor du giver din mening."
  },
  {
    exam: "PD3",
    type: "reformulation",
    level: "B1",
    register: "semi-formal",
    context: "work",
    instruction:
      "Omskriv teksten, så sproget bliver mere formelt og passer til en arbejdssituation."
  }
];

// =========================
// HELPERS
// =========================
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clampLevel(level, allowedLevels) {
  if (allowedLevels.includes(level)) return level;
  return allowedLevels[0];
}

// =========================
// MAIN GENERATOR
// =========================
export async function generateAdaptiveTask({
  action,
  level = "B1",
  examTarget = null
}) {
  // =========================
  // 🧪 DIAGNOSTIC MODE (EN)
  // =========================
  if (action === "DIAGNOSTIC_STEP") {
    return pickRandom(DIAGNOSTIC_TASKS);
  }

  // =========================
  // 🎓 PD3 EXAM MODE
  // =========================
  if (action === "TRAIN_EXAM_SKILL_PD3" || examTarget === "PD3") {
    const allowed = EXAM_LEVEL_LIMITS.PD3;
    const finalLevel = clampLevel(level, allowed);

    const candidates = PD3_TASK_TEMPLATES.filter(
      t => t.level === finalLevel
    );

    return pickRandom(candidates.length ? candidates : PD3_TASK_TEMPLATES);
  }

  // =========================
  // 🎓 PD2 EXAM MODE
  // =========================
  if (action === "TRAIN_EXAM_SKILL" || examTarget === "PD2") {
    const allowed = EXAM_LEVEL_LIMITS.PD2;
    const finalLevel = clampLevel(level, allowed);

    const candidates = PD2_TASK_TEMPLATES.filter(
      t => t.level === finalLevel
    );

    return pickRandom(candidates.length ? candidates : PD2_TASK_TEMPLATES);
  }

  // =========================
  // 🟢 NORMAL LEARNING MODE
  // =========================
  return {
    type: "production",
    level,
    focus: "general_language",
    instruction:
      "Write a short text about a topic that interests you."
  };
}
