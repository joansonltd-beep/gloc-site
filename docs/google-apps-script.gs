/**
 * Google Apps Script web app for capturing GLOC site leads into a Sheet.
 * Paste this into Extensions -> Apps Script on your leads spreadsheet, then
 * deploy as a Web app (Execute as: Me, Who has access: Anyone).
 *
 * It appends one row per lead. Columns:
 *   submittedAt | source | name | phone | page | recommended | underwriting | message | figures
 *
 * `underwriting` holds the indicated routine UW requirements (from the callback
 * form's optional age + cover details) for internal use. The same details are
 * also inside the `figures` JSON.
 */

var HEADERS = ['submittedAt', 'source', 'name', 'phone', 'page', 'recommended', 'underwriting', 'message', 'figures'];

function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Add the header row if the sheet is empty.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }

    sheet.appendRow([
      data.submittedAt || new Date().toISOString(),
      data.source || '',
      data.name || '',
      data.phone || '',
      data.page || '',
      data.recommended || '',
      data.underwriting || '',
      data.message || '',
      data.figures ? JSON.stringify(data.figures) : ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Lets you confirm the deployment is live by visiting the /exec URL in a browser.
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, note: 'GLOC lead webhook is live' }))
    .setMimeType(ContentService.MimeType.JSON);
}
