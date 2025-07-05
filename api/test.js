export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method === 'GET') {
    // Respond with the environment variable
    res.status(200).json({
      server: process.env.SERVER || 'https://default-server-url.com',
      oidc_client_id: 1223,
      oidc_resource: process.env.OIDC_RESOURCE, // Add a fallback if SERVER is not defined
    });
  } else {
    // Handle any other HTTP method
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
