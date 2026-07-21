import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT =
  "You are a mystical, slightly sarcastic Magic 8-Ball. Give a short, one-sentence fortune-telling answer to the user's question.";

const FALLBACK_FORTUNES = [
  "The stars say yes, but they are rolling their eyes about it.",
  "Ask again after the universe finishes buffering.",
  "A confident yes drifts through the fog.",
  "The omen is favorable, suspiciously favorable.",
  "Not today, seeker, the vibes are wearing steel-toed boots.",
  "The answer is yes, if you stop asking like destiny has office hours.",
  "Very doubtful, but dramatic persistence may annoy fate into agreement.",
  "The crystal ball says no, then immediately denies saying anything.",
  "Signs point to chaos first, success later.",
  "The future says maybe, which is rude but technically an answer.",
];

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const question = typeof body?.question === "string" ? body.question.trim() : "";
  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (!question) {
    return NextResponse.json({ error: "The void requires a question." }, { status: 400 });
  }

  if (question.length > 280) {
    return NextResponse.json({ error: "The oracle accepts questions under 280 characters." }, { status: 400 });
  }

  const seeker = name || "A seeker";

  if (process.env.OPENAI_API_KEY) {
    try {
      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        system: SYSTEM_PROMPT,
        prompt: `${seeker} asks: ${question}`,
        temperature: 0.85,
        maxOutputTokens: 45,
      });

      const answer = cleanAnswer(text);
      if (answer) {
        return NextResponse.json({
          answer,
          mode: "openai",
          question,
        });
      }
    } catch (error) {
      console.error("Magic 8-Ball OpenAI generation failed:", error);
    }
  }

  return NextResponse.json({
    answer: fallbackFortune(`${seeker}:${question}`),
    mode: "fallback",
    question,
  });
}

export async function GET() {
  return NextResponse.json({ error: "Ask the oracle with POST." }, { status: 405 });
}

function cleanAnswer(text: string) {
  return text
    .replace(/^["']|["']$/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

function fallbackFortune(seedText: string) {
  let hash = 0;
  for (let index = 0; index < seedText.length; index += 1) {
    hash = (hash * 31 + seedText.charCodeAt(index)) >>> 0;
  }
  return FALLBACK_FORTUNES[hash % FALLBACK_FORTUNES.length];
}
