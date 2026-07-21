# Vercel AI SDK Workspace Setup

This repo is configured to use the Vercel AI SDK package from `ai-sdk.dev`.

## Installed Packages

- `ai`
- `@ai-sdk/openai`
- `dotenv`
- `zod`

The package files are tracked in Git. `node_modules/` stays ignored.

## Local Setup

Install dependencies:

```bash
npm install
```

Verify imports without making an API call:

```bash
npm run check:ai-sdk
```

Run a live OpenAI-backed check:

```powershell
$env:OPENAI_API_KEY="your_key_here"
npm run check:ai-sdk:live
```

Optional model override:

```powershell
$env:AI_SDK_TEST_MODEL="gpt-4.1-mini"
```

## Vercel Environment Variables

Set these in the Vercel project environment, not in Git:

```text
OPENAI_API_KEY=...
AI_SDK_MODEL=gpt-4.1-mini
```

For direct OpenAI billing, use:

```text
AI_SDK_PROVIDER=openai
OPENAI_API_KEY=...
AI_SDK_MODEL=gpt-4.1-mini
```

For Vercel AI Gateway billing/routing, use:

```text
AI_SDK_PROVIDER=gateway
AI_SDK_GATEWAY_MODEL=openai/gpt-5-mini
```

Locally, Gateway also needs `VERCEL_OIDC_TOKEN` from `vercel env pull .env.local --yes` or a manually created `AI_GATEWAY_API_KEY`.

The demo endpoint at `/api/ai-sdk-demo` returns `setup_required` until the selected provider has its required runtime credentials.

## Notes

- `ai-sdk.dev` is the Vercel AI SDK. Cursor does not need a separate SDK install; it uses this repo's npm setup.
- Keep API keys out of committed files.
- Existing Vercel functions in `api/*.js` stay CommonJS-compatible. New ESM-only SDK imports are loaded with dynamic `import()` inside the demo route.
