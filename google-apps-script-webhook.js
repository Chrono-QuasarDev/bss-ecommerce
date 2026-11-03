/**
 * Google Apps Script Webhook (Free Serverless Database on Google Sheets)
 *
 * Setup Instructions:
 * 1. Create a Google Sheet named "Store Orders".
 * 2. In row 1, set headers: Timestamp | Order ID | Total (GHS) | Currency | Items JSON | Order String
 * 3. Go to Extensions > Apps Script.
 * 4. Paste this code and click Deploy > New Deployment.
 * 5. Choose type "Web App", Execute as "Me", Who has access "Anyone".
 * 6. Copy the URL into VITE_WEBHOOK_URL in your local .env file.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),
      data.orderId || "UNKNOWN",
      data.totalAmount || 0,
      data.currency || "GHS",
      JSON.stringify(data.items || []),
      data.orderText || "",
    ]);

    return ContentService.createTextOutput("SUCCESS").setMimeType(
      ContentService.MimeType.TEXT,
    );
  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err.message).setMimeType(
      ContentService.MimeType.TEXT,
    );
  }
}
