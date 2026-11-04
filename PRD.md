# PRD: WhatsApp Commerce Store with Premium PIN Gate

Version 1.0 | Audience: the developer and the AI coding agent (Antigravity) | Read this whole document before writing any code.

## 0. How to use this document

- Build in the order of Section 14 (Milestones). Do not skip ahead.
- Every section ends with acceptance criteria. A task is done only when all its criteria pass.
- If something is not specified here, choose the simplest option and write the decision in `DECISIONS.md`.
- Anything marked **MUST** is mandatory. **MUST NOT** is a hard ban.
- Placeholders in `{CURLY_BRACES}` are filled in by the owner (see Section 1.3).

## 1. Product overview

### 1.1 What we are building
A mobile-first online store for a friend's brand. There is no online payment for normal products. The customer adds items to a bag, fills in contact details, and taps **Send order on WhatsApp**. A pre-written message opens in WhatsApp addressed to the owner. The owner then calls the customer to confirm, and arranges payment and delivery offline.

There is also a **Premium section**: a private catalog. A customer pays offline (bank transfer or similar), sends proof of payment on WhatsApp, and the owner replies with a **one-time PIN**. The customer enters the PIN on the site and gets access to the premium catalog for 30 days. They can then place pre-orders using the same bag and WhatsApp flow.

### 1.2 Goals
1. Customers can browse, add to bag, and send an order on WhatsApp in under 2 minutes on a phone.
2. Every order is also logged to a Google Sheet automatically.
3. Premium catalog data and images are **never** reachable without a valid PIN-derived cookie.
4. Total running cost: only the domain (Namecheap). Everything else on free tiers.
5. The owner can generate PINs and mark premium products sold out without touching code.

### 1.3 Owner-supplied values (placeholders until provided)
| Name | Meaning | Example |
|---|---|---|
| `{BRAND_NAME}` | Store name | Acme Wear |
| `{BRAND_COLOR}` | Primary color (hex) | #1F6FEB |
| `{CURRENCY_CODE}` | ISO currency | USD |
| `{CURRENCY_SYMBOL}` | Display symbol | $ |
| `{WHATSAPP_NUMBER}` | International format, digits only, no plus | 15551234567 |
| `{PREMIUM_PRICE}` | Price to unlock premium | 20 |
| `{PAYMENT_INSTRUCTIONS}` | How to pay for premium | Bank details text |
| `{CALL_WINDOW}` | Promise on confirmation page | within 24 hours |
| `{PRODUCT_TYPE}` | What the brand sells | Clothing |

### 1.4 Out of scope for v1 (MUST NOT build)
User accounts and logins, online card payments, reviews, wishlist, discount codes, search, image zoom, multi-language, automated stock decrement, WhatsApp Business API.

## 2. Tech stack (fixed, do not substitute)

| Layer | Choice |
|---|---|
| Framework | Astro (static output) with React islands |
| Styling | Tailwind CSS |
| UI primitives | shadcn/ui (dialog, sheet, toast, accordion, button, input) |
| State | `nanostores` with `@nanostores/persistent` for the bag (localStorage) |
| Hosting | Cloudflare Pages |
| Backend | Cloudflare Pages Functions (folder `functions/`) |
| Database | Cloudflare D1 (SQLite) for PINs and premium products |
| Private files | Cloudflare R2 (private bucket) for premium images |
| Order log | Google Apps Script web app writing to a Google Sheet |
| DNS | Namecheap domain, nameservers pointed to Cloudflare |
| Language | TypeScript everywhere |

## 3. Repository layout

```
/
  PRD.md
  DECISIONS.md
  astro.config.mjs
  wrangler.toml
  package.json
  .env.example          (names only, no values)
  .gitignore            (MUST include .env, .dev.vars, /private)
  migrations/
    0001_init.sql
  public/
    products/           (PUBLIC product images only)
  src/
    config.ts           (public config: brand, currency, WhatsApp number)
    data/
      products.json     (PUBLIC catalog, placeholders at first)
    lib/
      api.ts            (getProducts, getPremiumProducts, redeemPin, submitOrder)
      bag.ts            (bag store and helpers)
      whatsapp.ts       (message builder)
      format.ts         (money formatting)
    components/         (React islands and Astro components)
    layouts/Base.astro
    pages/              (routes, Section 5)
  functions/
    api/
      redeem.ts
      premium/products.ts
      premium/image/[key].ts
      order-log.ts
      admin/pins.ts
      admin/products.ts
    _lib/
      auth.ts           (cookie sign and verify)
      admin.ts          (admin check)
      ratelimit.ts
  apps-script/
    Code.gs             (copy of the Google Apps Script)
```

