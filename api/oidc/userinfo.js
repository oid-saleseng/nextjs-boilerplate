import { kv } from "../../lib/kv.js"; // adjust path as needed

export default async function handler(req, res) {
  // Expect Authorization: Bearer <access_token>
  const authHeader = req.headers.authorization || "";
  const tokenMatch = authHeader.match(/^Bearer (.+)$/);

  if (!tokenMatch) {
    return res.status(401).json({ error: "invalid_request", error_description: "Missing or invalid Authorization header" });
  }

  const access_token = tokenMatch[1];

  let userDataRaw;
  try {
    userDataRaw = await kv.get(access_token);
  } catch (e) {
    console.error("KV lookup failed:", e);
    return res.status(500).json({ error: "server_error", error_description: "KV failure" });
  }

  if (!userDataRaw) {
    return res.status(401).json({ error: "invalid_token", error_description: "Access token not found or expired" });
  }

  let userData;
  try {
    userData = typeof userDataRaw === "string" ? JSON.parse(userDataRaw) : userDataRaw;
  } catch (e) {
    console.error("Error parsing user data:", e);
    return res.status(500).json({ error: "server_error", error_description: "Corrupt user session data" });
  }

  // Return user info - you can customize fields here
  return res.json({
    email: userData.email,
    client_id: userData.client_id,
    session_token: userData.session_token,
  });
}
