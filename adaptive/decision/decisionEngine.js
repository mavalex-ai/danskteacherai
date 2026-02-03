import { examPrepRule } from "./rules/examPrep.rules.js";
import { examProfiles } from "../exam/examProfiles.js";
import { getPD3Verdict } from "../exam/pd3.verdict.js";

/**
 * Adaptive decision engine
 * Exam mode has PRIORITY
 */
export default function decisionEngine(userState) {
  // =========================
  // EXAM MODE (ABSOLUTE PRIORITY)
  // =========================
  if (userState.exam?.target === "PD3") {
    const verdict = getPD3Verdict({
      attempts: userState.exam.attempts,
      readiness: userState.exam.readiness
    });

    // ✅ FIX: use verdict.action
    if (verdict.action === "PASS_PD3") {
      return {
        decision: {
          action: "PASS_PD3",
          level: "PD3",
          reason: verdict.reason,
          trace: verdict.trace
        },
        scores: { PASS_PD3: 1 },
        signals: []
      };
    }

    if (verdict.action === "FAIL_PD3") {
      return {
        decision: {
          action: "FAIL_PD3",
          level: "PD3",
          reason: verdict.reason,
          trace: verdict.trace
        },
        scores: { FAIL_PD3: 1 },
        signals: []
      };
    }

    // Continue training
    const profile = examProfiles.PD3;
    const examSignal = examPrepRule(userState, profile);

    return {
      decision: {
        action: "TRAIN_EXAM_SKILL_PD3",
        level: "PD3",
        reason: verdict.reason,
        trace: verdict.trace
      },
      scores: { TRAIN_EXAM_SKILL_PD3: 1 },
      signals: examSignal ? [examSignal] : []
    };
  }

  // Fallback (non-exam)
  return {
    decision: {
      action: "ADVANCE",
      trace: ["default"]
    },
    scores: { ADVANCE: 1 },
    signals: []
  };
}
