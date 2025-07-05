export default async function handler(req, res) {
  const { response_type, client_id, redirect_uri, scope, state } = req.query;

  if (!client_id || !redirect_uri) {
    return res.status(400).send("Missing required parameters");
  }

  // Whitelist of allowed redirect URIs per client_id
  const clientRedirectWhitelist = {
    client123: ["https://example.com/callback", "https://example.com/alt"],
    myclient: ["https://myapp.com/auth/callback"],
    testclient: ["http://localhost:3000/callback"],
  };

  const allowedRedirects = clientRedirectWhitelist[client_id];

  if (!allowedRedirects) {
    return res.status(400).send("Invalid client_id");
  }

  if (!allowedRedirects.includes(redirect_uri)) {
    return res.status(400).send("Invalid redirect_uri for client_id");
  }

  // Simulate session (in real world use cookies)
  const isAuthenticated = false;

  if (!isAuthenticated) {
    const params = new URLSearchParams({
      client_id,
      redirect_uri,
      state,
      scope,
      response_type,
    });

    return res.redirect(`/api/oidc/login?${params.toString()}`);
  }

  // Otherwise, issue code directly (not reached in this version)
}
