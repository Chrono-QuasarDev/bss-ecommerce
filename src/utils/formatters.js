/**
 * Utility functions for currency, order IDs, and date formatting.
 */

/**
 * Strictly format all prices in Ghanaian Cedis using Intl.NumberFormat
 * Locale: en-GH, Currency: GHS -> Outputs reliably as GH₵ XXX.XX
 * @param {number|string} amount
 * @returns {string}
 */
export const formatGHS = (amount) => {
  const numeric = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  const formatted = new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);

  // Normalizes spacing to ensure clean output: "GH₵ 200.00"
  return formatted.replace(/^GH₵(?!\s)/, 'GH₵ ');
};

/**
 * Generate a short alphanumeric Order ID (e.g., ORD-7K2X9A)
 * @returns {string}
 */
export const generateOrderId = () => {
  const timestampPart = Date.now().toString(36).slice(-3).toUpperCase();
  const randomPart = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `ORD-${timestampPart}${randomPart}`;
};

/**
 * Format a timestamp into an elegant, high-contrast date string
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDateTime = (date) => {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-GH', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(d);
  } catch {
    return 'Recent Order';
  }
};
