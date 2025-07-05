export default async function handler(req, res) {
  const { response_type, client_id, redirect_uri, scope, state } = req.query;

  // Basic validation (in real-world: check client_id, redirect_uri, etc.)
  if (!client_id || !redirect_uri) {
    return res.status(400).send("Missing required parameters");
  }

  // Simulate user login + consent
  const code = "mock_auth_code";
  const redirect = `${redirect_uri}?code=${code}&state=${state}`;
  res.redirect(redirect);
}
