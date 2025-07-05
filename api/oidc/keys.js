export default async function handler(req, res) {
  const { generateKeyPairSync } = require("crypto");

// Generate a public/private keypair once (or hardcode your key for now)
const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

module.exports = { privateKey, publicKey }; 
}
