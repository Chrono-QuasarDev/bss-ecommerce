/**
 * Checkout & WhatsApp Handoff Utilities
 * Manages order string generation, free webhook tracking, and WhatsApp redirection.
 */

import { formatGHS } from './formatters';

/**
 * Format the exact order summary string required for WhatsApp concierge
 * Format:
 * Order Request:
 * Order ID: [ID]
 * 1x Item A (GH₵ 200.00)
 * 2x Item B (GH₵ 100.00)
 * Total: GH₵ 400.00
 *
 * @param {string} orderId
 * @param {Array<{name: string, quantity: number, price: number}>} items
 * @param {number} totalAmount
 * @returns {string}
 */
export const formatOrderString = (orderId, items, totalAmount) => {
  const itemsText = items
    .map((item) => `${item.quantity}x ${item.name} (${formatGHS(item.price * item.quantity)})`)
    .join('\n');

  return `Order Request:\nOrder ID: ${orderId}\n${itemsText}\nTotal: ${formatGHS(totalAmount)}`;
};

/**
 * Sends an asynchronous POST request with mode: 'no-cors' to the free database webhook.
 * (e.g. Google Apps Script Web App, Zapier Webhook, or Make.com webhook)
 *
 * Uses Promise.race with a timeout to guarantee the user is never stuck in the checkout flow
 * if the external webhook is slow or offline.
 *
 * @param {string} webhookUrl
 * @param {object} payload
 * @returns {Promise<{success: boolean, simulated?: boolean, error?: string}>}
 */
export const logOrderToWebhook = async (webhookUrl, payload) => {
  // If webhook is placeholder, simulate realistic network roundtrip
  if (!webhookUrl || webhookUrl.includes('PLACEHOLDER')) {
    console.info('[Order Logger] Placeholder Webhook detected. Simulated dispatch with payload:', payload);
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { success: true, simulated: true };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3500);

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return { success: true };
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn('[Order Logger] Webhook fetch completed with non-fatal notice (mode: no-cors):', error);
    // Even if aborted or network hiccups, never block the customer's WhatsApp handoff
    return { success: false, error: error.message };
  }
};

/**
 * Build the final WhatsApp Web / App intent URL
 * @param {string} phone - Ghanaian phone number in international format (e.g. 233540000000)
 * @param {string} rawText - Unencoded message string
 * @returns {string}
 */
export const buildWhatsAppUrl = (phone, rawText) => {
  const sanitizedPhone = String(phone).replace(/[^0-9]/g, '');
  const encodedString = encodeURIComponent(rawText);
  return `https://wa.me/${sanitizedPhone}?text=${encodedString}`;
};

/**
 * Build WhatsApp inquiry link for unlocking VIP mockups
 * @param {string} phone
 * @param {string} mockupName
 * @returns {string}
 */
export const buildVipInquiryUrl = (phone, mockupName) => {
  const sanitizedPhone = String(phone).replace(/[^0-9]/g, '');
  const text = `Hello, I want to pay for the PIN to unlock ${mockupName}`;
  return `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(text)}`;
};
