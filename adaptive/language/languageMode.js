// Backend2/adaptive/language/languageMode.js

/**
 * Gradual language transition logic (v1)
 *
 * languageConfidence: 0.0 → 1.0
 * languageMode:
 *  - EN_FULL
 *  - EN_UI_DA_TASKS
 *  - MIXED
 *  - DA_UI_EN_HINTS
 *  - DA_FULL
 */

/**
 * Calculate language confidence based on user state
 */
export function calculateLanguageConfidence(userState) {
  // --- Base from diagnostic / exam level ---
  let confidence = 0.2; // default (A2-ish)

  // Diagnostic result (if exists)
  if (userState.diagnostic?.level) {
    const level = userState.diagnostic.level;

    if (level === "A2") confidence = 0.2;
    if (level === "PD2") confidence = 0.45;
    if (level === "PD3") confidence = 0.75;
  }

  // Exam readiness influence (PD3)
  if (userState.exam?.target === "PD3") {
    const total = userState.exam.readiness?.total ?? 0;
    confidence = Math.max(confidence, 0.6 + total * 0.3);
  }

  // Attempts smooth growth
  if (userState.exam?.attempts) {
    confidence += Math.min(0.15, userState.exam.attempts * 0.02);
  }

  // Fatigue slightly reduces confidence
  if (userState.session?.fatigue) {
    confidence -= userState.session.fatigue * 0.1;
  }

  // Clamp
  confidence = Math.max(0, Math.min(1, confidence));

  return Number(confidence.toFixed(2));
}

/**
 * Decide final language mode
 */
export function calculateLanguageMode(userState) {
  const confidence = calculateLanguageConfidence(userState);

  if (confidence < 0.25) return "EN_FULL";
  if (confidence < 0.45) return "EN_UI_DA_TASKS";
  if (confidence < 0.65) return "MIXED";
  if (confidence < 0.85) return "DA_UI_EN_HINTS";

  return "DA_FULL";
}
