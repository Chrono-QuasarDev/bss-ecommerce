import type { Product, OrderPayload } from './types';
import productsData from '../data/products.json';

/** Retrieves the list of public catalog products from static data. */
export async function getProducts(): Promise<Product[]> {
  return productsData as Product[];
}

/** Fetches unlocked premium products from the backend gate using session credentials. */
export async function getPremiumProducts(): Promise<Product[]> {
  const response = await fetch('/api/premium/products', {
    method: 'GET',
    credentials: 'same-origin',
  });

  if (!response.ok) {
    throw new Error(`Failed to load premium catalog: ${response.status}`);
  }

  return response.json();
}

/** Submits a single-use access PIN to the redemption endpoint to unlock premium access. */
export async function redeemPin(pin: string): Promise<{ ok: boolean }> {
  const response = await fetch('/api/redeem', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pin }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Invalid or already used PIN');
  }

  return response.json();
}

/** Dispatches order details to the serverless order logger with a strict 4-second timeout. */
export async function submitOrder(order: OrderPayload): Promise<void> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch('/api/order-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`Order log server returned status ${response.status}`);
    }
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn('Order log submission failed or timed out:', error);
  }
}
