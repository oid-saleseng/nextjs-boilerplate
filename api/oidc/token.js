import jwt from "jsonwebtoken";
import { createPrivateKey } from "crypto";
import { kv } from "../../lib/kv.js"; // Adjust path as needed

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

  // Step 1: Look up the code in Redis
  const stored = await kv.get(code);
  if (!stored) {
    return res.status(400).json({ error: "invalid_grant", error_description: "Invalid or expired code" });
  }

  let parsed;
  try {
    parsed = JSON.parse(stored); // expected: { session_token, email, client_id }
  } catch (e) {
    return res.status(500).json({ error: "server_error", error_description: "Corrupt session data" });
  }

  const { email, client_id: storedClientId, session_token } = parsed;

  if (storedClientId !== client_id) {
    return res.status(400).json({ error: "invalid_client", error_description: "Client ID mismatch" });
  }

  // Step 2: Decode nonce from the original base64 payload (same logic you had)
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
  const now = Math.floor(Date.now() / 1000);

  // Step 3: Generate the ID token
  const id_token = jwt.sign(
    {
      iss: process.env.BASE_URL,
      sub: email, // use email as subject for simplicity
      aud: client_id,
      nonce,
      exp: now + 3600,
      iat: now,
      email,
    },
    privateKey,
    { algorithm: "RS256" }
  );

  // Optional: Delete the code from Redis to prevent reuse
  await kv.del(code);

  // Step 4: Return token response
  return res.json({
    access_token: "mock_access_token",
    token_type: "Bearer",
    expires_in: 3600,
    id_token,
  });
}
