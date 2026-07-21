import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  enrichSreSummary,
  MOCK_SRE_INCIDENTS,
  runSelfHealingSre,
} from "../../../../lib/self-healing-sre/engine";

export const dynamic = "force-dynamic";

const requestSchema = z.object({
  incidentId: z.string().optional(),
  customSignal: z.string().max(1600).optional(),
  operatorPrompt: z.string().max(600).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body ?? {});

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid self-healing SRE request.", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  let result = runSelfHealingSre(parsed.data.incidentId, parsed.data.customSignal);

  if (process.env.OPENAI_API_KEY) {
    try {
      const { text } = await Promise.race([
        generateText({
          model: openai("gpt-4o-mini"),
          system:
            "You are a principal site reliability engineer. Rewrite the deterministic incident decision in one concise operator-facing sentence. Do not invent services, commands, dates, metrics, or approval state.",
          prompt: JSON.stringify(
            {
              operator_request: parsed.data.operatorPrompt || "Summarize the safest next action.",
              status: result.status,
              severity: result.severity,
              service: result.incident.service,
              selected_hypothesis: result.selected_hypothesis.claim,
              confidence: result.metrics.confidence,
              remediation: result.remediation,
              deterministic_notice: result.operator_notice,
            },
            null,
            2,
          ),
          temperature: 0.2,
          maxOutputTokens: 150,
        }),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("OpenAI SRE operator summary timed out.")), 8000);
        }),
      ]);

      if (text.trim()) {
        result = enrichSreSummary(result, text.replace(/\s+/g, " ").trim());
      }
    } catch (error) {
      console.error("Self-healing SRE OpenAI summary failed:", error);
    }
  }

  return NextResponse.json(result);
}

export async function GET() {
  return NextResponse.json({
    project: "Self-Healing SRE (Agentic DevOps)",
    status: "ready",
    incidents: MOCK_SRE_INCIDENTS.map((incident) => ({
      id: incident.id,
      title: incident.title,
      service: incident.service,
      environment: incident.environment,
      metric: incident.cloudwatch_signal.metric,
      value: incident.cloudwatch_signal.value,
      threshold: incident.cloudwatch_signal.threshold,
    })),
  });
}
