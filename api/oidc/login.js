export default async function handler(req, res) {
  if (req.method === "GET") {
    const { client_id, redirect_uri, state, scope, response_type, nonce } = req.query;

    res.setHeader("Content-Type", "text/html");
    return res.end(`
      <html>
        <body>
          <h2>Login</h2>
          <form method="POST" action="/api/oidc/login">
            <input type="hidden" name="client_id" value="${client_id}" />
            <input type="hidden" name="redirect_uri" value="${redirect_uri}" />
            <input type="hidden" name="state" value="${state}" />
            <input type="hidden" name="scope" value="${scope}" />
            <input type="hidden" name="response_type" value="${response_type}" />
            <input type="hidden" name="nonce" value="${nonce || ''}" />
            <label>Email: <input name="email" type="email" /></label><br/>
            <label>Password: <input name="password" type="password" /></label><br/>
            <button type="submit">Login</button>
          </form>
        </body>
      </html>
    `);
  }

  if (req.method === "POST") {
    const body = await new Promise((resolve, reject) => {
      let data = "";
      req.on("data", chunk => data += chunk);
      req.on("end", () => {
        const params = new URLSearchParams(data);
        resolve(Object.fromEntries(params));
      });
    });

    const { email, password, redirect_uri, state, nonce } = body;

    const TEST_EMAIL = "testuser@example.com";
    const TEST_PASSWORD = "testpassword";

    if (email !== TEST_EMAIL || password !== TEST_PASSWORD) {
      return res.status(401).send("Invalid credentials");
    }

    // Create a code payload with the nonce embedded
    const codePayload = { nonce };

    // Encode payload as base64 JSON string
    const code = Buffer.from(JSON.stringify(codePayload)).toString('base64');

    // Redirect with the encoded code and state
    const redirect = `${redirect_uri}?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;
    return res.redirect(redirect);
  }

  res.status(405).send("Method Not Allowed");
}
