export default async function handler(req, res) {
  const { response_type, client_id, redirect_uri, scope, state } = req.query;

  if (!client_id || !redirect_uri) {
    return res.status(400).send("Missing required parameters");
  }

  // Define allowed client IDs (whitelist)
  const allowedClientIds = [
    "client123",
    "myclient",
    "exampleClientId",
    // add more allowed client IDs here
  ];

  if (!allowedClientIds.includes(client_id)) {
    return res.status(400).send("Invalid client_id");
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
