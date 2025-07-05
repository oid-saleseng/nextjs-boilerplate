export default async function handler(req, res) {
  // In real-world: validate token
  res.json({
    sub: "1234",
    name: "Test User",
    email: "user@example.com",
  });
}
