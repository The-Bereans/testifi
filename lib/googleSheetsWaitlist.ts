/**
 * Google Sheets waitlist provider  drop-in alternative to Supabase.
 *
 * SETUP
 * ─────
 * 1. Create a Google Cloud project → enable the Google Sheets API.
 * 2. Create a Service Account → download the JSON key.
 * 3. Share your spreadsheet with the service account email (Editor role).
 * 4. Add these to your .env:
 *
 *      GOOGLE_SHEETS_SPREADSHEET_ID=<your-spreadsheet-id>
 *      GOOGLE_SERVICE_ACCOUNT_EMAIL=<your-service-account@project.iam.gserviceaccount.com>
 *      GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
 *
 *    Tip: the private key from the JSON file needs its literal \n kept  paste it
 *    in quotes and it works in both .env files and Vercel/Netlify env vars.
 *
 * 5. Set up your sheet:
 *    - Sheet name: "Waitlist" (or update SHEET_NAME below)
 *    - Row 1 headers: email | ip_hash | signed_up_at
 *
 * SWAP INTO THE ROUTE
 * ───────────────────
 * In app/api/waitlist/route.ts, replace the Supabase block with:
 *
 *   import { appendToWaitlist } from '@/lib/googleSheetsWaitlist';
 *   // ...
 *   await appendToWaitlist(email, ipHash);
 */

const SHEET_NAME = 'Waitlist';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// ─── JWT helpers (no googleapis package required) ────────────────────────────

function base64url(input: string | Uint8Array): string {
  const bytes = typeof input === 'string' ? new TextEncoder().encode(input) : input;
  let binary = '';
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function getAccessToken(): Promise<string> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!email || !rawKey) {
    throw new Error('Missing GOOGLE_SERVICE_ACCOUNT_EMAIL or GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY');
  }

  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(
    JSON.stringify({
      iss: email,
      scope: SCOPES.join(' '),
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    })
  );

  const signingInput = `${header}.${payload}`;

  // Import the private key
  const pemBody = rawKey
    .replace(/\\n/g, '\n')
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');

  const keyBytes = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));
  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyBytes,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBytes = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signingInput)
  );

  const jwt = `${signingInput}.${base64url(new Uint8Array(signatureBytes))}`;

  // Exchange JWT for access token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error(`Google OAuth failed: ${err}`);
  }

  const { access_token } = (await tokenRes.json()) as { access_token: string };
  return access_token;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Appends a waitlist row to the Google Sheet.
 * Throws on failure  let the caller handle the HTTP response.
 */
export async function appendToWaitlist(email: string, ipHash: string): Promise<void> {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) throw new Error('Missing GOOGLE_SHEETS_SPREADSHEET_ID');

  const accessToken = await getAccessToken();

  const range = `${SHEET_NAME}!A:C`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [[email, ipHash, new Date().toISOString()]],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Google Sheets append failed: ${err}`);
  }
}