**MUST NOT** commit: real premium products, real PINs, secrets, premium images, or any `.env` file.

## 4. Data models

### 4.1 Public product (`src/data/products.json`)
```ts
type Product = {
  id: string;            // slug, unique, e.g. "classic-tee"
  name: string;
  category: string;      // e.g. "tops"
  price: number;         // in {CURRENCY_CODE}
  description: string;
  images: string[];      // paths under /products/, first is the cover
  sizes?: string[];      // omit if not applicable
  soldOut: boolean;
  featured: boolean;
};
```
At the start, create 8 placeholder products with placeholder images (any gray images). Use 3 categories, 3 featured products, and 1 sold out.

### 4.2 Premium product (D1 table `premium_products`)
Same fields as `Product`, but `images` holds **R2 object keys** (not URLs), stored as JSON text.

### 4.3 Bag item (localStorage key `bag_v1`)
```ts
type BagItem = {
  productId: string;
  size?: string;
  qty: number;           // 1 to 10
  premium: boolean;
};
```
**MUST NOT** store price or name in the bag. Prices and names are looked up from the product data at render time, so tampered storage cannot change prices.

### 4.4 Database migration (`migrations/0001_init.sql`)
```sql
CREATE TABLE pins (
  code TEXT PRIMARY KEY,        -- stored uppercase, format XXXX-XXXX
  created_at INTEGER NOT NULL,  -- unix ms
  used_at INTEGER,              -- null until redeemed
  note TEXT                     -- owner label, e.g. customer name
);

CREATE TABLE premium_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL,
  description TEXT NOT NULL,
  images TEXT NOT NULL,         -- JSON array of R2 keys
  sizes TEXT,                   -- JSON array or null
  sold_out INTEGER NOT NULL DEFAULT 0,
  featured INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE attempts (
  ip TEXT NOT NULL,
  kind TEXT NOT NULL,           -- 'pin', 'admin', 'order'
  at INTEGER NOT NULL
);
CREATE INDEX idx_attempts ON attempts(ip, kind, at);
```

## 5. Pages and routes

All pages use `Base.astro` (header, footer, bag drawer, toast area, WhatsApp floating button).

| Route | Purpose |
|---|---|
| `/` | Home |
| `/shop` | All products, category filter |
| `/shop/[category]` | Filtered view (static, generated from data) |
| `/product/[id]` | Product detail |
| `/bag` | Full bag page with customer form and checkout |
| `/confirmation` | Order sent screen |
| `/premium` | Locked state, PIN entry, premium catalog |
| `/premium/[id]` | Premium product detail (shell, loads data after access) |
| `/about` | Brand story |
| `/contact` | Contact and FAQ (accordion) |
| `/policies` | Shipping, returns, privacy in one page |
| `/admin` | Owner tools (Section 10) |
| `404` | Not found page |

### 5.1 Header
Logo text `{BRAND_NAME}` on the left. Links: Shop, Premium, About, Contact. Bag icon on the right with a count badge showing total quantity. On mobile, links collapse into a hamburger sheet.

### 5.2 Home (`/`)
Sections in order:
1. **Hero:** headline, one-line subtext, a "Shop now" button.
2. **How ordering works:** 4 steps with icons: Add to bag, Send order on WhatsApp, We call to confirm, Pay and receive.
3. **Featured products:** products where `featured` is true, max 4, as a grid.
4. **Categories:** one card per category linking to `/shop/[category]`.
5. **Premium teaser:** short pitch and a "Learn more" link to `/premium`.
6. **Brand strip:** short story and a link to `/about`.

### 5.3 Shop (`/shop`)
- Category chips at the top (All plus each category). Clicking navigates to the category route.
- Product grid: 2 columns on mobile, 3 on tablet, 4 on desktop.
- **Product card:** cover image, name, price, a "Sold out" badge if `soldOut`. The whole card links to the product page.

