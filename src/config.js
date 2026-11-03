/**
 * Global Configuration for ATELIER NOIR
 * Avant-garde serverless e-commerce curated in Accra, Ghana.
 */

export const CONFIG = {
  STORE_NAME: "ATELIER NOIR",
  STORE_SUBTITLE: "Accra Archive / Direct Concierge",
  STORE_CITY: "Accra",
  STORE_COUNTRY: "Ghana",
  CURRENCY_CODE: "GHS",
  CURRENCY_LOCALE: "en-GH",
  
  // Ghanaian phone number in international format without '+' or spaces
  WHATSAPP_PHONE: "233540000000",
  
  // Published Google Sheet CSV URL
  SHEET_CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRL5Z7K-placeholder/pub?gid=0&single=true&output=csv",
  
  // Free Database Webhook (Google Apps Script Web App / Zapier / Make)
  WEBHOOK_URL: "https://script.google.com/macros/s/AKfycbw_PLACEHOLDER_WEBHOOK_URL/exec",
  
  // VIP Mockup Pass Configuration
  VIP_PIN: "MOCKUP2026",
  VIP_ACCESS_PRICE_GHS: 50,
  
  STORAGE_KEYS: {
    CART: "atelier_noir_cart_v2",
    ORDER_HISTORY: "atelier_noir_orders_v2",
    UNLOCKED_MOCKUPS: "atelier_noir_unlocked_mockups_v2",
    CUSTOM_SHEET_URL: "atelier_noir_custom_sheet_url_v2",
  },

  // Fallback high-end capsule catalog with dual-angle editorial imagery
  FALLBACK_PRODUCTS: [
    {
      id: "AN-001",
      name: "Monolith Heavyweight Box Tee",
      category: "Tops",
      price: 280.00,
      image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=85",
      secondaryImage: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85",
      badge: "BESTSELLER",
      stock: 4,
      fabric: "340 GSM Giza Organic Combed Cotton",
      description: "Structured architectural silhouette featuring reinforced double-needle neck ribbing and dropped shoulders. Cut and assembled in Accra.",
    },
    {
      id: "AN-002",
      name: "Obsidian French Terry Hooded Parka",
      category: "Outerwear",
      price: 590.00,
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85",
      secondaryImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=85",
      badge: "LIMITED RUN",
      stock: 2,
      fabric: "520 GSM Heavy French Terry + Titanium Hardware",
      description: "Sculptural double-layered rigid storm hood with concealed seam pockets and matte blackened industrial zip enclosures.",
    },
    {
      id: "AN-003",
      name: "Tapered Pleated Noir Trousers",
      category: "Bottoms",
      price: 440.00,
      image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1200&q=85",
      secondaryImage: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=1200&q=85",
      badge: "RUNWAY",
      stock: 6,
      fabric: "Wool-Viscose Crepe Blend",
      description: "Double deep origami front pleats yielding an effortless fluid drape. Engineered with an adjustable side-tab waistband.",
    },
    {
      id: "AN-004",
      name: "Kevlar-Infused Tactical Harness Pouch",
      category: "Accessories",
      price: 360.00,
      image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=85",
      secondaryImage: "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1200&q=85",
      badge: "MODULAR",
      stock: 5,
      fabric: "Cordura 1000D + Vegetable Tanned Calfskin",
      description: "German Fidlock magnetic quick-release buckled sling pouch. Weatherproof compartment for smartphones, keys, and currency.",
    },
    {
      id: "AN-005",
      name: "Structured Utilitarian Overshirt",
      category: "Outerwear",
      price: 640.00,
      image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=85",
      secondaryImage: "https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=1200&q=85",
      badge: "NEW ARRIVAL",
      stock: 3,
      fabric: "Japanese High-Density Waxed Cotton Twill",
      description: "Tailored modular overshirt with concealed horn button placket and twin bellow chest cargo compartments.",
    },
    {
      id: "AN-006",
      name: "Minimalist Sculptural Cap",
      category: "Accessories",
      price: 190.00,
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1200&q=85",
      secondaryImage: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?auto=format&fit=crop&w=1200&q=85",
      badge: "ATELIER",
      stock: 8,
      fabric: "Water-Repellent Micro-Ripstop",
      description: "6-panel unconstructed crown with tonal micro-embroidered coordinates of our Osu, Accra studio.",
    },
    {
      id: "AN-007",
      name: "16oz Raw Selvedge Architectural Denim",
      category: "Bottoms",
      price: 590.00,
      image: "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1200&q=85",
      secondaryImage: "https://images.unsplash.com/photo-1475178626620-a4d074967452?auto=format&fit=crop&w=1200&q=85",
      badge: "RAW DENIM",
      stock: 4,
      fabric: "16oz Kuroki Mills Pure Indigo/Black Weft",
      description: "Shuttle-loom woven rigid selvedge denim. Hand-finished with solid copper rivets and debossed leather patch.",
    },
    {
      id: "AN-008",
      name: "Seamless Fine Merino Mockneck",
      category: "Tops",
      price: 420.00,
      image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1200&q=85",
      secondaryImage: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=85",
      badge: "CORE",
      stock: 7,
      fabric: "100% 19.5 Micron Extra-Fine Merino Wool",
      description: "3D whole-garment circular knit eliminating side seams for frictionless second-skin comfort in climate transitions.",
    },
  ],

  // VIP Mockup Items (The Confidential Cyber-Vault)
  PREMIUM_MOCKUPS: [
    {
      id: "VIP-01",
      name: "FW26 Modular Ballistic Parka",
      category: "Confidential Prototype",
      edition: "Edition 01 of 12 Worldwide",
      releaseQuarter: "Q4 Global Drop",
      productionLocation: "Accra Atelier / Lab 01",
      blurredImage: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1200&q=20",
      revealedImage: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1400&q=95",
      techSpecs: [
        "Tri-layer seam-sealed Gore-Tex Pro membrane rated 28,000mm waterproofing",
        "Magnetic fidlock modular chest rig detachable into standalone cross-body",
        "Concealed titanium heat-reflective micro-mesh lining",
        "Integrated RECCO avalanche / search rescue reflector chip",
      ],
      blueprintStats: {
        patternPieces: 64,
        assemblyTime: "28.5 Hours",
        hardware: "Cast Titanium Alloy",
      },
    },
    {
      id: "VIP-02",
      name: "Raw Hide Waxed Trench Coat",
      category: "Bespoke Couture Prototype",
      edition: "Handmade Custom (One-of-One)",
      releaseQuarter: "VIP Private Order",
      productionLocation: "Osu Flagship Studio",
      blurredImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1200&q=20",
      revealedImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1400&q=95",
      techSpecs: [
        "Single-hide laser-cut Tuscan vegetable tanned calfskin",
        "Hand-applied molten beeswax and charcoal distress treatment",
        "Hand-poured solid gunmetal buttons cast by local artisans in Accra",
        "Silk-cupro interior lining with secret passport compartment",
      ],
      blueprintStats: {
        patternPieces: 42,
        assemblyTime: "36.0 Hours",
        hardware: "Hand-poured Gunmetal",
      },
    },
    {
      id: "VIP-03",
      name: "Kinetic Geometry Flight Jacket",
      category: "Aviation Capsule Prototype",
      edition: "Experimental Batch (8 Units)",
      releaseQuarter: "Pre-Production",
      productionLocation: "Accra Lab 02",
      blurredImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=20",
      revealedImage: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=95",
      techSpecs: [
        "Articulated bi-swing pleated back for uninhibited kinetic range",
        "Ultralight Dyneema composite hybrid shell weighing under 310 grams",
        "Dual storm-proof RiRi Aquazip enclosures with glove pullers",
        "Thermore Ecodown insulation engineered for tropical and temperate climates",
      ],
      blueprintStats: {
        patternPieces: 51,
        assemblyTime: "22.0 Hours",
        hardware: "Swiss RiRi Aquazip",
      },
    },
  ],
};
