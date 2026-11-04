# Architectural Decisions (DECISIONS.md)

## 1. Brand Identity & Currency
- Retained the Ghanaian streetwear brand identity: **B.S.S (Bofoo Style Spectrum)** based in Accra, Ghana.
- Currency set to `GHS` (`GH₵`). WhatsApp recipient number configured as `233206764888`.
- Premium catalog unlock price set to `GH₵ 50`.

## 2. Framework & Architecture Migration
- Migrated from Vite React SPA to **Astro (static output) + React islands** and **Cloudflare Pages Functions**.
- Local storage state management implemented with `nanostores` and `@nanostores/persistent` under key `bag_v1`.
- Safe SSR guards implemented for `localStorage` during static site generation (`astro build`).

## 3. Scope Adjustments & Approved Extensions
- **Search Bar**: Removed from the storefront and category filter bar to strictly comply with PRD Section 1.4 (*"MUST NOT build: ... search"*).
- **Order History**: Retained as a client-side utility island (`OrderHistoryModal`) saving completed WhatsApp order references to `localStorage` for returning customer convenience.
- **Product Presentation**: Multi-page route `/product/[id]` is the primary detail view (PRD Section 5.4); lightweight quick-view modal preserved as an interactive island option.
- **Sizing Model**: Followed PRD Section 4.1 (`sizes?: string[]` only), omitting separate color/SKU variant trees for v1 simplicity.

## 4. Honest Security Limits (PRD Section 9.7)
- A paying customer can screenshot or share what they see. The gate stops non-payers only.
- A cookie can be copied to another device. Acceptable for v1.
- Switching devices or clearing cookies means the owner must issue a new PIN.
- Premium items and images are stored strictly in Cloudflare D1 and private Cloudflare R2; zero premium data is included in the static build or public repo.
