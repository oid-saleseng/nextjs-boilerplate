import jwt from "jsonwebtoken";
import { privateKey } from "./keys";

export default async function handler(req, res) {
  const { grant_type, code, redirect_uri, client_id } = req.body || {};


const privateKey = `
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEApkDgMQ2oMeKAwzXmrhHKFvCJ1W7KXG+OqIAH9U57M6r7aEVH
uH7Z9bQG+NMFUglTw2ImEVWTf5F3CxnLJMQ7lDAeoL2HhZDbjVrEjUMgcBhMuBHv
omJdnbUgGy4YoCDS4p9kwDJyRuVgKcGoMb3+cT79fMOvWZRLHEyCuUvLRuQf62XK
KcYvxyoivEKn/NZkEakQTYJR44/VaY3lNblmnRZxUl9oyJMXT4bF3J59MPX7jwHc
m1vgHaUNCRtAvhKzhSmPVZ7yMNRtzcVdxkDAyi+GpHoE0GpE+mwHTyAqYpRwRyd7
U80Zm6FEqykFVfXZzD0coh9OSQ6Ky6X0eIuPOQIDAQABAoIBAQCP2BMdkqfWYe0L
S19M+pgw13UvowB9sJqW0iL9uw+ywbLMvVpqAXc2F7XmCJEBKnSeIpB3Tgzx5WwP
1O8RM3c5sVi5RB+JZoN+7aF5lzTdoIcbHMQz41sJIB8zHqGf/7pg6iPslNBbmO4X
UtzrkZFehF3zF8Vp44uWXP+q6DLDRYZHCk9VJuyvKqlx0DlaZaFMv8px2lGHCCqO
S5Tis8oqgFCWe9WcTBDIG+wAlJGk8xtdDNj52TbHGjdDQk4RylZwAl5OeJ7FNVrq
QpEEaBbm/fT1bKwrs53wtKH5x8oT2r4cTxPi9hrByfWZ5Ev+3D8Z0+NWzvXWRDTo
RvNrmksBAoGBAOxx4BRNQskqWX1gYX0YlEvmFzKcB15rYxLP2NzHuTLK0QlSGAvK
CDzTxUuazBN8pnshxT7FgbX+/Fvd7eA9dD70mgft7lxS7Q3f+4jHZz7FyplvQnvx
gP6/jXeMWhMNq5wJ3zw8igp0k1wHeDToMTsDKb/ccz7jBgMNdzJ9IljNAoGBAM5l
9UEVq+AnB6nWmMNR8mZzXLSqv5WvIY6VZC0hO7+JJvaCOt9LXDikS/fZ7UZGh0Xz
Q9oZxBDXTAa9ytqvq0ztDMS99QvqENa3hT2N7e8xywTfLO8Zh6IJrTtUsA1P0RFS
pwrPIaBOr4Zm0gMiAA+qL0VzAWZ9JjVmd+3IThkBAoGBAK7kDKW7zR2qz+eIqYkK
RLutY9LutZ3fA2zzroNvzZScwHwRAepwjoPvKpHXYzLMGFuQns6UqxlbIRXzD/7J
yVrK7zGqHP2Z0uGsyFK0TNDvXYUfdJUPQD+zROc7XzNPuRwHUy/nT2Gz7VdcFz7K
p0ZoUNpB3Jp6g4Tc+xJSx29BAoGBAJKh5t0grwheUeFzE2NHs1GCfXDz8+snw0B7
4kTln2eG9AkqEAZMPXR/oN/2DNO9nW//spYhwNfEtx89AYU8sVhhp3aVCydJ4CV6
ZIgNWGWe6QlwTbN+NoPrlRzX3q3zGzTvdSrx+n1W2Nghk5cprvu2FV+9Q6Wg19SC
r13w7hhRAoGAFjYt9Upj2JPmsPQRMVbL7R5Z5tdtwYNqvB3RTPvG2RZc2D+6ZnO2
AYfym0JrhvAVUUPVjmkDbRV9apXt0sk5EZktnmEBkf5rzPmcCZqkND6hM8BUDcWx
lm3EsI20V4yCvC+Y9EHuUMtR9fzL3yA/N6WtnVrsSCtDOVp++bRVoMI8=
-----END RSA PRIVATE KEY-----
`.trim();

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
