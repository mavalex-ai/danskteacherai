// Backend2/adaptive/exam/feedback/pd3.feedback.js

/**
 * PD3 Examiner-style feedback v0.1
 */

function comment(score, good, medium, weak) {
  if (score >= 0.75) return good;
  if (score >= 0.5) return medium;
  return weak;
}

export function generatePD3Feedback(breakdown) {
  if (!breakdown) {
    return "Der mangler tilstrækkeligt grundlag for en vurdering af din besvarelse.";
  }

  const task = comment(
    breakdown.taskFulfilment,
    "Du opfylder opgaven klart og besvarer alle dele relevant.",
    "Du besvarer opgaven, men nogle dele kunne uddybes mere.",
    "Opgaven er kun delvist besvaret, og nogle vigtige elementer mangler."
  );

  const coherence = comment(
    breakdown.coherence,
    "Din tekst har en god sammenhæng og en klar struktur.",
    "Teksten er forståelig, men sammenhængen kunne være tydeligere.",
    "Teksten mangler klar struktur og sammenhæng."
  );

  const language = comment(
    breakdown.language,
    "Du viser god sproglig kontrol med passende ordforråd.",
    "Sproget er generelt forståeligt, men der forekommer en del usikkerheder.",
    "Der er mange sproglige fejl, som gør teksten svær at forstå."
  );

  const register = comment(
    breakdown.register,
    "Sproget passer godt til en semi-formel arbejdssituation.",
    "Stilen er delvist passende, men kunne være mere konsekvent.",
    "Stilen passer ikke til en arbejdsmæssig eller semi-formel kontekst."
  );

  return `${task} ${coherence} ${language} ${register}`;
}
