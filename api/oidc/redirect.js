export default async function handler(req, res) {
  try {
    // Take all query params
    const incomingParams = new URLSearchParams(req.query);

    // Append the required ACR value (overwrites if exists)
    incomingParams.set(
      "acr_values",
      "urn:be:fedict:iam:fas:citizen:Level400bla"
    );

    // Build final URL
    const redirectUrl = `https://customlogin-ciam-demo.com/api/oidc/authorize?${incomingParams.toString()}`;

    // Redirect the user
    res.redirect(302, redirectUrl);

  } catch (err) {
    console.error("Error building redirect:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
