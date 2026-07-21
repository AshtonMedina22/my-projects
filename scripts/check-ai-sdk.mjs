import "dotenv/config";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const live = process.argv.includes("--live");
const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY);
const model = process.env.AI_SDK_TEST_MODEL || "gpt-4.1-mini";

console.log("AI SDK package import: OK");
console.log("@ai-sdk/openai provider import: OK");
console.log(`Node version: ${process.version}`);
console.log(`OPENAI_API_KEY: ${hasOpenAIKey ? "set" : "not set"}`);

if (!live) {
  console.log("Skipped live model call. Run `npm run check:ai-sdk:live` after setting OPENAI_API_KEY.");
  process.exit(0);
}

if (!hasOpenAIKey) {
  console.error("Cannot run live check because OPENAI_API_KEY is not set.");
  process.exit(1);
}

const { text } = await generateText({
  model: openai(model),
  prompt: "Reply exactly with: AI SDK ready",
});

console.log(`Live model response: ${text.trim()}`);
