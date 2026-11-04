/**
 * Core domain types matching PRD Section 4 & Section 7.
 */

export type Product = {
  id: string;            // slug, unique, e.g. "classic-tee"
  name: string;
  category: string;      // e.g. "tops"
  price: number;         // in {CURRENCY_CODE} (GHS)
  description: string;
  images: string[];      // paths under /products/, first is the cover
  sizes?: string[];      // omit if not applicable
  soldOut: boolean;
  featured: boolean;
};

export type BagItem = {
  productId: string;
  size?: string;
  qty: number;           // 1 to 10
  premium: boolean;
};

export type OrderCustomer = {
  name: string;
  phone: string;
  address: string;
  notes?: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  size?: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
};

export type OrderPayload = {
  ref: string;
  createdAt: string;        // ISO
  type: 'standard' | 'premium';
  customer: OrderCustomer;
  items: OrderItem[];
  total: number;
};
