export function errorSignal(userState) {
  const errors = userState?.errors ?? {};

  const verbErrors = errors.verb_tense ?? 0;

  if (verbErrors >= 3) {
    return {
      action: "REPEAT",
      weight: 2,
      reason: "Repeated verb tense errors",
      trace: "verb_tense>=3"
    };
  }

  return null;
}
