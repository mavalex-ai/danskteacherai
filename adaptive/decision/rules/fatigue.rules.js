export function fatigueSignal(userState) {
  const fatigue = userState?.session?.fatigue ?? 0;

  if (fatigue >= 0.8) {
    return {
      action: "TAKE_BREAK",
      weight: 3,
      reason: "High fatigue",
      trace: "fatigue>=0.8"
    };
  }

  if (fatigue >= 0.6) {
    return {
      action: "REPEAT",
      weight: 1.5,
      reason: "Moderate fatigue",
      trace: "fatigue>=0.6"
    };
  }

  return null;
}
