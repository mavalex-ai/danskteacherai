// Backend2/adaptive/diagnostic/diagnosticController.js

import { loadUserState, saveUserState } from "../persistence/stateRepository.js";
import { UserState } from "../state/UserState.js";

/**
 * START DIAGNOSTIC (FREE MODE)
 */
export async function startDiagnostic(req, res) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  let userState = await loadUserState(userId);

  if (!userState) {
    userState = new UserState(userId);
  }

  userState.startDiagnostic();
  await saveUserState(userState);

  return res.json({ status: "diagnostic_started" });
}

/**
 * DIAGNOSTIC STEP (STRICT MODE)
 */
export async function diagnosticNextStep(req, res) {
  const { userId, answerMeta } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  const userState = await loadUserState(userId);

  if (!userState || !userState.diagnostic) {
    return res.status(400).json({ error: "Diagnostic not initialized" });
  }

  // 🔒 HARD STOP:
  // If diagnostic is already finished — NEVER return tasks again
  if (!userState.diagnostic.active) {
    return res.json({
      diagnosticResult: {
        level: userState.diagnostic.estimatedLevel || "PD2",
        confidence: "medium"
      },
      languageMode: "EN"
    });
  }

  // =========================
  // UPDATE STATE
  // =========================
  userState.updateFromAnswer(answerMeta);

  const step = userState.diagnostic.stepsCompleted;
  const maxSteps = userState.diagnostic.maxSteps;

  // =========================
  // FINISH DIAGNOSTIC (ATOMIC)
  // =========================
  if (step >= maxSteps) {
    // Simple heuristic (v1)
    const estimatedLevel = "PD2";

    userState.stopDiagnostic(estimatedLevel);
    await saveUserState(userState);

    return res.json({
      diagnosticResult: {
        level: estimatedLevel,
        confidence: "medium"
      },
      languageMode: "EN"
    });
  }

  // =========================
  // CONTINUE DIAGNOSTIC STEP
  // =========================
  await saveUserState(userState);

  return res.json({
    action: "DIAGNOSTIC_STEP",
    step,
    task: {
      type: "production",
      level: "B1",
      focus: "general_language",
      instruction:
        "Write a short text about a topic that interests you."
    },
    languageMode: "EN"
  });
}
