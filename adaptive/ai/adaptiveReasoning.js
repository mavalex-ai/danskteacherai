// Backend2/ai/adaptiveReasoning.js

import { getOpenAI } from "./openaiClient.js";

/**
 * Generate user-facing explanation (DA)
 */
async function explainDecision({ decision, signals }) {
  const openai = getOpenAI();
  if (!openai) return null;

  const systemPrompt = `
Du er en venlig og professionel dansk sproglærer.
Forklar kort og klart, hvorfor systemet har valgt denne handling.
Brug enkelt og motiverende dansk.
`;

  const userPrompt = `
Beslutning:
- handling: ${decision.action}
- hintKey: ${decision.hintKey}

Årsager:
${signals.map(s => `- ${s.reason}`).join("\n")}

Forklar dette for brugeren.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    });

    return completion.choices[0].message.content;
  } catch (err) {
    console.error("❌ Adaptive reasoning failed:", err.message);
    return null;
  }
}

export { explainDecision };
