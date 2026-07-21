import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import {
  buildToolTrace,
  classifyTransaction,
  classifyTransactions,
  MOCK_ESG_TRANSACTIONS,
  summarizeReadiness,
} from "../../lib/esg/classifier";

const FetchTransactionsSchema = z.object({
  days_back: z.number().default(30),
  min_amount: z.number().optional(),
});

const MapFactorSchema = z.object({
  transaction_id: z.string(),
});

const RecordAuditSchema = z.object({
  transaction_id: z.string(),
  reviewer: z.string().optional(),
});

const server = new Server(
  {
    name: "autonomous-esg-transaction-classifier",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "fetch_erp_transactions",
        description: "Fetch raw financial transaction logs from Dynamics 365 or SAP for ESG auditing.",
        inputSchema: {
          type: "object",
          properties: {
            days_back: { type: "number", description: "Lookback window for recent ERP spend records." },
            min_amount: { type: "number", description: "Optional minimum transaction amount filter." },
          },
        },
      },
      {
        name: "map_to_ghg_factor",
        description: "Map a transaction to a GHG Protocol-style emission scope, category, factor, and audit trace.",
        inputSchema: {
          type: "object",
          properties: {
            transaction_id: { type: "string", description: "ERP transaction ID to classify." },
          },
          required: ["transaction_id"],
        },
      },
      {
        name: "record_audit_entry",
        description: "Persist the final ESG classification into an auditable ledger after validation.",
        inputSchema: {
          type: "object",
          properties: {
            transaction_id: { type: "string", description: "ERP transaction ID that should be recorded." },
            reviewer: { type: "string", description: "Optional human reviewer name for HITL verification." },
          },
          required: ["transaction_id"],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "fetch_erp_transactions") {
    const parsed = FetchTransactionsSchema.parse(args ?? {});
    const transactions = MOCK_ESG_TRANSACTIONS.filter((item) => !parsed.min_amount || item.amount >= parsed.min_amount);
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(transactions, null, 2),
        },
      ],
    };
  }

  if (name === "map_to_ghg_factor") {
    const parsed = MapFactorSchema.parse(args ?? {});
    const transaction = MOCK_ESG_TRANSACTIONS.find((item) => item.id === parsed.transaction_id);

    if (!transaction) {
      return {
        content: [{ type: "text", text: `Transaction ${parsed.transaction_id} not found.` }],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(classifyTransaction(transaction), null, 2),
        },
      ],
    };
  }

  if (name === "record_audit_entry") {
    const parsed = RecordAuditSchema.parse(args ?? {});
    const classifications = classifyTransactions(MOCK_ESG_TRANSACTIONS);
    const transaction = classifications.find((item) => item.id === parsed.transaction_id);

    if (!transaction) {
      return {
        content: [{ type: "text", text: `Transaction ${parsed.transaction_id} not found.` }],
        isError: true,
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            {
              status: "recorded",
              transaction_id: parsed.transaction_id,
              reviewer: parsed.reviewer ?? "system",
              readiness: summarizeReadiness(classifications),
              trace: buildToolTrace(classifications),
            },
            null,
            2,
          ),
        },
      ],
    };
  }

  return {
    content: [{ type: "text", text: `Unknown tool: ${name}` }],
    isError: true,
  };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ESG MCP Server running on stdio");
}

main().catch((error) => {
  console.error("ESG MCP Server failed:", error);
  process.exit(1);
});
