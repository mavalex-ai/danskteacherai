const PASS_THRESHOLD = 0.7;
const BORDERLINE = 0.05;
const MIN_ATTEMPTS = 3;

/**
 * Decide PASS / FAIL / CONTINUE for PD3
 */
export function getPD3Verdict({ attempts, readiness }) {
  const total = readiness?.total ?? 0;

  if (attempts < MIN_ATTEMPTS) {
    return {
      action: "TRAIN_EXAM_SKILL_PD3",
      reason: "Not enough attempts yet",
      trace: ["verdict:insufficient_attempts"]
    };
  }

  if (total >= PASS_THRESHOLD + BORDERLINE) {
    return {
      action: "PASS_PD3",
      reason: "Stable performance above PD3 threshold",
      trace: ["verdict:PASS_PD3"]
    };
  }

  if (total < PASS_THRESHOLD - BORDERLINE && attempts >= MIN_ATTEMPTS + 2) {
    return {
      action: "FAIL_PD3",
      reason: "Performance below PD3 threshold",
      trace: ["verdict:FAIL_PD3"]
    };
  }

  return {
    action: "TRAIN_EXAM_SKILL_PD3",
    reason: "Borderline — continue training",
    trace: ["verdict:BORDERLINE"]
  };
}
