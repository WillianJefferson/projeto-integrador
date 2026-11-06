const express = require("express");

const router = express.Router();

const usuarios = [
  {
    id: 1,
    nome: "Administrador",
    email: "admin@email.com",
    senha: "123456",
  },
  {
    id: 2,
    nome: "Usuário Teste",
    email: "teste@email.com",
    senha: "123456",
  },
];

// Lista todos os usuários.
router.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    usuarios,
  });
});

// Busca um usuário pelo ID.
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const usuario = usuarios.find((item) => item.id === Number(id));

  if (!usuario) {
    return res.status(404).json({
      ok: false,
      message: "Usuário não encontrado.",
    });
  }

  const { senha, ...usuarioSemSenha } = usuario;

  return res.status(200).json({
    ok: true,
    usuario: usuarioSemSenha,
  });
});

// Atualiza dados do usuário.
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;
  const index = usuarios.findIndex((item) => item.id === Number(id));

  if (index === -1) {
    return res.status(404).json({
      ok: false,
      message: "Usuário não encontrado.",
    });
  }

  usuarios[index] = {
    ...usuarios[index],
    nome: nome || usuarios[index].nome,
    email: email || usuarios[index].email,
  };

  const { senha, ...usuarioSemSenha } = usuarios[index];

  return res.status(200).json({
    ok: true,
    message: "Usuário atualizado com sucesso.",
    usuario: usuarioSemSenha,
  });
});

// Remove um usuário.
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const index = usuarios.findIndex((item) => item.id === Number(id));

  if (index === -1) {
    return res.status(404).json({
      ok: false,
      message: "Usuário não encontrado.",
    });
  }

  const [usuarioRemovido] = usuarios.splice(index, 1);
  const { senha, ...usuarioSemSenha } = usuarioRemovido;

  return res.status(200).json({
    ok: true,
    message: "Usuário removido com sucesso.",
    usuario: usuarioSemSenha,
  });
});

module.exports = router;