### 5.4 Product detail (`/product/[id]`)
- Image gallery: large image plus thumbnails (tap to swap). No zoom.
- Name, price, description.
- Size picker (only if `sizes` exists). Selecting a size is required before adding.
- Quantity stepper (1 to 10).
- **Add to bag** button. Disabled and labelled "Sold out" when `soldOut`.
- On mobile, the Add to bag button sticks to the bottom of the screen.
- Small "Ask about this product on WhatsApp" link that opens `wa.me` with the text `Hi, I have a question about {product name}`.
- On add: show a toast "Added to bag" and open the bag drawer.

### 5.5 Bag drawer and `/bag`
- List of items: image, name, size, price, quantity stepper, remove button.
- Subtotal.
- Empty state: message and a "Continue shopping" button.
- The drawer has a "Checkout" button that goes to `/bag`.
- `/bag` shows the same list plus the **customer form** (Section 7).

### 5.6 Confirmation (`/confirmation`)
Message: "Your order was sent. Expect a call {CALL_WINDOW}." Then the 4-step process again with step 2 checked. Also show: "The final total is confirmed on our call." A button back to Shop.

### 5.7 Premium (`/premium`)
This page is an **empty shell**. It has three states:
1. **Locked** (default, also while checking): headline, bullet list of what premium includes, price `{PREMIUM_PRICE}`, `{PAYMENT_INSTRUCTIONS}`, a **Request access on WhatsApp** button, and an **I have a PIN** button.
2. **PIN entry:** one input, a Submit button, error messages, loading state.
3. **Unlocked:** the premium grid, identical in design to Shop, loaded from `getPremiumProducts()`.

On page load, call `getPremiumProducts()`. If it returns 401, show Locked. If 200, show Unlocked. **MUST NOT** render any premium data in static HTML.

The **Request access** message is:
```
Hi {BRAND_NAME}! I'd like to unlock the Premium catalog.
I have paid {PREMIUM_PRICE} {CURRENCY_CODE}. Proof of payment attached.
Name:
```

### 5.8 Static pages
`/about`, `/contact` (with an FAQ accordion of at least 6 questions), `/policies`. Plain text from placeholders. The Contact page shows a WhatsApp button.

### Acceptance criteria (Section 5)
- All routes load without console errors.
- At 375px width, nothing scrolls horizontally.
- Every interactive element is reachable by keyboard and has a visible focus ring.
- Every image has alt text.
- Lighthouse mobile performance is 85 or higher.

## 6. Design system

- **Font:** one family (Inter or the brand font). Sizes: 14, 16, 20, 28, 40.
- **Colors:** one primary `{BRAND_COLOR}`, one neutral dark, one neutral light, one error red. Define as Tailwind theme tokens. No other colors.
- **Spacing:** use Tailwind spacing steps 2, 4, 6, 8, 12, 16 only.
- **Corners:** one radius value everywhere.
- **Buttons:** primary (filled) and secondary (outline). Minimum height 44px for tap targets.
- **Images:** WebP, max 1200px wide, `loading="lazy"` except the hero. Always set width and height to avoid layout shift.
- **Style reference:** the owner will supply one reference website. Match its layout and spacing, not its branding.

## 7. Cart and WhatsApp checkout (core feature)

### 7.1 Bag logic (`src/lib/bag.ts`)
Functions: `addItem`, `removeItem`, `setQty`, `clearBag`, `totalQty`, `subtotal(products)`.
- Same `productId` plus `size` plus `premium` merges into one line and adds quantity.
- Quantity clamps between 1 and 10.
- If a bag line refers to a product that no longer exists or is sold out, show it struck through with a notice and exclude it from the total.

### 7.2 Customer form (on `/bag`)
Fields (all required unless noted):
- Full name (min 2 characters)
- Phone number (digits, spaces, plus allowed; min 7 digits). Helper text: "We will call this number to confirm."
- Delivery address (min 10 characters)
- Notes (optional, max 300 characters)

Validate on submit with inline error messages under each field. Save name, phone, and address in localStorage (`customer_v1`) so returning customers do not retype them.

