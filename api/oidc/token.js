import jwt from "jsonwebtoken";
import { createPrivateKey } from "crypto";

const privateKeyPEM = process.env.PRIVATE_KEY;

if (!privateKeyPEM) {
  throw new Error('Missing PRIVATE_KEY environment variable');
}

// Replace escaped \n with real newlines if needed
const privateKeyFormatted = privateKeyPEM.includes('\\n')
  ? privateKeyPEM.replace(/\\n/g, '\n')
  : privateKeyPEM;

const privateKey = createPrivateKey({
  key: privateKeyFormatted,
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
