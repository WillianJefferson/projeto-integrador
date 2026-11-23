const crypto = require("node:crypto");

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function decodeJsonSegment(segment) {
  try {
    return JSON.parse(Buffer.from(segment, "base64url").toString("utf8"));
  } catch {
    return null;
  }
}

function authMiddleware(req, res, next) {
  const authorization = req.headers?.authorization;
  const match =
    typeof authorization === "string" &&
    authorization.match(/^Bearer\s+([^\s]+)$/i);

  if (!match) {
    return next(createError("Token de autenticação não informado.", 401));
  }

  const secret = process.env.JWT_SECRET;
  if (typeof secret !== "string" || Buffer.byteLength(secret, "utf8") < 32) {
    return next(createError("JWT_SECRET deve conter pelo menos 32 bytes.", 500));
  }

  const tokenParts = match[1].split(".");
  if (
    tokenParts.length !== 3 ||
    tokenParts.some((part) => !/^[A-Za-z0-9_-]+$/.test(part))
  ) {
    return next(createError("Token de autenticação inválido ou expirado.", 401));
  }

  const [encodedHeader, encodedPayload, encodedSignature] = tokenParts;
  const header = decodeJsonSegment(encodedHeader);
  const payload = decodeJsonSegment(encodedPayload);

  if (
    !header ||
    header.alg !== "HS256" ||
    !payload ||
    typeof payload !== "object" ||
    Array.isArray(payload) ||
    !Number.isSafeInteger(payload.id) ||
    payload.id <= 0
  ) {
    return next(createError("Token de autenticação inválido ou expirado.", 401));
  }

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest();
  const receivedSignature = Buffer.from(encodedSignature, "base64url");

  if (
    receivedSignature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(receivedSignature, expectedSignature)
  ) {
    return next(createError("Token de autenticação inválido ou expirado.", 401));
  }

  const now = Math.floor(Date.now() / 1000);
  if (
    (payload.exp !== undefined &&
      (typeof payload.exp !== "number" ||
        !Number.isFinite(payload.exp) ||
        now >= payload.exp)) ||
    (payload.nbf !== undefined &&
      (typeof payload.nbf !== "number" ||
        !Number.isFinite(payload.nbf) ||
        now < payload.nbf))
  ) {
    return next(createError("Token de autenticação inválido ou expirado.", 401));
  }

  req.user = payload;
  return next();
}

function optionalAuthMiddleware(req, res, next) {
  if (!req.headers?.authorization) {
    return next();
  }

  return authMiddleware(req, res, next);
}

authMiddleware.optional = optionalAuthMiddleware;

module.exports = authMiddleware;
