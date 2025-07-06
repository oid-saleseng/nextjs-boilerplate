import fetch from 'node-fetch';

export default async function handler(request, response) {
  let res, data;

  // https://developers.onelogin.com/api-docs/1/oauth20-tokens/generate-tokens-2
  // send client_id & client_secret to /auth/oauth2/v2/token to fetch an access_token
  res = await fetch(`${process.env.SERVER}/auth/oauth2/v2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `client_id:${process.env.CLIENT_ID}, client_secret:${process.env.CLIENT_SECRET}`
    },
    body: JSON.stringify({ "grant_type": "client_credentials" })
  });

  data = await res.json();

  // https://developers.onelogin.com/api-docs/1/login-page/create-session-login-token
  // using the access_token from above, send username, password & subdomain to /api/1/login/auth`
  // to get session_token for the client. Also, set Custom-Allowed-Origin-Header-1 to allow the 
  // client to make a CORS request with the session_token
  res = await fetch(`${process.env.SERVER}/api/1/login/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Custom-Allowed-Origin-Header-1': request.body.host,
      'Authorization': `bearer ${data.access_token}`
    },
    body: JSON.stringify({
      username_or_email: request.body.username,
      password: request.body.password,
      subdomain: process.env.SUBDOMAIN
    })
  });

  data = await res.json();

  return response.status(data.status.code).json(data);
}
