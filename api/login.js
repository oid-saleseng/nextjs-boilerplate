export default async function handler(request, response) {
  const fetch = (await import('node-fetch')).default;

  try {
    // Step 1: Get access token from OneLogin
    const tokenRes = await fetch(`${process.env.SERVER}/auth/oauth2/v2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `client_id:${process.env.CLIENT_ID}, client_secret:${process.env.CLIENT_SECRET}`
      },
      body: JSON.stringify({ grant_type: 'client_credentials' })
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      return response.status(tokenRes.status).json({
        error: 'Failed to get access token',
        details: tokenData
      });
    }

    // Step 2: Authenticate user with session token
    const loginRes = await fetch(`${process.env.SERVER}/api/1/login/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Custom-Allowed-Origin-Header-1': request.body.host || '',
        'Authorization': `bearer ${tokenData.access_token}`
      },
      body: JSON.stringify({
        username_or_email: request.body.username,
        password: request.body.password,
        subdomain: process.env.SUBDOMAIN
      })
    });

    const loginData = await loginRes.json();

    return response.status(loginRes.status).json(loginData);

  } catch (err) {
    return response.status(500).json({
      error: 'Unexpected error occurred',
      message: err.message
    });
  }
}
