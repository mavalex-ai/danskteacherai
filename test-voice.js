import fetch from "node-fetch";
import FormData from "form-data";
import fs from "fs";

async function run() {
  const filePath = "./test-audio/test.wav";

  if (!fs.existsSync(filePath)) {
    console.error("❌ File not found:", filePath);
    return;
  }

  const form = new FormData();
  form.append("audio", fs.createReadStream(filePath), "test.wav");

  try {
    const response = await fetch("http://localhost:3001/api/voice-chat", {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
    });

    const data = await response.json();
    console.log("✅ Voice Chat Response:");
    console.log(data);
  } catch (err) {
    console.error("❌ ERROR:", err);
  }
}

run();

