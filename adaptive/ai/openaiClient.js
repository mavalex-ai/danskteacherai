// Backend2/ai/openaiClient.js

import OpenAI from "openai";

let openaiInstance = null;
let openaiDisabled = false;

function getOpenAI() {
  if (openaiDisabled) {
    return null;
  }

  if (!process.env.OPENAI_API_KEY) {
    console.warn("⚠️ OPENAI_API_KEY not set, OpenAI disabled");
    openaiDisabled = true;
    return null;
  }

  if (!openaiInstance) {
    try {
      openaiInstance = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
      console.log("✅ OpenAI client initialized");
    } catch (err) {
      console.error("❌ Failed to init OpenAI:", err.message);
      openaiDisabled = true;
      return null;
    }
  }

  return openaiInstance;
}

export { getOpenAI };
