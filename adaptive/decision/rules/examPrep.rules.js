// Backend2/adaptive/decision/rules/examPrep.rules.js

export function examPrepRule(userState, profile) {
  // 🛡 SAFETY CHECK — ключевой фикс
  if (!profile || typeof profile.passThreshold !== "number") {
    return null;
  }

  const readiness =
    userState.exam?.readiness?.total ?? 0;

  // ✅ Passed exam threshold
  if (readiness >= profile.passThreshold) {
    return {
      action: profile.passAction,
      hintKey: profile.passAction,
      trace: `examPrep:${profile.passAction}`
    };
  }

  // 🔁 Still training
  return {
    action: profile.trainAction,
    hintKey: profile.trainAction,
    trace: `examPrep:${profile.trainAction}`
  };
}
