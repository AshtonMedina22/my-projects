module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (!process.env.OPENAI_API_KEY) {
    res.status(503).json({
      ok: false,
      status: "setup_required",
      message: "OPENAI_API_KEY is not configured for this environment.",
    });
    return;
  }

  try {
    const { generateText } = await import("ai");
    const { openai } = await import("@ai-sdk/openai");
    const prompt =
      req.method === "POST" && req.body && typeof req.body.prompt === "string"
        ? req.body.prompt
        : "Say this workspace is ready to use the Vercel AI SDK.";

    const { text, usage } = await generateText({
      model: openai(process.env.AI_SDK_MODEL || "gpt-4.1-mini"),
      prompt,
    });

    res.status(200).json({
      ok: true,
      text,
      usage,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message || "AI SDK request failed.",
    });
  }
};
