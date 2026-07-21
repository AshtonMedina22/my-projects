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

## Migration Priority

1. Keep the current static Vercel site stable.
2. Build a Next.js `app/` version of the homepage and live project shell.
3. Move the existing `/api` routes into Next route handlers.
4. Replace static chart demos with Recharts components.
5. Add Vercel Analytics and Speed Insights after the Next app is serving production traffic.

Default `build` and `dev` scripts are intentionally not enabled yet. The current deployed site is
still static HTML plus Vercel Functions, so adding a default Next build before the migration could
break production deployment. Use `npm run next:dev` and `npm run next:build` when actively working
on the Next migration branch.
