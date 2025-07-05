import jwt from "jsonwebtoken";
import { createPrivateKey } from "crypto";

const privateKeyPEM = `
-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCmQOAxDagx4oDD
NeauEcoW8InVbspcb46ogAf1TnszqvtoRUe4ftn1tAb40wVSCVPDYiYRVZN/ldws
ZyyTEO5QwHqC9h4WQ241axI1DIBwGEy4Ee+iYl2dtSAbLhigINLin2TAMnJG5WAp
wagxvf5xPv18w69ZlEscTIK5S8tG5B/rZcopxi/HKiK8Qqf81mQRqRBNglHjj9Vp
jeU1uWa dFnFSX2jI kxdPhsXcnn0w9fuPAdybW+AdpQ0JG0C+ErOFKY9VnvIw1G3
NxV3GQM DKL4akegT QakT6bAdP I CpiklBBJ3tTzRmboUSrKQV V9dnMPRyiH05
JDorLpfR4i48 5AgMBAAECggEAVmdAUF7qu0pBy7xG8yDtSmKweJkD1xJhQi3mf
YqmiDwcfrYo6dXxNbm4FGyqOZp3fIm/QR+MyHfQ/tJu6/cTTG2JcGr6V2pBQldOc
IAX/M9dNzPWLb/NknU4/VR6ciKuMdYcoX+3x9TbWy8Ow6h7EIo7g0DTaE3X4jDfo
7zV1i4INi5LbcSCmHXTjWWeR8i9X1GUYJzCNL4lPrTiYBOZ5Mn8m+py3z4XW7Bkh
k48O/kSzoL0R7F1cs5w8wYwOogkYqA5G4Fpq3/zhBRcOkNlL+9qZfpDb5vNWiO8P
GkEGDA60YvnsXUBQ6w7Vkx76nN5KcQNE9Fi0/1q9SuEX+QKBgQDx+ovXzku+MHUl
+3Kzt71HSj3hNcI3/ikJId0BPPkRFxGfS+FQ38KuMPoR7Tz7Dwq04O8eSTzzntLx
m8ZBd8IgzqEX5dMDQe14oBjiXYP5KuQ9pTSMF68KNG4HTE5FgNRlCHP2T8KsIvIp
llTLu7pJ7X3MJ7LKZB4J1E5sTSf/mQKBgQCO6QNG8b1Pb89XlxNxh1MvG8+QwQGk
UEDTP8Zs1tCCETvCZmB9cJmqKIR9S1AJdZrBO1WZKH36HvH3n5ZrWkHsE7Yc06Ns
ZBZcUy7Vg0iCuI+z2kGzErG/dtAk3fuPJYnEV2q6FtJJGG9q4+qjPa6Otyy03A1f
wJpoD08+bGwIDAQABAoIBAQCLM7GVzB7Q7Hk4X/OrZY6Dkq6bV2cWQzqT7uA6PdP
9M25AOqQmAiyRgPNrvbJqJZckJpHqA3+H/CryR0S+yFglwrnO9GQ9O6wT3E+GxkX
4x9kEpjSZ0Zq2YJ+5xtQDQqzh91Sh7KQCTqScxpfF/x8j8FEHz7Dlt0gMfNeXv/r
nDDK6a7nW10sD6sx6aYd32VkGi1EBZf/V0yF+pHgYnGuk5RaxP59+ZLXTMEWbT88
0F8v6mO5D2GuVPa0HNh38nG/9wgV7icYz/WG5QXguMSmu1q7UmAlp4N98fW0Cx7O
KuYzYDlPBuQHROdNQeHVLh3EvLeu8bQ3LZ36f93rOUOBAoGBALChj44cwvoPXAlZ
b4h9vTzYS13Y0r5Dl4Zz1Nhr6DdptwvXy4kNu5zQkXmVtdXN2iVXe6sRRcsWtv/h
oR7vZsYBYNwhKXqhjUPrhSVFqGxqEtq0p6E7KuQ3xPoKMs5+6DFdQifW+j8p9xM6
TxA19JMd3kXmJqMeGQROoDD12cKBAoGBAMDJVQq5FfHYsmksS0uAr+FQFyMfHgXt
sP6wdM7d4y6aJ5FhfhIFrXdd2iEqEi/yQFtvNfsoQb4spzLfXJt4EtNkaH0uXjCI
iy7wZDY3u2SC0vUSszR9M9CqvyFjZEmBTq6pr5zBYsOUHs1Qukq82flj1Fq4p4x7
Xkz8k6NvK5A7AoGBANx+lKu6DghysRZC6iMvL5/2BfKQPM8Q96L+g+56HkKWMLFc
+vQdLbdhJ4tdtRVRPFPl0SyVe2U4rz2EpqT/7V0r9oNNk7K5Tx2JkmiFJw82gr+b
LsVYEmtOnV9J9RLhfkh4A0mIBd4IuK8oZl4ZAPWXKj6k1a+VDA+miK4hR8xVAoGA
DmFx+NZYd7OpvLPdjx9TCJxiVPo6bLkVyIjfUq09VWn9veHTpYX3uQv8Yyq4JzQZ
XsD+w3fT4fHd7vL8HU1xB/k+NjfN0rBqkRvkh1cZP42K9NgriRwH8VGd4vs3cygl
v+vBzmx7cUIrgOQUyr9GGl1VHlRBsCqa5kaBkfIAXR8=
-----END PRIVATE KEY-----
`.trim();

const privateKey = createPrivateKey({
  key: privateKeyPEM,
  format: 'pem',
  type: 'pkcs8',
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
