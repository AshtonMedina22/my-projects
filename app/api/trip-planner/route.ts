import { NextRequest, NextResponse } from "next/server";
import legacyHandler from "../../../api/trip-planner.js";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const result = await runLegacyHandler(body);
  return NextResponse.json(result.body, { status: result.status });
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

async function runLegacyHandler(body: unknown) {
  let status = 200;
  let payload: unknown = null;

  const req = { method: "POST", body };
  const res = {
    status(code: number) {
      status = code;
      return this;
    },
    json(data: unknown) {
      payload = data;
      return this;
    },
  };

  await legacyHandler(req, res);
  return { status, body: payload };
}
