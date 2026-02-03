// Backend2/adaptive/analytics/decisionLogger.js

function logDecision({
  userId,
  decision,
  scores,
  signals
}) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    userId,
    action: decision.action,
    hint: decision.hint,
    scores,
    signals,
    trace: decision.trace
  };

  // Structured log (готово для file / DB)
  console.log("📊 DECISION_LOG", JSON.stringify(logEntry));
}

export { logDecision };
