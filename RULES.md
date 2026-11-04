# Agent Rules (always follow)

## Source of truth
- `PRD.md` is the spec. `PROGRESS.md` is the current status. Read both before any task.
- Only read the PRD sections the task names. Do not rebuild or "improve" anything outside the task.
- If the task conflicts with the PRD, stop and ask. Do not silently pick one.
- If something is unspecified, choose the simplest option and log it in `DECISIONS.md`.

## How to work
1. One task at a time. Do exactly what was asked, nothing extra.
2. Before editing, say which files you will touch. For anything in `functions/` or Section 9 of the PRD, write a plan first and wait for approval.
3. Do not touch files outside the task. No drive-by refactors, renames, or formatting sweeps.
4. Do not add dependencies that are not in PRD Section 2. If you think one is needed, ask and explain why.
5. Keep functions short. Add a one-line comment above each exported function.
6. Use TypeScript types from the PRD (`Product`, `BagItem`, order object). Do not invent new shapes.
7. After finishing: run the build and tests, then report (see Reporting).

## Hard security rules (never break)
- NEVER put premium products, premium images, PINs, or secrets in the repo, the build output, or client code.
- NEVER decide access on the client. Access is checked only in Functions, using the signed HttpOnly cookie.
- NEVER store prices or names in the bag. Look them up at render time.
- NEVER hardcode secrets, passwords, or private URLs. Use env vars from `.env.example` names only.
- NEVER make the R2 premium bucket public or add a public domain to it.
- NEVER log PINs, cookies, or secrets.
- PIN redemption must be one atomic SQL statement (`UPDATE ... WHERE used_at IS NULL`) and check `meta.changes`.
- Premium and PIN errors use one generic message. Do not reveal whether a PIN exists or was used.
- Compare secrets and signatures in constant time.

## Frontend rules
- All product data goes through `src/lib/api.ts`. Components never import `products.json` directly.
- Mobile first. Check every page at 375px width. No horizontal scroll. Tap targets at least 44px.
- Use only the design tokens (colors, spacing, radius, font) defined in the Tailwind theme.
- Every image has alt text. Every form field has a label. Every interactive element has a visible focus state.
- Use shadcn/ui primitives before writing custom components.

## Reporting (end of every task)
Reply with:
1. Files changed (list).
2. What now works, in one or two lines.
3. What you ran to verify, and the result.
4. What you could NOT verify.
5. Any decisions you made that are not in the PRD.
Do not claim something works unless you ran it.

## When stuck
- Quote the exact error. Do not guess in a loop. After two failed attempts at the same fix, stop and explain what you tried and what you think the cause is.
