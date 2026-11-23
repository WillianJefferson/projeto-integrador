const crypto = require("node:crypto");

const TOKEN_LIFETIME_SECONDS = 60 * 60;

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (typeof secret !== "string" || Buffer.byteLength(secret, "utf8") < 32) {
    throw new Error("JWT_SECRET deve conter pelo menos 32 bytes.");
  }

  return secret;
}

function signToken(payload, { expiresIn = TOKEN_LIFETIME_SECONDS } = {}) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new TypeError("O conteúdo do token deve ser um objeto.");
  }

  if (!Number.isInteger(expiresIn) || expiresIn <= 0) {
    throw new TypeError("A validade do token deve ser um inteiro positivo.");
  }

  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" })
  ).toString("base64url");
  const claims = Buffer.from(
    JSON.stringify({ ...payload, iat: now, exp: now + expiresIn })
  ).toString("base64url");
  const unsignedToken = `${header}.${claims}`;
  const signature = crypto
    .createHmac("sha256", getSecret())
    .update(unsignedToken)
    .digest("base64url");

  return `${unsignedToken}.${signature}`;
}

module.exports = { signToken };