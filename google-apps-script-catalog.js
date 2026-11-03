/**
 * B.S.S public catalog API — Google Apps Script
 *
 * Reads the private Products and Variants tabs and returns only published,
 * available catalog data. This endpoint is read-only; it does not expose a
 * write operation to anonymous visitors.
 *
 * Deployment setup:
 * 1. Open the Google Sheet and go to Extensions > Apps Script.
 * 2. Paste this file into Code.gs (or add it as a script file).
 * 3. In Project Settings > Script Properties, add:
 *      SPREADSHEET_ID = the ID from the Google Sheet URL
 * 4. Deploy > New deployment > Web app.
 *      Execute as: Me
 *      Who has access: Anyone
 * 5. Test the deployment URL with ?action=catalog&callback=handleCatalog
 *
 * Cross-origin note:
 * Apps Script ContentService does not provide configurable CORS headers.
 * The callback parameter enables JSONP for the public, read-only catalog.
 * The storefront must load this endpoint with a script callback (not fetch).
 * Only public product fields are returned. Never put private data in the
 * Products/Variants fields returned below.
 *
 * Expected headers (exact spelling):
 * Products: product_id, slug, name, description, category, price_ghs,
 *           primary_image_url, secondary_image_url, image_alt, badge,
 *           featured, status, sort_order
 * Variants: variant_id, product_id, size, color, sku, stock_quantity, active
 */

const CATALOG_CONFIG = {
  PRODUCTS_SHEET: 'Products',
  VARIANTS_SHEET: 'Variants',
};

/** Public read-only endpoint. Example: ?action=catalog&callback=onCatalog */
function doGet(e) {
  const params = (e && e.parameter) || {};
  const callback = params.callback || '';

  try {
    if (params.action !== 'catalog') {
      return respond_({
        ok: false,
        error: 'Unknown action. Use action=catalog.',
      }, callback);
    }

    const catalog = getPublicCatalog_();
    return respond_({
      ok: true,
      products: catalog,
      count: catalog.length,
      updatedAt: new Date().toISOString(),
    }, callback);
  } catch (error) {
    console.error(error && error.stack ? error.stack : error);
    return respond_({
      ok: false,
      error: 'Catalog is temporarily unavailable.',
    }, callback);
  }
}

/** Read only published products and available variants. */
function getPublicCatalog_() {
  const spreadsheetId = PropertiesService.getScriptProperties()
    .getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) {
    throw new Error('Missing Script Property: SPREADSHEET_ID');
  }

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const productRows = readTable_(spreadsheet, CATALOG_CONFIG.PRODUCTS_SHEET);
  const variantRows = readTable_(spreadsheet, CATALOG_CONFIG.VARIANTS_SHEET);

  const variantsByProduct = {};
  variantRows.forEach(function (row) {
    const productId = text_(row.product_id);
    if (!productId || !isTrue_(row.active)) return;

    const stock = nonNegativeInteger_(row.stock_quantity);

    if (!variantsByProduct[productId]) variantsByProduct[productId] = [];
    variantsByProduct[productId].push({
      id: text_(row.variant_id),
      size: text_(row.size),
      color: text_(row.color),
      sku: text_(row.sku),
      available: stock > 0,
    });
  });

  return productRows
    .filter(function (row) {
      return text_(row.status).toLowerCase() === 'published';
    })
    .map(function (row) {
      const id = text_(row.product_id);
      const variants = variantsByProduct[id] || [];

      return {
        id: id,
        slug: text_(row.slug),
        name: text_(row.name),
        description: text_(row.description),
        category: text_(row.category),
        price: nonNegativeNumber_(row.price_ghs),
        image: text_(row.primary_image_url),
        secondaryImage: text_(row.secondary_image_url),
        imageAlt: text_(row.image_alt),
        badge: text_(row.badge),
        featured: isTrue_(row.featured),
        // Do not expose exact inventory quantities publicly.
        inStock: variants.length > 0,
        variants: variants,
        sortOrder: finiteNumber_(row.sort_order, 999999),
      };
    })
    .filter(function (product) {
      // Do not publish incomplete or unavailable products.
      return product.id && product.name && product.price >= 0 && product.image;
    })
    .sort(function (a, b) {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);
    })
    .map(function (product) {
      // Keep internal sorting metadata out of the public response.
      delete product.sortOrder;
      return product;
    });
}

/** Read a tab using its first row as headers; reject missing/duplicate headers. */
function readTable_(spreadsheet, sheetName) {
  const sheet = spreadsheet.getSheetByName(sheetName);
  if (!sheet) throw new Error('Missing sheet tab: ' + sheetName);

  const values = sheet.getDataRange().getValues();
  if (!values.length) return [];

  const headers = values[0].map(function (value) {
    return String(value == null ? '' : value).trim();
  });
  if (!headers.some(Boolean)) return [];

  const seen = {};
  headers.forEach(function (header) {
    if (!header) return;
    if (seen[header]) throw new Error('Duplicate header in ' + sheetName + ': ' + header);
    seen[header] = true;
  });

  return values.slice(1)
    .filter(function (row) {
      return row.some(function (cell) { return cell !== '' && cell !== null; });
    })
    .map(function (row) {
      const record = {};
      headers.forEach(function (header, index) {
        if (header) record[header] = row[index];
      });
      return record;
    });
}

/** JSONP is used for browser cross-origin reads from Apps Script. */
function respond_(payload, callback) {
  const json = JSON.stringify(payload)
    // Prevent HTML/script-tag termination if a cell contains hostile text.
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026');

  if (callback) {
    if (!/^[A-Za-z_$][0-9A-Za-z_$]*(\.[A-Za-z_$][0-9A-Za-z_$]*)*$/.test(callback)) {
      return ContentService.createTextOutput('/* Invalid callback */')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService.createTextOutput(callback + '(' + json + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return ContentService.createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

function text_(value) {
  return String(value == null ? '' : value).trim();
}

function isTrue_(value) {
  return value === true || String(value).trim().toLowerCase() === 'true';
}

function nonNegativeInteger_(value) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
}

function nonNegativeNumber_(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

function finiteNumber_(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}
