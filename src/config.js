/**
 * Global Configuration for Serverless WhatsApp E-Commerce
 * Tailored for Ghanaian Cedis (GHS), static hosting, and no-backend architecture.
 */

export const CONFIG = {
  // Store Branding
  STORE_NAME: "ATELIER NOIR",
  STORE_CITY: "Accra",
  STORE_COUNTRY: "Ghana",
  CURRENCY_CODE: "GHS",
  CURRENCY_LOCALE: "en-GH",
  
  // WhatsApp Merchant Phone Number (International format without '+' or spaces)
  // Replace with the client's actual Ghanaian WhatsApp Business line (e.g. 233501234567)
  WHATSAPP_PHONE: "233540000000",
  
  // Google Sheets Published CSV URL
  // To publish: In Google Sheets -> File -> Share -> Publish to web -> Format: CSV
  SHEET_CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRL5Z7K-placeholder/pub?gid=0&single=true&output=csv",
  
  // Free Database Webhook (Google Apps Script Web App, Zapier, or Make.com)
  // Request is dispatched with mode: 'no-cors' so no CORS pre-flight is required
  WEBHOOK_URL: "https://script.google.com/macros/s/AKfycbw_PLACEHOLDER_WEBHOOK_URL/exec",
  
  // VIP Mockup Pass Configuration
  VIP_PIN: "MOCKUP2026",
  VIP_ACCESS_PRICE_GHS: 50,
  
  // LocalStorage Keys
  STORAGE_KEYS: {
    CART: "atelier_noir_cart_v1",
    ORDER_HISTORY: "atelier_noir_orders_v1",
    UNLOCKED_MOCKUPS: "atelier_noir_unlocked_mockups_v1",
    CUSTOM_SHEET_URL: "atelier_noir_custom_sheet_url_v1",
  },

  // Fallback / Initial Catalog (Used if Google Sheet is unreachable or before custom sheet is configured)
  FALLBACK_PRODUCTS: [
    {
      id: "AN-001",
      name: "Architectural Heavyweight Tee",
      category: "Tops",
      price: 280.00,
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80",
      description: "320 GSM combed heavyweight cotton. Dropped shoulder boxy silhouette.",
    },
    {
      id: "AN-002",
      name: "Structured Minimalist Hoodie",
      category: "Outerwear",
      price: 550.00,
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
      description: "Double-faced French terry with double-layered rigid hood and concealed seams.",
    },
    {
      id: "AN-003",
      name: "Pleated Relaxed Trousers",
      category: "Bottoms",
      price: 420.00,
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80",
      description: "Deep double front pleats with tapered drape and matte black hardware.",
    },
    {
      id: "AN-004",
      name: "Noir Leather Crossbody Pouch",
      category: "Accessories",
      price: 360.00,
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80",
      description: "Full-grain vegetable tanned black calfskin with military nylon webbing strap.",
    },
    {
      id: "AN-005",
      name: "Tailored Overshirt Jacket",
      category: "Outerwear",
      price: 620.00,
      image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1000&q=80",
      description: "Dense Japanese cotton-nylon twill with concealed horn button placket.",
    },
    {
      id: "AN-006",
      name: "Tactical Monogram Cap",
      category: "Accessories",
      price: 180.00,
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1000&q=80",
      description: "Water-repellent ripstop shell with debossed tonal branding and magnetic clip.",
    },
    {
      id: "AN-007",
      name: "Raw Selvedge Straight Denim",
      category: "Bottoms",
      price: 580.00,
      image: "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1000&q=80",
      description: "14.5oz unwashed rigid black warp/black weft selvedge denim.",
    },
    {
      id: "AN-008",
      name: "Mercerized Crewneck Knit",
      category: "Tops",
      price: 390.00,
      image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80",
      description: "Extra-fine merino wool blend with subtle micro-rib texture.",
    },
  ],

  // VIP Mockup Items
  PREMIUM_MOCKUPS: [
    {
      id: "VIP-01",
      name: "FW26 Modular Ballistic Parka",
      category: "Pending Slot / Prototype",
      edition: "Edition of 15 Worldwide",
      releaseQuarter: "Q4 Launch",
      blurredImage: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=20",
      revealedImage: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=95",
      techSpecs: [
        "Waterproof breathable 3-layer laminated membrane",
        "Magnetic fidlock modular utility harness",
        "Concealed thermal titanium mesh lining",
      ],
    },
    {
      id: "VIP-02",
      name: "Sculptural Calfskin Trench Coat",
      category: "Pending Slot / Prototype",
      edition: "Handmade Atelier Custom (Accra)",
      releaseQuarter: "Limited Run",
      blurredImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=20",
      revealedImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=95",
      techSpecs: [
        "Single-hide precision laser pattern cutting",
        "Matte charcoal waxed surface treatment",
        "Custom gunmetal hardware cast in Osu",
      ],
    },
    {
      id: "VIP-03",
      name: "Kinetic Geometry Flight Jacket",
      category: "Pending Slot / Prototype",
      edition: "Experimental Capsule 02",
      releaseQuarter: "Pre-production",
      blurredImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=20",
      revealedImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=95",
      techSpecs: [
        "Articulated elbow gussets for full dynamic range",
        "Ultralight ripstop shell weighing under 340g",
        "Dual waterproof storm zip enclosure",
      ],
    },
  ],
};
