// Backend2/ai/aiService.js

import { getOpenAI } from "./openaiClient.js";

/**
 * Безопасный вызов Chat Completion
 * @returns {string|null}
 */
async function generateTeacherReply({ systemPrompt, userMessage }) {
  const openai = getOpenAI();

  if (!openai) {
    return null; // AI отключён → graceful fallback
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ]
    });

    return completion.choices[0].message.content;
  } catch (err) {
    console.error("❌ OpenAI request failed:", err.message);
    return null;
  }
}

export { generateTeacherReply };
