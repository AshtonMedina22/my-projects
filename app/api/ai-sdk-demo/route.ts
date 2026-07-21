import { NextRequest, NextResponse } from "next/server";
import legacyHandler from "../../../api/ai-sdk-demo.js";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const result = await runLegacyHandler("POST", body);
  return NextResponse.json(result.body, { status: result.status });
}

export async function GET() {
  const result = await runLegacyHandler("GET", {});
  return NextResponse.json(result.body, { status: result.status });
}

async function runLegacyHandler(method: "GET" | "POST", body: unknown) {
  let status = 200;
  let payload: unknown = null;

  const req = { method, body };
  const res = {
    setHeader() {
      return this;
    },
    status(code: number) {
      status = code;
      return this;
    },
    json(data: unknown) {
      payload = data;
      return this;
    },
    end() {
      return this;
    },
  };

  await legacyHandler(req, res);
  return { status, body: payload };
}
