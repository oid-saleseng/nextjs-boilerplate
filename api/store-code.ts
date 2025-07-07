import type { NextApiRequest, NextApiResponse } from 'next';
import { kv } from '../lib/kv.js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { code, session_token, email, client_id } = req.body;

    if (!code || !session_token || !email || !client_id) {
      return res.status(400).json({
        error: 'Missing one or more required fields: code, session_token, email, client_id',
      });
    }

    // Store all details together in Redis under the code key
    const value = {
      session_token,
      email,
      client_id,
    };

    await kv.set(code, JSON.stringify(value), { ex: 60 }); // expires in 60 seconds

    return res.status(200).json({ message: 'Code and data stored successfully' });
  } catch (err) {
    console.error('Error storing code in Redis:', err);
    return res.status(500).json({ error: 'Failed to store code' });
  }
}
