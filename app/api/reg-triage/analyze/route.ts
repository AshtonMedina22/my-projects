import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  enrichRegulatorySummary,
  MOCK_REGULATORY_FEED,
  runRegulatoryTriage,
} from "../../../../lib/reg-triage/engine";

export const dynamic = "force-dynamic";

const requestSchema = z.object({
  feedId: z.string().optional(),
  customText: z.string().max(1600).optional(),
  analystPrompt: z.string().max(600).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body ?? {});

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid regulatory triage request.", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  let result = runRegulatoryTriage(parsed.data.feedId, parsed.data.customText);

  if (process.env.OPENAI_API_KEY) {
    try {
      const { text } = await Promise.race([
        generateText({
          model: openai("gpt-4o-mini"),
          system:
            "You are a senior legal operations analyst. Rewrite the deterministic regulatory triage decision in one concise executive sentence. Do not invent laws, dates, controls, jurisdictions, or approvals.",
          prompt: JSON.stringify(
            {
              analyst_request: parsed.data.analystPrompt || "Summarize the compliance impact and escalation path.",
              status: result.status,
              severity: result.severity,
              jurisdictions: result.feed_item.jurisdiction,
              requirements: result.requirements.map((requirement) => requirement.obligation),
              impacted_controls: result.impacted_controls.map((control) => control.policy),
              conflicts: result.conflicts.map((conflict) => conflict.description),
              deterministic_summary: result.report.executive_summary,
            },
            null,
            2,
          ),
          temperature: 0.25,
          maxOutputTokens: 170,
        }),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("OpenAI regulatory triage summary timed out.")), 8000);
        }),
      ]);

      if (text.trim()) {
        result = enrichRegulatorySummary(result, text.replace(/\s+/g, " ").trim());
      }
    } catch (error) {
      console.error("Regulatory triage OpenAI summary failed:", error);
    }
  }

  return NextResponse.json(result);
}

export async function GET() {
  return NextResponse.json({
    project: "Real-Time Regulatory Triage",
    status: "ready",
    feed_items: MOCK_REGULATORY_FEED.map((item) => ({
      id: item.id,
      source: item.source,
      title: item.title,
      jurisdiction: item.jurisdiction,
      effective_date: item.effective_date,
    })),
  });
}
