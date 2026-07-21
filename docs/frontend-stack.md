# Frontend Stack Direction

The public portfolio should evolve from static HTML into a Vercel-native Next.js and React app.

## Installed Runtime Packages

- `next`
- `react`
- `react-dom`
- `recharts`
- `lucide-react`
- `@vercel/analytics`
- `@vercel/speed-insights`
- `ai`
- `@ai-sdk/openai`
- `zod`
- `clsx`
- `tailwind-merge`
- `class-variance-authority`

## Installed Development Tooling

- `typescript`
- `eslint`
- `eslint-config-next`
- `prettier`
- `tailwindcss`
- `postcss`
- `autoprefixer`
- React and Node type packages

## Workspace Recommendations

VS Code recommendations live in `.vscode/extensions.json`. They cover ESLint, Prettier,
Tailwind CSS IntelliSense, TypeScript nightly support, MDX, spell checking, GitHub Actions,
and GitHub PR review.

## Tremor Decision

`@tremor/react` currently declares a React 18 peer dependency, while this workspace is on
current React 19 with Next 16. Do not force-install Tremor as a dependency. Use Tremor Blocks
as design reference and recreate the patterns with React, Tailwind, Recharts, and native
components until Tremor has a compatible release.

## Migration Status

The portfolio has been migrated to a Next.js App Router shell:

1. Homepage and project detail routes live under `app/`.
2. Typed project metadata lives in `lib/projects.ts`.
3. The live demo hub is available at `/live`.
4. The trip planner and training manual creator have dedicated Next app routes.
5. Existing Vercel function logic is wrapped by Next route handlers under `app/api/`.
6. Vercel Analytics and Speed Insights are mounted in `app/layout.tsx`.

Use `npm run dev` for local development and `npm run build` before deployment.
