export default async function handler(req, res) {
  const { response_type, client_id, redirect_uri, scope, state, nonce } = req.query;

  if (!client_id || !redirect_uri) {
    return res.status(400).send("Missing required parameters");
  }

  // Your redirect whitelist check here...
  const clientRedirectWhitelist = {
    client123: ["https://ciam-se.onelogin.com/access/idp", "https://example.com/alt"],
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
    // Pass nonce along to login endpoint so it’s not lost
    const params = new URLSearchParams({
      client_id,
      redirect_uri,
      state,
      scope,
      response_type,
      nonce,  // add nonce here
    });

    return res.redirect(`https://nextjs-boilerplate-kbjp.vercel.app/?${params.toString()}`);
  }

  // Normally you'd generate and send auth code here after successful auth
}
