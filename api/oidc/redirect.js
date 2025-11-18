export default async function handler(req, res) {
  try {
    // Take all query params
    const incomingParams = new URLSearchParams(req.query);

    // Append the required ACR value (overwrites if exists)
    incomingParams.set(
      "redirect_uri",
      "https://mycitizenebox.belgium.be/myebox/login/oauth2/code/fas"
    );

    // Build final URL
    const redirectUrl = `https://idp.iamfas.belgium.be/fas/oauth2/authorize?${incomingParams.toString()}`;

    // Redirect the user
    res.redirect(302, redirectUrl);

  } catch (err) {
    console.error("Error building redirect:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
