import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { enrichPayFlowSummary, MOCK_INVOICES, runPayFlowAudit } from "../../../../lib/payflow/agent";

export const dynamic = "force-dynamic";

const requestSchema = z.object({
  invoiceId: z.string().optional(),
  analystPrompt: z.string().max(600).optional(),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(body ?? {});

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid PayFlow audit request.", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  let result = runPayFlowAudit(parsed.data.invoiceId);

  if (process.env.OPENAI_API_KEY) {
    try {
      const { text } = await Promise.race([
        generateText({
          model: openai("gpt-4o-mini"),
          system:
            "You are a senior accounts payable controls lead. Rewrite the deterministic audit decision in one concise executive sentence. Do not invent vendors, totals, statuses, or approvals.",
          prompt: JSON.stringify(
            {
              analyst_request: parsed.data.analystPrompt || "Summarize AP audit decision and next action.",
              status: result.status,
              invoice: {
                id: result.invoice.id,
                vendor: result.invoice.vendor,
                amount: result.invoice.amount,
                po_number: result.invoice.po_number,
              },
              variance_pct: result.variance_pct,
              risk_score: result.risk_score,
              requires_human_approval: result.requires_human_approval,
              deterministic_decision: result.decision,
            },
            null,
            2,
          ),
          temperature: 0.25,
          maxOutputTokens: 150,
        }),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("OpenAI PayFlow summary timed out.")), 8000);
        }),
      ]);

      if (text.trim()) {
        result = enrichPayFlowSummary(result, text.replace(/\s+/g, " ").trim());
      }
    } catch (error) {
      console.error("PayFlow OpenAI summary failed:", error);
    }
  }

  return NextResponse.json(result);
}

export async function GET() {
  return NextResponse.json({
    project: "PayFlow Accounts Payable Agent",
    status: "ready",
    invoices: MOCK_INVOICES.map((invoice) => ({
      id: invoice.id,
      vendor: invoice.vendor,
      amount: invoice.amount,
      po_number: invoice.po_number,
      terms: invoice.terms,
    })),
  });
}
