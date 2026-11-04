import { CONFIG } from '../config';

/** Formats a numeric monetary value using the brand currency symbol and two decimal places. */
export function formatMoney(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return `${CONFIG.CURRENCY_SYMBOL} ${safeAmount.toFixed(2)}`;
}

/** Formats a raw number into a localized string. */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-GH').format(value);
}
