import jwt from "jsonwebtoken";
import { createPrivateKey } from "crypto";

const privateKeyPEM = `
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCmQOAxDagx4oDD
NeauEcoW8InVbspcb46ogAf1TnszqvtoRUe4ftn1tAb40wVSCVPDYiYRVZN/ldws
ZyyTEO5QwHqC9h4WQ241axI1DIBwGEy4Ee+iYl2dtSAbLhigINLin2TAMnJG5WAp
wagxvf5xPv18w69ZlEscTIK5S8tG5B/rZcopxi/HKiK8Qqf81mQRqRBNglHjj9Vp
jeU1uWadFnFSX2jIkxdPhsXcnn0w9fuPAdybW+AdpQ0JG0C+ErOFKY9VnvIw1G3N
xV3GQMDKL4akegTQakT6bAdPI CpiklBBJ3tTzRmboUSrKQVV9dnMPRyiH05JDor
LpfR4i485AgMBAAECggEAVmdAUF7qu0pBy7xG8yDtSmKweJkD1xJhQi3mfYqmiDw
cfrYo6dXxNbm4FGyqOZp3fIm/QR+MyHfQ/tJu6/cTTG2JcGr6V2pBQldOcIAX/M9
dNzPWLb/NknU4/VR6ciKuMdYcoX+3x9TbWy8Ow6h7EIo7g0DTaE3X4jDfo7zV1i4
INi5LbcSCmHXTjWWeR8i9X1GUYJzCNL4lPrTiYBOZ5Mn8m+py3z4XW7Bkhk48O/k
SzoL0R7F1cs5w8wYwOogkYqA5G4Fpq3/zhBRcOkNlL+9qZfpDb5vNWiO8PGkEGDA
60YvnsXUBQ6w7Vkx76nN5KcQNE9Fi0/1q9SuEX+QKBgQDx+ovXzku+MHUl+3Kzt7
1HSj3hNcI3/ikJId0BPPkRFxGfS+FQ38KuMPoR7Tz7Dwq04O8eSTzzntLxm8ZBd8
IgzqEX5dMDQe14oBjiXYP5KuQ9pTSMF68KNG4HTE5FgNRlCHP2T8KsIvIpllTLu7
pJ7X3MJ7LKZB4J1E5sTSf/mQKBgQCO6QNG8b1Pb89XlxNxh1MvG8+QwQGkUEDTP8
Zs1tCCETvCZmB9cJmqKIR9S1AJdZrBO1WZKH36HvH3n5ZrWkHsE7Yc06NsZBZcUy
7Vg0iCuI+z2kGzErG/dtAk3fuPJYnEV2q6FtJJGG9q4+qjPa6Otyy03A1fwJpoD0
8+bGwIDAQABAoIBAQCLM7GVzB7Q7Hk4X/OrZY6Dkq6bV2cWQzqT7uA6PdP9M25AO
qQmAiyRgPNrvbJqJZckJpHqA3+H/CryR0S+yFglwrnO9GQ9O6wT3E+GxkX4x9kEp
jSZ0Zq2YJ+5xtQDQqzh91Sh7KQCTqScxpfF/x8j8FEHz7Dlt0gMfNeXv/rnDDK6a
7nW10sD6sx6aYd32VkGi1EBZf/V0yF+pHgYnGuk5RaxP59+ZLXTMEWbT880F8v6m
O5D2GuVPa0HNh38nG/9wgV7icYz/WG5QXguMSmu1q7UmAlp4N98fW0Cx7OKuYzYD
lPBuQHROdNQeHVLh3EvLeu8bQ3LZ36f93rOUOBAoGBALChj44cwvoPXAlZb4h9vT
zYS13Y0r5Dl4Zz1Nhr6DdptwvXy4kNu5zQkXmVtdXN2iVXe6sRRcsWtv/hoR7vZs
YBYNwhKXqhjUPrhSVFqGxqEtq0p6E7KuQ3xPoKMs5+6DFdQifW+j8p9xM6TxA19J
Md3kXmJqMeGQROoDD12cKBAoGBAMDJVQq5FfHYsmksS0uAr+FQFyMfHgXtsP6wdM
7d4y6aJ5FhfhIFrXdd2iEqEi/yQFtvNfsoQb4spzLfXJt4EtNkaH0uXjCIiy7wZD
Y3u2SC0vUSszR9M9CqvyFjZEmBTq6pr5zBYsOUHs1Qukq82flj1Fq4p4x7Xkz8k6
NvK5A7AoGBANx+lKu6DghysRZC6iMvL5/2BfKQPM8Q96L+g+56HkKWMLFc+vQdLb
dhJ4tdtRVRPFPl0SyVe2U4rz2EpqT/7V0r9oNNk7K5Tx2JkmiFJw82gr+bLsVYEm
tOnV9J9RLhfkh4A0mIBd4IuK8oZl4ZAPWXKj6k1a+VDA+miK4hR8xVAoGADmFx+N
ZYd7OpvLPdjx9TCJxiVPo6bLkVyIjfUq09VWn9veHTpYX3uQv8Yyq4JzQZXsD+w3
fT4fHd7vL8HU1xB/k+NjfN0rBqkRvkh1cZP42K9NgriRwH8VGd4vs3cyglv+vBzm
x7cUIrgOQUyr9GGl1VHlRBsCqa5kaBkfIAXR8=
-----END PRIVATE KEY-----
`.trim();

const privateKey = createPrivateKey({
  key: privateKeyPEM,
  format: 'pem'
});


export default async function handler(req, res) {
  const { grant_type, code, redirect_uri, client_id } = req.body || {};

  if (grant_type !== "authorization_code" || code !== "mock_auth_code") {
    return res.status(400).json({ error: "invalid_grant" });
  }

  const now = Math.floor(Date.now() / 1000);
  const id_token = jwt.sign(
    {
      iss: process.env.BASE_URL,
      sub: "1234",
      aud: client_id,
      exp: now + 3600,
      iat: now,
      name: "Test User",
      email: "user@example.com",
    },
    privateKey,
    { algorithm: "RS256" }
  );

  res.json({
    access_token: "mock_access_token",
    token_type: "Bearer",
    expires_in: 3600,
    id_token,
  });
}
