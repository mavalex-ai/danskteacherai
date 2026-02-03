// Backend2/adaptive/decision/rules/exam.rules.js

export function checkExamRules(userState) {
  const exam = userState?.examReadiness;
  if (!exam) return null;

  const { target, scoreEstimate } = exam;
  if (typeof scoreEstimate !== "number" || !target) return null;

  // =========================
  // ✅ EXAM READY
  // =========================

  if (target === "PD2" && scoreEstimate >= 75) {
    return {
      decision: {
        action: "EXAM_READY",
        level: "PD2",
        reason: "Ready for PD2 exam"
      },
      trace: ["exam.rules:PD2>=75"]
    };
  }

  if (target === "PD3" && scoreEstimate >= 80) {
    return {
      decision: {
        action: "EXAM_READY",
        level: "PD3",
        reason: "Ready for PD3 exam"
      },
      trace: ["exam.rules:PD3>=80"]
    };
  }

  // =========================
  // 🧠 TRAIN EXAM SKILLS
  // =========================

  // 🔹 PD3 has highest priority
  if (target === "PD3") {
    return {
      decision: {
        action: "TRAIN_EXAM_SKILL_PD3",
        level: "PD3",
        reason: "PD3 exam preparation in progress"
      },
      trace: ["exam.rules:PD3<training"]
    };
  }

  // 🔹 PD2 (fallback, lower cognitive load)
  if (target === "PD2") {
    return {
      decision: {
        action: "TRAIN_EXAM_SKILL",
        level: "PD2",
        reason: "PD2 exam preparation in progress"
      },
      trace: ["exam.rules:PD2<training"]
    };
  }

  return null;
}
