# PROGRESS

Last updated: 2026-11-04
Rule: update this file at the end of every task. Be honest. "Partial" is a valid status.

## Current milestone
M1 (replace with the milestone you are on)

## Status by milestone
Use: [x] done and verified, [~] partial (say what is missing), [ ] not started.

### M1 Skeleton
- [~] Astro + React + Tailwind installed (shadcn components pending)
- [ ] Base layout, header, footer
- [x] `src/config.ts` with brand, currency, WhatsApp number
- [x] Placeholder `products.json` (8 products, 3 categories)
- [ ] Deployed to Cloudflare Pages
- [ ] Domain connected

### M2 Browsing
- [ ] Home
- [ ] Shop and category routes
- [ ] Product detail (gallery, size, qty, add to bag)
- [ ] 404 page

### M3 Bag and WhatsApp
- [x] Bag store (`bag.ts`)
- [ ] Bag drawer and `/bag`
- [ ] Customer form with validation
- [ ] Preview dialog and message builder
- [ ] Confirmation page

### M4 Order log
- [ ] Apps Script with secret check
- [ ] `/api/order-log` with validation and rate limit

### M5 Premium gate
- [x] D1 migration (`migrations/0001_init.sql`)
- [ ] `/api/redeem` (atomic)
- [ ] Cookie sign and verify
- [ ] `/api/premium/products`
- [ ] `/api/premium/image/[key]` and private R2
- [ ] Premium page shell (locked, PIN entry, unlocked)
- [ ] Section 9 acceptance tests all pass

### M6 Admin
- [ ] Admin auth
- [ ] PIN generator
- [ ] Premium product manager

### M7 Polish and launch
- [ ] Static pages
- [ ] SEO and Open Graph
- [ ] Accessibility pass
- [ ] Lighthouse mobile 85+
- [ ] Launch checklist (PRD Section 15)

## Known issues
- (none yet)

## Decisions
See `DECISIONS.md`.

## Next task
Complete M1 skeleton: Base layout (Base.astro), Header, Footer, and shadcn UI setup.