### 7.3 Submit flow (step by step)
1. Customer taps **Review order**. Validate the form. Stop on errors.
2. Show a **preview dialog** containing the exact message text, an Edit button, and a **Send on WhatsApp** button.
3. On **Send on WhatsApp**:
   1. Build the order object (Section 7.5).
   2. Call `submitOrder(order)`, which POSTs to `/api/order-log`. Wait up to 4 seconds. **If it fails or times out, continue anyway** (the WhatsApp message is the source of truth; log the failure to the console).
   3. Open the `wa.me` link with `window.open(url, "_blank")`. If the popup is blocked (common on iOS Safari), fall back to `window.location.href = url`.
   4. Clear the bag and navigate to `/confirmation`.

### 7.4 Message format (`src/lib/whatsapp.ts`)
```
Hi {BRAND_NAME}! I'd like to place an order.
Order ref: {ORDER_REF}

1. {name} ({size}) x{qty} - {symbol}{lineTotal}
2. ...

Total: {symbol}{total}

Name: {customerName}
Phone: {customerPhone}
Address: {customerAddress}
Notes: {notes}
```
If any line is premium, add the line `Type: PREMIUM PRE-ORDER` under the order ref. Link format: `https://wa.me/{WHATSAPP_NUMBER}?text={encodeURIComponent(message)}`.

`{ORDER_REF}` is `ORD-` plus 6 random uppercase letters and digits, generated client-side. It lets the owner match the chat to the Sheet row.

### 7.5 Order object sent to `/api/order-log`
```ts
{
  ref: string,
  createdAt: string,        // ISO
  type: "standard" | "premium",
  customer: { name, phone, address, notes },
  items: [{ productId, name, size, qty, unitPrice, lineTotal }],
  total: number
}
```

### 7.6 Trust rule
Prices in the WhatsApp text can be edited by the customer before sending. The owner MUST confirm the total on the call.

### Acceptance criteria (Section 7)
- Adding the same product and size twice produces one line with qty 2.
- Clearing localStorage and reloading shows an empty bag.
- Editing `bag_v1` in devtools to change a price has no effect (prices are not stored).
- With the network disabled, the flow still opens WhatsApp and reaches `/confirmation`.
- The `wa.me` link opens correctly with a multi-line message containing `&` and `#` characters in the address.
- An order appears as a row in the Google Sheet within 10 seconds.

## 8. Order logging (Google Sheet)

### 8.1 Why through a Function
The Apps Script URL is public if the browser calls it directly, so anyone could spam your sheet. Instead the browser calls `/api/order-log`, and the Function forwards the data to Apps Script with a **shared secret** that only the Function knows.

### 8.2 `/api/order-log` (POST)
1. Reject if the body is larger than 10 KB.
2. Validate fields (types, lengths, qty 1 to 10, items max 30).
3. Rate limit: max 10 per IP per hour (Section 11).
4. Forward JSON plus `secret: env.SHEET_SECRET` to `env.APPS_SCRIPT_URL`.
5. Return `204` on success, `502` if the script fails.

### 8.3 Apps Script (`apps-script/Code.gs`)
- `doPost(e)`: parse JSON, **reject if `secret` does not match** the value in Script Properties, then append one row per order with columns: Received At, Ref, Type, Name, Phone, Address, Notes, Items (text summary), Total, Status (default "New").
- Deploy as a web app, execute as owner, access: anyone. The secret check is the protection.
- The owner updates the Status column manually (New, Called, Confirmed, Shipped, Cancelled).

### Acceptance criteria (Section 8)
- A request without the secret to the Apps Script URL appends nothing.
- 11 order-log calls from one IP in an hour: the 11th returns 429.

## 9. Premium gate (security critical)

**Read this section twice. This is the only part where a mistake leaks money or data.**

### 9.1 Core rules
1. Premium data exists only in D1 and R2. It is **never** in the repo, the build output, or any public URL.
2. All checks happen in Functions. Client code never decides access.
3. A PIN is single-use and burned atomically.
4. Access is held by a signed, HttpOnly cookie.

