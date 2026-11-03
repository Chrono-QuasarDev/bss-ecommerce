# B.S.S — Bofoo Style Spectrum

Local Soul, Global Vision. A youth streetwear storefront built with **React**, **Vite**, and **Tailwind CSS**.

---

## ⚡ Architecture Highlights

1. **Monochromatic Brutalist/Minimalist Design**: Strictly black (`#0a0a0a`), white (`#ffffff`), and neutral grays with crisp borders, zero gradients, zero heavy drop shadows, and color-inverting hover states.
2. **Google Sheets CMS**: Real-time product inventory is fetched and parsed from a published Google Sheets CSV URL using a custom RFC-compliant parser. If offline, it smoothly falls back to a built-in atelier catalog.
3. **Instant Client-Side Filtering**: Sticky horizontal scrollbar that filters products across categories instantly in-memory without server roundtrips.
4. **Slide-Out Cart with `localStorage`**: Persists cart items across refreshes, supporting incremental quantity adjustments and line totals.
5. **The "VIP Pass" Flow**: Unreleased CAD prototypes are rendered heavily blurred. Customers can purchase access for `GH₵ 50` via WhatsApp or unlock directly with a VIP PIN (default: `MOCKUP2026`), persisting the unlocked state in `localStorage`.
6. **The WhatsApp + Webhook Tracking Handoff**:
   - Generates a short alphanumeric Order ID (e.g. `ORD-8F92A`).
   - Dispatches an asynchronous `POST` (`mode: 'no-cors'`) to a free webhook (e.g. Google Apps Script) as a free order logging database.
   - Shows a confirmation UI with a "Copy Order ID" button.
   - Automatically redirects the customer to WhatsApp with the encoded order string:
     ```
     Order Request:
     Order ID: [ID]
     1x Item A (GH₵ 200.00)
     2x Item B (GH₵ 100.00)
     Total: GH₵ 400.00
     ```
   - Clears the cart and logs the order to the customer's local **Order History**.

---

## 🛠️ Free Database Setup (Google Apps Script)

You do not need to pay for Supabase, Firebase, or MongoDB. You can use Google Sheets as your free database:

1. Open a new Google Sheet named `Store Orders`.
2. Navigate to **Extensions > Apps Script**.
3. Replace the code with:
   ```javascript
   function doPost(e) {
     try {
       var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
       var data = JSON.parse(e.postData.contents);
       sheet.appendRow([
         new Date(),
         data.orderId,
         data.totalAmount,
         data.currency,
         JSON.stringify(data.items),
         data.orderText,
       ]);
       return ContentService.createTextOutput("OK").setMimeType(
         ContentService.MimeType.TEXT,
       );
     } catch (err) {
       return ContentService.createTextOutput(
         "ERROR: " + err.message,
       ).setMimeType(ContentService.MimeType.TEXT);
     }
   }
   ```
4. Click **Deploy > New Deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. Copy the Web App URL into `VITE_WEBHOOK_URL` in your local `.env` file.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create a local environment file from the example, then set the store values
cp .env.example .env

# Start local development server
npm run dev

# Build optimized production bundle
npm run build
```

Vite embeds every `VITE_*` value in the client bundle. Treat these as public configuration, not secrets. In particular, `VITE_VIP_PIN` is visible to anyone who can access the site and only provides a demo lock; use server-side verification for real access control. Set the same `VITE_*` variables in your hosting provider's build environment for production.
