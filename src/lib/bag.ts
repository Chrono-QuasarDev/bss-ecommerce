import { persistentAtom } from '@nanostores/persistent';
import type { BagItem, Product } from './types';

/** Persistent Nanostore for bag items stored in localStorage under key bag_v1 without names or prices. */
export const $bag = persistentAtom<BagItem[]>('bag_v1', [], {
  encode: JSON.stringify,
  decode: (str) => {
    try {
      const parsed = JSON.parse(str);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
});

/** Helper generating a unique identifier for grouping a bag line by product, size, and premium flag. */
function lineKey(productId: string, size?: string, premium: boolean = false): string {
  return `${productId}::${size || ''}::${premium ? '1' : '0'}`;
}

/** Adds an item to the bag, merging identical products/sizes and clamping quantity between 1 and 10. */
export function addItem(productId: string, size?: string, qty: number = 1, premium: boolean = false): void {
  const current = $bag.get();
  const targetKey = lineKey(productId, size, premium);
  const existingIndex = current.findIndex((item) => lineKey(item.productId, item.size, item.premium) === targetKey);

  if (existingIndex > -1) {
    const updated = [...current];
    const newQty = Math.min(10, Math.max(1, updated[existingIndex].qty + qty));
    updated[existingIndex] = { ...updated[existingIndex], qty: newQty };
    $bag.set(updated);
  } else {
    const safeQty = Math.min(10, Math.max(1, qty));
    $bag.set([...current, { productId, size, qty: safeQty, premium }]);
  }
}

/** Removes an item line matching the given product ID, size, and premium status from the bag. */
export function removeItem(productId: string, size?: string, premium: boolean = false): void {
  const targetKey = lineKey(productId, size, premium);
  $bag.set($bag.get().filter((item) => lineKey(item.productId, item.size, item.premium) !== targetKey));
}

/** Updates the quantity of a specific bag line, clamping between 1 and 10 or removing if quantity is 0 or less. */
export function setQty(productId: string, qty: number, size?: string, premium: boolean = false): void {
  if (qty <= 0) {
    removeItem(productId, size, premium);
    return;
  }

  const safeQty = Math.min(10, Math.max(1, qty));
  const targetKey = lineKey(productId, size, premium);
  $bag.set(
    $bag.get().map((item) => {
      if (lineKey(item.productId, item.size, item.premium) === targetKey) {
        return { ...item, qty: safeQty };
      }
      return item;
    })
  );
}

/** Clears all items from the bag and resets storage. */
export function clearBag(): void {
  $bag.set([]);
}

/** Computes the total quantity of items currently held in the bag. */
export function totalQty(): number {
  return $bag.get().reduce((acc, item) => acc + item.qty, 0);
}

/** Calculates the order subtotal based on verified product catalog data, excluding sold-out or missing items. */
export function subtotal(products: Product[]): number {
  const productMap = new Map(products.map((p) => [p.id, p]));
  return $bag.get().reduce((acc, item) => {
    const product = productMap.get(item.productId);
    if (!product || product.soldOut) {
      return acc;
    }
    return acc + product.price * item.qty;
  }, 0);
}
