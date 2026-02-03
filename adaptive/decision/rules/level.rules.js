// Backend2/adaptive/decision/rules/level.rules.js

export function levelSignal(userState) {
  const successRate = userState?.progress?.successRate ?? 0;
  const level = userState.level;

  if (successRate >= 0.85) {
    return {
      action: "ADVANCE",
      weight: 1.5,
      reason: `High success rate at level ${level}`,
      trace: "high_success_rate"
    };
  }

  return null;
}
