import jwt from "jsonwebtoken";
import { createPrivateKey } from "crypto";

const base64Key = process.env.PRIVATE_KEY_BASE64;
if (!base64Key) throw new Error('Missing PRIVATE_KEY_BASE64 env var');

const privateKeyPEM = Buffer.from(base64Key, 'base64').toString('utf-8');

const privateKey = createPrivateKey({
  key: privateKeyPEM,
  format: 'pem',
  type: 'pkcs8',
});

export default async function handler(req, res) {
  const { grant_type, code, redirect_uri, client_id } = req.body || {};

  if (grant_type !== "authorization_code" || code !== "mock_auth_code") {
    return res.status(400).json({ error: "invalid_grant" });
  }

  const now = Math.floor(Date.now() / 1000);

  const id_token = jwt.sign(
    {
      iss: process.env.BASE_URL,
      sub: "1234",
      aud: client_id,
      exp: now + 3600,
      iat: now,
      name: "Test User",
      email: "user@example.com",
    },
    privateKey,
    { algorithm: "RS256" }
  );

  res.json({
    access_token: "mock_access_token",
    token_type: "Bearer",
    expires_in: 3600,
    id_token,
  });
}
