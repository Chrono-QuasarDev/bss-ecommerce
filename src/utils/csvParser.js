/**
 * Google Sheets CSV Parser and Fetcher
 * Converts published Google Sheet CSV text into strongly-typed product objects.
 */

/**
 * Robust RFC 4180 compliant CSV text parser
 * Handles commas inside double quotes, escaped quotes (""), and CRLF/LF line endings.
 * @param {string} text
 * @returns {string[][]}
 */
export const parseCSV = (text) => {
  const rows = [];
  let currentRow = [''];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"' && inQuotes && nextChar === '"') {
      currentRow[currentRow.length - 1] += '"';
      i++; // Skip escaped quote
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      currentRow.push('');
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip LF in CRLF
      }
      rows.push(currentRow);
      currentRow = [''];
    } else {
      currentRow[currentRow.length - 1] += char;
    }
  }

  if (currentRow.length > 1 || (currentRow.length === 1 && currentRow[0].trim() !== '')) {
    rows.push(currentRow);
  }

  return rows;
};

/**
 * Normalizes header keys to standard object keys
 * @param {string} header
 * @returns {string}
 */
const normalizeHeaderKey = (header) => {
  const clean = header.trim().toLowerCase().replace(/[\s_-]+/g, '');
  if (['id', 'itemid', 'sku'].includes(clean)) return 'id';
  if (['name', 'title', 'itemname', 'productname'].includes(clean)) return 'name';
  if (['category', 'cat', 'collection', 'type'].includes(clean)) return 'category';
  if (['price', 'cost', 'amount', 'ghs', 'cedis'].includes(clean)) return 'price';
  if (['image', 'img', 'imageurl', 'photo', 'picture'].includes(clean)) return 'image';
  if (['description', 'desc', 'details'].includes(clean)) return 'description';
  return clean;
};

/**
 * Cleans and converts price string into clean floating-point number
 * @param {string|number} rawPrice
 * @returns {number}
 */
export const cleanPrice = (rawPrice) => {
  if (typeof rawPrice === 'number') return rawPrice;
  if (!rawPrice) return 0;
  // Remove non-numeric characters except period and minus
  const sanitized = String(rawPrice).replace(/[^0-9.-]+/g, '');
  const parsed = parseFloat(sanitized);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Parse raw CSV string into an array of product objects
 * @param {string} csvText
 * @returns {Array<{id: string, name: string, category: string, price: number, image: string, description?: string}>}
 */
export const parseProductsFromCSV = (csvText) => {
  if (!csvText || typeof csvText !== 'string') return [];

  const rawRows = parseCSV(csvText.trim());
  if (rawRows.length < 2) return [];

  // Parse header row
  const headers = rawRows[0].map((h) => normalizeHeaderKey(h));

  const products = [];

  for (let i = 1; i < rawRows.length; i++) {
    const row = rawRows[i];
    if (row.length === 0 || row.every((c) => !c.trim())) continue;

    const rawObj = {};
    headers.forEach((key, index) => {
      rawObj[key] = (row[index] || '').trim();
    });

    const id = rawObj.id || `ITEM-${i}`;
    const name = rawObj.name || `Atelier Piece #${i}`;
    const category = rawObj.category || 'General';
    const price = cleanPrice(rawObj.price);
    const image = rawObj.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80';
    const description = rawObj.description || 'Monochromatic essential piece engineered with minimalist proportions.';

    if (name) {
      products.push({
        id,
        name,
        category,
        price,
        image,
        description,
      });
    }
  }

  return products;
};

/**
 * Fetch and parse products from a published Google Sheet CSV URL
 * @param {string} url
 * @returns {Promise<Array<Object>>}
 */
export const fetchProductsFromGoogleSheet = async (url) => {
  if (!url) {
    throw new Error('Google Sheet CSV URL is missing.');
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'text/csv, text/plain, */*',
    },
    cache: 'no-cache',
  });

  if (!response.ok) {
    throw new Error(`Failed to load Google Sheet (HTTP ${response.status})`);
  }

  const csvText = await response.text();
  const products = parseProductsFromCSV(csvText);

  if (!products.length) {
    throw new Error('No valid product rows found in published Google Sheet CSV.');
  }

  return products;
};
