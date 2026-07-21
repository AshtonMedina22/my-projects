module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY);
  const hasGatewayAuth = Boolean(process.env.VERCEL_OIDC_TOKEN || process.env.AI_GATEWAY_API_KEY);
  const provider = process.env.AI_SDK_PROVIDER || (hasOpenAIKey ? "openai" : "gateway");

  if (provider === "openai" && !hasOpenAIKey) {
    res.status(200).json({
      ok: true,
      status: "demo_fallback",
      provider,
      configured: false,
      text:
        "AI SDK fallback is active. Add OPENAI_API_KEY in Vercel project environment variables to enable live model calls.",
    });
    return;
  }

  if (provider === "gateway" && !hasGatewayAuth) {
    res.status(200).json({
      ok: true,
      status: "demo_fallback",
      provider,
      configured: false,
      text:
        "AI SDK fallback is active. Configure OPENAI_API_KEY for direct OpenAI calls or AI_GATEWAY_API_KEY/OIDC for Vercel AI Gateway.",
    });
    return;
  }

  try {
    const { generateText } = await import("ai");
    const prompt =
      req.method === "POST" && req.body && typeof req.body.prompt === "string"
        ? req.body.prompt
        : "Say this workspace is ready to use the Vercel AI SDK.";
    let model = process.env.AI_SDK_GATEWAY_MODEL || "openai/gpt-5-mini";

    if (provider === "openai") {
      const { openai } = await import("@ai-sdk/openai");
      model = openai(process.env.AI_SDK_MODEL || "gpt-4.1-mini");
    }

    const { text, usage } = await generateText({
      model,
      prompt,
    });

    res.status(200).json({
      ok: true,
      provider,
      configured: true,
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
