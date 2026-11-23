const authService = require("../services/authService");
const asyncHandler = require("../utils/asyncHandler");

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body || {});

  res.status(201).json({
    ok: true,
    message: "Usuário cadastrado com sucesso.",
    ...result,
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body || {});

  res.status(200).json({
    ok: true,
    message: "Login realizado com sucesso.",
    ...result,
  });
});

module.exports = {
  login,
  register,
};