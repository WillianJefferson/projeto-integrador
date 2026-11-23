const usuarioModel = require("../models/usuario");
const asyncHandler = require("../utils/asyncHandler");

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function findCurrentUser(req) {
  const user = usuarioModel.findById(req.user.id);
  if (!user) {
    throw createError("Usuário não encontrado.", 404);
  }

  return user;
}

const getMe = asyncHandler((req, res) => {
  res.status(200).json({
    ok: true,
    usuario: findCurrentUser(req),
  });
});

const updateMe = asyncHandler((req, res) => {
  const body = req.body || {};
  const allowedFields = new Set(["nome", "email"]);
  const fields = Object.keys(body);

  if (
    fields.length === 0 ||
    fields.some((field) => !allowedFields.has(field))
  ) {
    throw createError("Informe somente nome e/ou email para atualizar.", 400);
  }

  if (
    body.nome !== undefined &&
    (typeof body.nome !== "string" ||
      body.nome.trim().length < 2 ||
      body.nome.trim().length > 100)
  ) {
    throw createError("Nome deve ter entre 2 e 100 caracteres.", 400);
  }

  if (
    body.email !== undefined &&
    (typeof body.email !== "string" ||
      body.email.trim().length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim()))
  ) {
    throw createError("Informe um email válido.", 400);
  }

  let user;
  try {
    user = usuarioModel.update(req.user.id, body);
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      throw createError("Este email já está cadastrado.", 409);
    }

    throw error;
  }

  if (!user) {
    throw createError("Usuário não encontrado.", 404);
  }

  res.status(200).json({
    ok: true,
    message: "Dados atualizados com sucesso.",
    usuario: user,
  });
});

const deleteMe = asyncHandler((req, res) => {
  const user = usuarioModel.remove(req.user.id);
  if (!user) {
    throw createError("Usuário não encontrado.", 404);
  }

  res.status(200).json({
    ok: true,
    message: "Conta removida com sucesso.",
    usuario: user,
  });
});

module.exports = {
  deleteMe,
  getMe,
  updateMe,
};