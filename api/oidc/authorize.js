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

  // Expected ACR values
  const requiredAcrEncoded = "onelogin%3Anist%3Alevel%3A1%3Are-auth";
  const requiredAcrDecoded = "urn:be:fedict:iam:fas:citizen:Level400";

  // Validate acr_values
  //if (
  //  !acr_values || 
  //  (acr_values !== requiredAcrEncoded && acr_values !== requiredAcrDecoded)
 // ) {
 //   return res.status(400).send("Invalid or missing acr_values");
 // }

  // Redirect whitelist
  const clientRedirectWhitelist = {
    client123: ["https://ciam-se-eu.onelogin.com/access/idp"]
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

    return res.redirect(`https://customlogin-ciam-demo.com/?${params.toString()}`);
  }

  // Normally return auth code after real authentication
}
