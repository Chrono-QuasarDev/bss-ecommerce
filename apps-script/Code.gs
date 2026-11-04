/**
 * Google Apps Script Order Logger for B.S.S
 *
 * Appends customer orders to the active Google Sheet upon receiving a POST request
 * from the Cloudflare Pages Function. Rejects all requests that lack the shared secret.
 */

function doPost(e) {
  try {
    var rawData = e && e.postData && e.postData.contents;
    if (!rawData) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Empty body' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var data = JSON.parse(rawData);
    var expectedSecret = PropertiesService.getScriptProperties().getProperty('SHEET_SECRET');

    // Reject unauthorized requests without matching shared secret
    if (!expectedSecret || data.secret !== expectedSecret) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Summarize items into human-readable text for the spreadsheet row
    var itemsSummary = '';
    if (Array.isArray(data.items)) {
      itemsSummary = data.items.map(function(item) {
        var sizePart = item.size ? ' (' + item.size + ')' : '';
        return item.name + sizePart + ' x' + item.qty + ' - ' + item.lineTotal;
      }).join('; ');
    }

    var customer = data.customer || {};

    // Append columns: Received At, Ref, Type, Name, Phone, Address, Notes, Items, Total, Status
    sheet.appendRow([
      new Date().toISOString(),
      data.ref || '',
      data.type || 'standard',
      customer.name || '',
      customer.phone || '',
      customer.address || '',
      customer.notes || '',
      itemsSummary,
      data.total || 0,
      'New'
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