### 9.2 PIN format
8 characters from the alphabet `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (no 0, O, 1, I), shown as `XXXX-XXXX`. Generated with `crypto.getRandomValues`. Normalize input by uppercasing and stripping spaces and hyphens, then re-insert the hyphen before lookup.

### 9.3 Cookie
Name `access`. Value `{expiryUnixMs}.{signature}` where signature is HMAC-SHA256 of the expiry string using `env.COOKIE_SECRET`, base64url encoded. Flags: `HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000` (30 days). Verification (`functions/_lib/auth.ts`): split, recompute the signature, compare in constant time, check that the expiry is in the future.

### 9.4 `/api/redeem` (POST, body `{ pin: string }`)
1. Rate limit (Section 11): max 5 failed attempts per IP per 15 minutes, then 429.
2. Normalize the PIN.
3. Run one atomic statement:
   `UPDATE pins SET used_at = ? WHERE code = ? AND used_at IS NULL`
4. If `meta.changes` is 0: record a failed attempt and return `401 {"error":"Invalid or already used PIN"}`. Use the same message for unknown and used PINs.
5. If 1: set the cookie and return `200 {"ok":true}`.

### 9.5 `/api/premium/products` (GET)
1. Verify the cookie. If missing or invalid, return `401` with no body details.
2. Read all rows from `premium_products`. Convert image R2 keys into URLs of the form `/api/premium/image/{key}`.
3. Return JSON. Set `Cache-Control: private, no-store`.

### 9.5b `/api/premium/image/[key]` (GET)
Verify the cookie, then stream the object from the private R2 bucket binding. Return `404` for missing keys and `401` without access. Set `Cache-Control: private, max-age=3600`. **The R2 bucket MUST NOT have public access or a public domain enabled.**

### 9.6 Front-end behavior
- `getPremiumProducts()` calls `/api/premium/products` with `credentials: "same-origin"`.
- 401 means locked. 200 means render the grid.
- Premium products added to the bag have `premium: true`. The bag looks up their data from the premium response, so the bag page for premium items also needs access. If the cookie expired, show "Your premium access expired. Request a new PIN."

### 9.7 Honest limits (copy into `DECISIONS.md`)
- A paying customer can screenshot or share what they see. The gate stops non-payers only.
- A cookie can be copied to another device. Acceptable for v1.
- Switching device or clearing cookies means the owner issues a new PIN.

### Acceptance criteria (Section 9)
- Incognito window: `curl /api/premium/products` returns 401.
- Incognito window: `curl /api/premium/image/anything` returns 401.
- Search the built `dist/` folder for any premium product name: zero matches.
- Redeem the same PIN twice: first 200, second 401.
- Fire 2 simultaneous redeem requests with the same PIN: exactly one succeeds.
- Edit the cookie value in devtools: the next request returns 401.
- The 6th wrong PIN in 15 minutes returns 429.

## 10. Admin tools

Route `/admin` (a React island page, `noindex`).

### 10.1 Admin authentication
- Env var `ADMIN_PASSWORD` (long, random). The admin page shows a password field and sends it in the header `x-admin-key` on each admin API call. Each admin Function compares it in constant time and returns 401 on mismatch.
- Rate limit admin attempts the same way as PIN attempts.
- Optionally also protect `/admin*` and `/api/admin/*` with Cloudflare Access (free for up to 50 users).

### 10.2 Features
1. **Generate PIN:** optional note field, button "Generate". Calls `POST /api/admin/pins`, shows the new PIN in large text with a **Copy** button. Under it, a list of the last 50 PINs with note, created date, and Used/Unused status.
2. **Premium products:** list, add, edit, delete, mark sold out. Form fields match Section 4.2. Image upload goes to R2 through `POST /api/admin/products` (multipart), which returns the stored key.
3. **Public products:** for v1, the owner edits `src/data/products.json` through GitHub. Not in the admin.

### Acceptance criteria (Section 10)
- Admin API without the header returns 401.
- A generated PIN works on `/premium` exactly once.

## 11. Rate limiting (`functions/_lib/ratelimit.ts`)

Use the D1 `attempts` table. `check(ip, kind, limit, windowMs)` counts rows for that IP and kind in the window. `record(ip, kind)` inserts a row. Get the IP from the `CF-Connecting-IP` header. Delete rows older than 24 hours occasionally (on 1 in 20 calls).

## 12. Environment variables and bindings

List names in `.env.example`; real values go in the Cloudflare dashboard (secrets) and `.dev.vars` locally (gitignored).

| Name | Type | Purpose |
|---|---|---|
| `COOKIE_SECRET` | secret | 32+ random bytes, base64 |
| `ADMIN_PASSWORD` | secret | Admin login |
| `APPS_SCRIPT_URL` | secret | Deployed script URL |
| `SHEET_SECRET` | secret | Shared with Apps Script |
| `DB` | D1 binding | Database |
| `PREMIUM_BUCKET` | R2 binding | Private images |

Public (non-secret) config such as `{WHATSAPP_NUMBER}`, `{BRAND_NAME}`, `{CURRENCY_SYMBOL}` goes in `src/config.ts`.

## 13. SEO, performance, accessibility

- Each page has a unique `<title>` and meta description.
- Open Graph tags (title, description, image) on Home, Shop, and Product pages so WhatsApp link previews look good.
- `sitemap.xml` generated by Astro, excluding `/admin`, `/premium`, `/bag`, `/confirmation`.
- `robots.txt` disallows `/admin` and `/api`.
- `/premium` and `/admin` have `<meta name="robots" content="noindex">`.
- Color contrast meets WCAG AA. All form fields have labels. Toasts use `aria-live`.

## 14. Milestones (build in this order)

**M1: Skeleton (day 1)**
Astro + React + Tailwind + shadcn set up. Base layout, header, footer, config file, placeholder `products.json`. Deploy to Cloudflare Pages and connect the domain. Done when the site loads on the real domain.

**M2: Browsing (days 2-3)**
Home, Shop, category routes, product detail, 404. Done when all Section 5 acceptance criteria for these pages pass.

**M3: Bag and WhatsApp (days 3-4)**
Bag store, drawer, `/bag`, form, preview dialog, message builder, confirmation page. Done when the Section 7 criteria pass (except the Sheet).

**M4: Order log (day 5)**
Apps Script, `/api/order-log`, rate limiting. Done when the Section 8 criteria pass.

**M5: Premium gate (days 6-7)**
D1 migration, redeem, cookie, premium endpoints, R2 images, premium page shell. Done when every Section 9 criterion passes.

**M6: Admin (day 8)**
Admin auth, PIN generator, premium product manager. Done when the Section 10 criteria pass.

**M7: Polish and launch (days 9-10)**
Static pages, SEO, accessibility pass, Lighthouse, real content swap, final security test. Done when the launch checklist below is fully ticked.

## 15. Launch checklist

- [ ] Real products and images replaced; placeholders removed
- [ ] Premium products loaded in D1 only; `git log` and `dist/` contain none of them
- [ ] R2 bucket confirmed private
- [ ] All secrets set in Cloudflare; none in the repo (search for `secret`, `password`, `key`)
- [ ] `.dev.vars` is gitignored
- [ ] Incognito test of all Section 9 criteria on the live domain
- [ ] Test order from a real phone arrives on WhatsApp and in the Sheet
- [ ] Owner has generated a PIN and unlocked premium on a phone
- [ ] Owner trained: how to generate PINs, update Status in the Sheet, mark items sold out
- [ ] Backup: export D1 once and keep a copy

## 16. Rules for the AI coding agent

1. Work one milestone at a time. Finish and verify before starting the next.
2. One component or function per prompt where possible.
3. All product data access goes through `src/lib/api.ts`. UI components never import `products.json` directly.
4. **MUST NOT** add client-side checks as a substitute for server checks.
5. **MUST NOT** hardcode secrets, passwords, PINs, or URLs of private services.
6. **MUST NOT** add libraries that are not listed in Section 2 without writing the reason in `DECISIONS.md`.
7. After building any page, open it at 375px width and fix overflow, tiny tap targets, and missing focus states.
8. After M5, run every Section 9 acceptance test and paste the results into `DECISIONS.md`.
9. If a requirement is unclear, choose the simplest option, record it in `DECISIONS.md`, and continue.
10. Keep functions short. Add a one-line comment above each exported function explaining what it does.

## 17. Glossary

- **Island:** an interactive React component inside an otherwise static Astro page.
- **Function:** a small server-side script that runs on Cloudflare on request (files in `functions/`).
- **D1:** Cloudflare's free SQLite database.
- **R2:** Cloudflare's file storage; here it is private.
- **HttpOnly cookie:** a cookie that browser JavaScript cannot read, only the server can.
- **Atomic:** happens completely or not at all, so two users cannot redeem the same PIN at once.
