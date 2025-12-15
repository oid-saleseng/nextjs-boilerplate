import jwt from "jsonwebtoken";
import { createPrivateKey } from "crypto";
import { kv } from "../../lib/kv.js"; // Make sure this path is correct
import { randomUUID } from "crypto";

const base64Key = process.env.PRIVATE_KEY_BASE64;
if (!base64Key) throw new Error("Missing PRIVATE_KEY_BASE64 env var");

const privateKeyPEM = Buffer.from(base64Key, "base64").toString("utf-8");

const privateKey = createPrivateKey({
  key: privateKeyPEM,
  format: "pem",
  type: "pkcs8",
});

export default async function handler(req, res) {
  const { grant_type, code, redirect_uri, client_id } = req.body || {};

  if (grant_type !== "authorization_code") {
    return res.status(400).json({ error: "unsupported_grant_type" });
  }

  if (!code) {
    return res.status(400).json({ error: "invalid_request", error_description: "Missing code" });
  }

  // Step 1: Decode code and extract the real lookup key (nonce)
  let codePayload;
  try {
    const decoded = Buffer.from(code, "base64").toString("utf-8");
    codePayload = JSON.parse(decoded);
  } catch (e) {
    return res.status(400).json({ error: "invalid_grant", error_description: "Malformed code" });
  }

  if (!codePayload.nonce) {
    return res.status(400).json({ error: "invalid_nonce", error_description: "Nonce missing in code" });
  }

  const nonce = codePayload.nonce;

  // Step 2: Use the *same base64 code string* as the Redis key
  let stored;
  try {
    stored = await kv.get(code); // not nonce!
    if (!stored) {
      return res.status(400).json({ error: "invalid_grant", error_description: "Invalid or expired code" });
    }
  } catch (e) {
    console.error("KV lookup failed:", e);
    return res.status(500).json({ error: "server_error", error_description: "KV failure" });
  }

  let parsed;
  try {
    parsed = typeof stored === "string" ? JSON.parse(stored) : stored;
  } catch (e) {
    console.error("Error parsing stored session data:", e);
    return res.status(500).json({ error: "server_error", error_description: "Corrupt session data" });
  }

  const { email, client_id: storedClientId, session_token } = parsed;

  if (storedClientId !== client_id) {
    return res.status(400).json({ error: "invalid_client", error_description: "Client ID mismatch" });
  }

  const now = Math.floor(Date.now() / 1000);

  // Step 3: Generate ID token with surname
  let subject;
  let surname;
  let fedid;
  if (email === "paul@paul2.com") {
    subject = "1234567";
    surname = "smith-doyle";
    fedid = "987654321";
  } else {
    subject = randomUUID(); // generate a random string as subject
    surname = "unknown";
  }

  const id_token = jwt.sign(
    {
      iss: process.env.BASE_URL,
      sub: subject,            // sub is conditional now
      aud: client_id,
      nonce,
      exp: now + 3600,
      iat: now,
      email,                   // email claim holds user's email
      email_verified: true,    // set this if you know it's verified
      surname,
      fedid
    },
    privateKey,
    { algorithm: "RS256" }
  );

  // Step 4: Generate a unique access token and store user session data keyed by it
  const access_token = randomUUID();

  try {
    await kv.set(
      access_token,
      JSON.stringify({
        email,
        client_id: storedClientId,
        session_token,
      }),
      { ex: 3600 } // expire in 1 hour to match token expiration
    );
  } catch (e) {
    console.error("Failed to store access token in KV:", e);
    return res.status(500).json({ error: "server_error", error_description: "Failed to store access token" });
  }

  // Step 5: Cleanup the one-time code
  await kv.del(code);

  // Step 6: Respond with tokens
  return res.json({
    access_token,
    token_type: "Bearer",
    expires_in: 3600,
    id_token,
  });
}
