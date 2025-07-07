import { kv } from '../lib/kv'; // your Upstash client

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { code, session_token } = req.body;
    if (!code || !session_token) {
      return res.status(400).json({ error: 'Missing code or session_token' });
    }

    await kv.set(code, session_token);

    return res.status(200).json({ message: 'Code stored successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to store code' });
  }
}
