export default async function handler(req, res) {
  const { 
    response_type, 
    client_id, 
    redirect_uri, 
    scope, 
    state, 
    nonce, 
    acr_values 
  } = req.query;

  // Required fields
  if (!client_id || !redirect_uri) {
    return res.status(400).send("Missing required parameters");
  }

  // Redirect whitelist
  const clientRedirectWhitelist = {
    client123: ["https://mmacguire-test.onelogin-shadow01.com/access/idp"]
  };

  const allowedRedirects = clientRedirectWhitelist[client_id];
  if (!allowedRedirects) {
    return res.status(400).send("Invalid client_id");
  }

  if (!allowedRedirects.includes(redirect_uri)) {
    return res.status(400).send("Invalid redirect_uri for client_id");
  }

  // Simulated session
  const isAuthenticated = false;

  if (!isAuthenticated) {
    const params = new URLSearchParams({
      client_id,
      redirect_uri,
      state,
      scope,
      response_type,
      nonce,
      acr_values,  // pass as-is
    });

    return res.redirect(`https://nextjs-boilerplate-git-saas-marc-maguires-projects.vercel.app/?${params.toString()}`);
  }

  // Normally return auth code after real authentication
}
