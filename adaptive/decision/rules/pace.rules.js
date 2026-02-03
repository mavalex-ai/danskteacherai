export function paceSignal(userState) {
  const avgTime = userState?.pace?.averageResponseTime ?? 0;

  if (avgTime > 6000) {
    return {
      action: "REPEAT",
      weight: 1,
      reason: "Slow responses",
      trace: "slow_pace"
    };
  }

  return {
    action: "ADVANCE",
    weight: 0.5,
    reason: "Good pace",
    trace: "good_pace"
  };
}
