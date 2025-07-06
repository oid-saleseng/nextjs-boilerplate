export default async function handler(req, res) {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000/api/oidc";
  res.json({
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/api/oidc/authorize`,
    token_endpoint: `${baseUrl}/api/oidc/token`,
    userinfo_endpoint: `${baseUrl}/api/oidc/userinfo`,
    jwks_uri: `${baseUrl}/api/oidc/jwks`,
    response_types_supported: ["code"],
    subject_types_supported: ["public"],
    id_token_signing_alg_values_supported: ["RS256"],
    grant_types_supported: ["authorization_code"],
  });
}
