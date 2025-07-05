import fetch from 'node-fetch'; // Add to package.json if needed

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { client_id, redirect_uri, state, scope, response_type } = req.query;

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

    const { email, password, redirect_uri, state } = body;

    // 🔐 Validate credentials against your API
    const response = await fetch("https://yourapi.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return res.status(401).send("Invalid credentials");
    }

    const user = await response.json(); // expect `{ id, name, email }`

    // Normally you'd create a session or store this in a DB
    const code = "mock_auth_code"; // Store `code -> user` mapping somewhere

    // Redirect to client's redirect_uri with code
    const redirect = `${redirect_uri}?code=${code}&state=${state}`;
    return res.redirect(redirect);
  }

  res.status(405).send("Method Not Allowed");
}
