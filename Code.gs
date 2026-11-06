function doPost(e) {
  const SHEET_NAME = "FormSubmissions"; // you can name it anything, defaults to first sheet if omitted
  const PROPERTIES = {
    ADMIN_EMAIL: "your-email@example.com", // set to your own email
    SPREADSHEET_ID: "YOUR_SPREADSHEET_ID", // copy the sheet URL from Google Sheets and paste the part after /d/ and before /edit
    HONEYPOT_FIELD: "botcatcher" // the name of the honeypot field (hidden)
  };

  // Honeypot spam check
  if (e.parameter[PROPERTIES.HONEYPOT_FIELD] && e.parameter[PROPERTIES.HONEYPOT_FIELD] !== "") {
    return respond({ success: false, message: "Bot submission blocked." }, 403);
  }

  // Extract fields safely
  const name = e.parameter.name || "";
  const email = e.parameter.email || "";
  const message = e.parameter.message || "";

  // Validation
  if (!name || !email || !message) {
    return respond({ success: false, message: "All fields are required." }, 400);
  }

  // Optional: email format validation (simple)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return respond({ success: false, message: "Invalid email format." }, 400);
  }

  try {
    const ss = SpreadsheetApp.openById(PROPERTIES.SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error("Sheet not found: " + SHEET_NAME);

    // Append a new row with timestamp, name, email, message
    const row = [
      new Date(),
      name,
      email,
      message
    ];
    sheet.appendRow(row);

    // Send confirmation email to submitter
    const subject = "Thanks for your message!";
    const body = `Hi ${name},

We received your message:
"${message}"

We'll get back to you soon.

Best,
${PROPERTIES.ADMIN_EMAIL}`;

    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: body.replace(/\n/g, "<br>"), // plain text -> html with line breaks
      from: PROPERTIES.ADMIN_EMAIL
    });

    return respond({ success: true, message: "Submission saved and confirmation sent." });
  } catch (err) {
    // Error handling
    return respond({ success: false, message: "Error: " + err.message }, 500);
  }
}

function respond(data, code = 200) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setContentType("application/json");
  output.setMimeType(ContentService.MimeType.JSON);
  output.setHeader("Access-Control-Allow-Origin", "*");
  if (code !== 200) output.setStatus("code " + code);
  return output;
}

// Optional: allow for URL param formData (if needed)
function getProperties() {
  // Read properties from Google Apps Script Properties Service for production
}