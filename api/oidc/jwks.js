import { importSPKI, exportJWK } from 'jose';

export default async function handler(req, res) {
  try {
    // Read base64-encoded PEM public key from env
    const base64PubKey = process.env.PUBLIC_KEY_BASE64;
    if (!base64PubKey) {
      return res.status(500).json({ error: 'Missing PUBLIC_KEY_BASE64 env var' });
    }

    // Decode base64 back to PEM format string
    const pem = Buffer.from(base64PubKey, 'base64').toString('utf-8');

    // Import SPKI PEM to a key object (SPKI = public key format)
    const key = await importSPKI(pem, 'RS256');

    // Export key as JWK
    const jwk = await exportJWK(key);

    // Add required fields to JWK for JWKS
    jwk.kid = 'your-key-id'; // unique key ID, choose something stable
    jwk.use = 'sig';          // this key is for signing
    jwk.alg = 'RS256';

    // JWKS response format
    const jwks = { keys: [jwk] };

    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(jwks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
