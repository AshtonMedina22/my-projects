import "dotenv/config";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const live = process.argv.includes("--live");
const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY);
const hasGatewayAuth = Boolean(process.env.VERCEL_OIDC_TOKEN || process.env.AI_GATEWAY_API_KEY);
const provider = process.env.AI_SDK_PROVIDER || (hasOpenAIKey ? "openai" : "gateway");
const directModel = process.env.AI_SDK_TEST_MODEL || "gpt-4.1-mini";
const gatewayModel = process.env.AI_SDK_GATEWAY_MODEL || "openai/gpt-5-mini";

console.log("AI SDK package import: OK");
console.log("@ai-sdk/openai provider import: OK");
console.log(`Node version: ${process.version}`);
console.log(`OPENAI_API_KEY: ${hasOpenAIKey ? "set" : "not set"}`);
console.log(`AI Gateway auth: ${hasGatewayAuth ? "set" : "not set"}`);
console.log(`Selected provider: ${provider}`);

if (!live) {
  console.log("Skipped live model call. Run `npm run check:ai-sdk:live` after setting OPENAI_API_KEY.");
  process.exit(0);
}

if (provider === "openai" && !hasOpenAIKey) {
  console.error("Cannot run direct OpenAI check because OPENAI_API_KEY is not set.");
  process.exit(1);
}

if (provider === "gateway" && !hasGatewayAuth) {
  console.error("Cannot run Gateway check because VERCEL_OIDC_TOKEN or AI_GATEWAY_API_KEY is not set.");
  process.exit(1);
}

const { text } = await generateText({
  model: provider === "openai" ? openai(directModel) : gatewayModel,
  prompt: "Reply exactly with: AI SDK ready",
});

console.log(`Live model response: ${text.trim()}`);
