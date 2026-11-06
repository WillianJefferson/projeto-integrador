const express = require("express");

const router = express.Router();

// Rota de cadastro de usuário.
router.post("/register", (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      ok: false,
      message: "Nome, email e senha são obrigatórios.",
    });
  }

  return res.status(201).json({
    ok: true,
    message: "Usuário cadastrado com sucesso.",
    user: {
      nome,
      email,
    },
  });
});

// Rota de login do usuário.
router.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      ok: false,
      message: "Email e senha são obrigatórios.",
    });
  }

  if (email === "admin@email.com" && senha === "123456") {
    return res.status(200).json({
      ok: true,
      message: "Login realizado com sucesso.",
      token: "token-demo-para-desenvolvimento",
      user: {
        nome: "Administrador",
        email,
      },
    });
  }

  return res.status(401).json({
    ok: false,
    message: "Credenciais inválidas.",
  });
});

module.exports = router;
