import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  buildMaterialityMetrics,
  buildToolTrace,
  classifyTransactions,
  fallbackExecutiveSummary,
  MOCK_ESG_TRANSACTIONS,
  summarizeReadiness,
} from "../../../../lib/esg/classifier";

export const dynamic = "force-dynamic";

const transactionSchema = z.object({
  id: z.string().min(1),
  source_system: z.enum(["Dynamics365", "SAP", "Oracle"]).default("Dynamics365"),
  vendor_name: z.string().min(1),
  amount: z.number().positive(),
  currency: z.enum(["USD", "L", "kWh", "hr", "kg"]),
  description: z.string().min(1),
  transaction_date: z.string().min(1),
});

const requestSchema = z.object({
  transactions: z.array(transactionSchema).max(25).optional(),
  analystPrompt: z.string().max(600).optional(),
});

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(json ?? {});

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid ESG classification request.",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  const transactions = parsed.data.transactions?.length ? parsed.data.transactions : MOCK_ESG_TRANSACTIONS;
  const classifications = classifyTransactions(transactions);
  const materiality = buildMaterialityMetrics(classifications);
  const audit_readiness = summarizeReadiness(classifications);
  const tool_trace = buildToolTrace(classifications);
  let mode: "openai" | "demo" = "demo";
  let summary = fallbackExecutiveSummary(classifications);

  if (process.env.OPENAI_API_KEY) {
    try {
      const { text } = await Promise.race([
        generateText({
          model: openai("gpt-4o-mini"),
          system:
            "You are an enterprise ESG audit lead. Write one concise executive summary from deterministic transaction classifications. Do not invent new transaction IDs, vendors, factors, or totals.",
          prompt: JSON.stringify(
            {
              analyst_request: parsed.data.analystPrompt || "Summarize ESG audit exposure and next review action.",
              audit_readiness,
              classifications: classifications.map((item) => ({
                id: item.id,
                vendor: item.vendor_name,
                category: item.classification.category,
                scope: item.classification.scope,
                kgCO2e: item.classification.calculated_footprint,
                verified: item.audit_metadata.is_verified,
                confidence: item.audit_metadata.reasoning_trace.confidence_score,
              })),
            },
            null,
            2,
          ),
          temperature: 0.35,
          maxOutputTokens: 180,
        }),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("OpenAI ESG summary timed out.")), 8000);
        }),
      ]);

      if (text.trim()) {
        summary = text.replace(/\s+/g, " ").trim();
        mode = "openai";
      }
    } catch (error) {
      console.error("ESG OpenAI summary failed:", error);
    }
  }

  return NextResponse.json({
    mode,
    generated_at: new Date().toISOString(),
    summary,
    audit_readiness,
    classifications,
    materiality,
    tool_trace,
  });
}

export async function GET() {
  return NextResponse.json({
    project: "Autonomous ESG Transaction Classifier",
    status: "ready",
    sample_transactions: MOCK_ESG_TRANSACTIONS,
  });
}
