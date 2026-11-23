const crypto = require("node:crypto");
const { promisify } = require("node:util");
const usuarioModel = require("../models/usuario");
const { signToken } = require("../utils/jwt");

const scrypt = promisify(crypto.scrypt);
const SCRYPT_OPTIONS = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const PASSWORD_HASH_BYTES = 64;

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function validateCredentials({ nome, email, senha }, { requireName = false } = {}) {
  if (
    requireName &&
    (typeof nome !== "string" || nome.trim().length < 2 || nome.trim().length > 100)
  ) {
    throw createError("Nome deve ter entre 2 e 100 caracteres.", 400);
  }

  if (
    typeof email !== "string" ||
    email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    throw createError("Informe um email válido.", 400);
  }

  if (
    typeof senha !== "string" ||
    senha.length < 8 ||
    senha.length > 128
  ) {
    throw createError("A senha deve ter entre 8 e 128 caracteres.", 400);
  }
}

async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const derivedKey = await scrypt(password, salt, PASSWORD_HASH_BYTES, SCRYPT_OPTIONS);

  return `scrypt$${SCRYPT_OPTIONS.N}$${SCRYPT_OPTIONS.r}$${SCRYPT_OPTIONS.p}$${salt.toString("base64url")}$${derivedKey.toString("base64url")}`;
}

async function verifyPassword(password, storedHash) {
  const [algorithm, n, r, p, encodedSalt, encodedHash, ...extra] =
    storedHash.split("$");

  if (
    algorithm !== "scrypt" ||
    n !== String(SCRYPT_OPTIONS.N) ||
    r !== String(SCRYPT_OPTIONS.r) ||
    p !== String(SCRYPT_OPTIONS.p) ||
    !encodedSalt ||
    !encodedHash ||
    extra.length > 0
  ) {
    return false;
  }

  const salt = Buffer.from(encodedSalt, "base64url");
  const expectedHash = Buffer.from(encodedHash, "base64url");
  if (salt.length !== 16 || expectedHash.length !== PASSWORD_HASH_BYTES) {
    return false;
  }

  const actualHash = await scrypt(
    password,
    salt,
    expectedHash.length,
    SCRYPT_OPTIONS
  );
  return crypto.timingSafeEqual(actualHash, expectedHash);
}

function createAccessToken(user) {
  return signToken({
    sub: String(user.id),
    id: user.id,
    nome: user.nome,
    email: user.email,
  });
}

async function register({ nome, email, senha } = {}) {
  validateCredentials({ nome, email, senha }, { requireName: true });

  if (usuarioModel.findByEmail(email)) {
    throw createError("Este email já está cadastrado.", 409);
  }

  const senhaHash = await hashPassword(senha);
  let user;

  try {
    user = usuarioModel.create({ nome, email, senhaHash });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      throw createError("Este email já está cadastrado.", 409);
    }

    throw error;
  }

  return {
    user,
    token: createAccessToken(user),
  };
}

async function login({ email, senha } = {}) {
  if (typeof email !== "string" || typeof senha !== "string") {
    throw createError("Email e senha são obrigatórios.", 400);
  }

  const user = usuarioModel.findByEmail(email);
  if (!user || !(await verifyPassword(senha, user.senha_hash))) {
    throw createError("Credenciais inválidas.", 401);
  }

  const { senha_hash: senhaHash, ...publicUser } = user;
  return {
    user: publicUser,
    token: createAccessToken(publicUser),
  };
}

module.exports = {
  login,
  register,
};