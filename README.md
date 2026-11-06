# Simple Contact Form (HTML + Google Apps Script + Google Sheets)

A beginner-friendly contact form web page that saves each submission to a Google Sheet and sends a confirmation email.

## What it does

1. **Frontend (`index.html`)** — A simple contact form (name, email, message) with basic CSS and JavaScript.
   - Client-side validation (name, email format, message length).
   - Sends form data to a Google Apps Script web app URL via `fetch` (POST, `mode: "no-cors"`, `URLSearchParams` body).
   - Shows success/error message.
   - Disables the Send button during submission and re-enables after ~3 seconds.
   - Includes a hidden honeypot field (`botcatcher`) to catch spam bots.

2. **Backend (`Code.gs`)** — Google Apps Script web app (`doPost`):
   - Reads `name`, `email`, `message` from form data.
   - Honeypot spam check (blocks submissions where `botcatcher` is non-empty).
   - Validates required fields and email format.
   - Appends a row `[timestamp, name, email, message]` to the active Google Sheet.
   - Sends a confirmation email via `MailApp` to the submitter.
   - Returns JSON response.

3. **Storage** — Google Sheets stores submissions.

## How it works

```
Browser (index.html)  →  Google Apps Script (Code.gs)  →  Google Sheets + Gmail
   POST /exec          →  doPost(e)                    →  appendRow + sendEmail
```

## Setup

1. **Create a Google Sheet**:
   - Go to [sheets.google.com](https://sheets.google.com) → New spreadsheet.
   - Rename tab to `FormSubmissions` (optional, matches `SHEET_NAME` in code).

2. **Create Apps Script**:
   - In the sheet: Extensions → Apps Script.
   - Paste the code from `Code.gs` into the editor.
   - Update placeholders:
     - `ADMIN_EMAIL`: your email address.
     - `SPREADSHEET_ID`: your spreadsheet ID from the URL.

3. **Deploy web app**:
   - In Apps Script: Deploy → New deployment → Web app.
   - Execute as: **Me**.
   - Who has access: **Anyone**.
   - Deploy and copy the Web app URL.

4. **Update frontend**:
   - In `index.html`, set the fetch URL to your deployed web app URL.

5. **Run frontend**:
   - Open `index.html` in a browser (e.g., just open the file directly, or serve it).
   - Fill out the form and submit.

## Notes / Placeholders

- Replace `your-email@example.com` and `YOUR_SPREADSHEET_ID` with real values before deployment.
- The Apps Script uses `SpreadsheetApp.openById(SPREADSHEET_ID)`.
- The confirmation email is sent via `MailApp.sendEmail`.
- Honeypot field name: `botcatcher`.
