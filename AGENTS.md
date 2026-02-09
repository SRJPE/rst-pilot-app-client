AGENTS

This repository is an Expo / React Native (TypeScript) app. This document collects the commands agents should use to build, run, lint, and test the project plus a concise, opinionated code-style guide to follow when changing code.

- Repository root: `.`
- Main app code: `src/`

Build / Run / Lint / Test
- Run development Metro bundler + dev client: `npm run start` (runs `expo start --dev-client`). Use `npm run reset-cache` to clear Metro cache.
- Run on Android device/emulator: `npm run android` (sets `DARK_MODE=media` then `expo run:android`).
- Run on iOS simulator: `npm run ios` (macOS only).
- Web (browser) dev: `npm run web`.
- EAS updates / builds: use the `build-*` scripts in `package.json`:
  - `npm run build-dev` — update branch `dev` via `eas update`.
  - `npm run build-testing` — update `testing` branch.
  - `npm run build-production` — update `production` branch.
  - `npm run build-simulator` — `eas build -p ios --profile development-simulator`.
- Postinstall: project runs `patch-package` during `npm install` (`postinstall` script).

- TypeScript check (ad-hoc): `npx tsc --noEmit` (run from repository root). Use this before opening PRs if you don't run the full build.

- Running tests (project does not include a test harness by default):
  - There is no `test` script in `package.json`. If you add Jest/RTL, add scripts like:
    - `"test": "jest"`
    - `"test:watch": "jest --watch"`
  - To run a single test file once: `npx jest path/to/file.test.tsx`.
  - To run a single test name: `npx jest -t "test name regex"`.
  - When writing new tests prefer `@testing-library/react-native` for components and mock native modules with `jest.mock`.

Code style and conventions (for automated agents)
- Files & project structure
  - Put app code in `src/` and keep feature slices under `src/redux/` — follow existing layout like `src/redux/reducers/*` and `src/components/*`.
  - Component files: `PascalCase.tsx` (example: `src/components/Shared/CustomModal.tsx`).
  - Small utility modules or hooks may be `camelCase.ts` or `usePascalCase.ts` for hooks (`useSomething.ts`).

- Formatting
  - Use Prettier defaults with 2 spaces, trailing semicolons allowed (follow existing code). If Prettier is not configured, respect surrounding file formatting.
  - Keep line length ~100 characters. Break complex JSX into smaller components.

- Imports
  - Use absolute aliases when configured via `babel-plugin-module-resolver`. Prefer root-based imports like `src/...` when available to avoid long relative paths.
  - Order imports: builtin (node) -> external (npm) -> absolute project imports -> relative imports. Separate groups with a single blank line.
  - Named imports preferred when importing multiple utilities from the same module: `import { useState, useEffect } from 'react'`.
  - Prefer explicit file extensions only when required; TypeScript resolver handles `.ts/.tsx`.

- TypeScript and types
  - Enable strict typing where practical. Use `unknown` instead of `any` when the type is unknown and narrow it before use.
  - For component props, define an interface/type and annotate props explicitly:
    - `type Props = { value: string; onChange: (v: string) => void }`
    - `export default function MyComponent({ value, onChange }: Props) { ... }`
  - Use `ReturnType<typeof fn>` or explicit return types for exported functions when the type is non-trivial.
  - Avoid `!` (non-null assertion) unless there's a clear reason — prefer runtime checks.

- React / React Native
  - Functional components only; prefer hooks to class components.
  - Keep components small and focused. If a component is >250 lines, consider splitting.
  - Use `useCallback`, `useMemo` only when necessary to avoid premature optimization; add dependencies explicitly.
  - Prefer controlled components for form inputs; use `formik` for complex forms (project already uses `formik`).

- Redux & Slices
  - Follow the Redux Toolkit pattern used in `src/redux/reducers/*` (slices, actions, thunks).
  - Keep slice names descriptive: `xxxSlice.ts` and export selectors and async thunks from the same file when they belong together.
  - Avoid mutating global state directly outside of reducers; use RTK createSlice reducers or immer-friendly patterns.

- Naming conventions
  - React components / screens: `PascalCase` (e.g., `MonitoringProgramModalContent.tsx`).
  - Hooks: `useSomething` camelCase with `use` prefix.
  - Slices & reducers: `camelCase` filenames but export the slice as `xxxSlice` (follow existing code).
  - Constants: UPPER_SNAKE_CASE in a `constants.ts` file.

- Error handling & logging
  - Wrap async/await logic with `try/catch`. Return or rethrow errors after adding contextual information.
  - Centralize API error handling with `src/api/axiosConfig.ts` (this file exists). Use axios interceptors for auth token refresh and common error translation.
  - Show user-friendly error messages in the UI; keep low-level error logs for diagnostics only.
  - Do not swallow errors silently — always log or rethrow unless intentionally handled.

- Accessibility & UX
  - For RN components prefer `accessibilityLabel`, `accessible` props where appropriate.
  - Keep touch targets >= 44px when possible.

- Tests and mocking
  - Use `@testing-library/react-native` for component tests and `jest` for unit tests. Mock native modules (e.g., filesystem, async storage) via `jest.mock` or setup files.
  - Keep tests deterministic; avoid network calls — mock axios using `jest.mock('axios')` or `msw` for more advanced mocking.

- Commits / PRs (brief)
  - Small, focused commits. Each PR should include one logical change (feature/bugfix/refactor) and reference any relevant issue.

Cursor/Copilot rules
- No `.cursor/rules/` or `.cursorrules` directory found in the repository root — no Cursor rules to include.
- No `.github/copilot-instructions.md` found — no Copilot-specific instructions to include.

Files to inspect for context
- `package.json` — scripts and dependencies.
- `src/api/axiosConfig.ts` — central API configuration and a good place to wire common error handling.
- `src/redux/reducers/` — follow existing slice patterns when creating new reducers.

If you have to make a small change without explicit guidance
- Follow existing nearby code style in the same file or folder. Match naming, spacing, and patterns already used.
- When adding public-facing behavior (APIs, screens, Redux state), prefer explicit types and small, documented changes.

Next steps you might ask the user for (if needed)
1. Add an ESLint/Prettier config to the repo? (Recommended: `eslint` + `@typescript-eslint` + `prettier`.)
2. Add a test runner & sample test suite (Jest + RTL) so CI can run tests.

— End of file —
