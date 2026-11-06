const express = require("express");

const router = express.Router();

const projetos = [
  {
    id: 1,
    nome: "Projeto Integrador",
    descricao: "Sistema para apresentação de projetos e integração entre front e back.",
    status: "ativo",
  },
  {
    id: 2,
    nome: "Aplicativo de Gestão",
    descricao: "Dashboard para controle de atividades e usuários.",
    status: "em desenvolvimento",
  },
];

// Lista todos os projetos.
router.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    projetos,
  });
});

// Busca um projeto pelo ID.
router.get("/:id", (req, res) => {
  const { id } = req.params;
  const projeto = projetos.find((item) => item.id === Number(id));

  if (!projeto) {
    return res.status(404).json({
      ok: false,
      message: "Projeto não encontrado.",
    });
  }

  return res.status(200).json({
    ok: true,
    projeto,
  });
});

// Cria um novo projeto.
router.post("/", (req, res) => {
  const { nome, descricao, status } = req.body;

  if (!nome || !descricao) {
    return res.status(400).json({
      ok: false,
      message: "Nome e descrição são obrigatórios.",
    });
  }

  const novoProjeto = {
    id: projetos.length ? projetos[projetos.length - 1].id + 1 : 1,
    nome,
    descricao,
    status: status || "ativo",
  };

  projetos.push(novoProjeto);

  return res.status(201).json({
    ok: true,
    message: "Projeto criado com sucesso.",
    projeto: novoProjeto,
  });
});

// Atualiza um projeto existente.
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nome, descricao, status } = req.body;
  const index = projetos.findIndex((item) => item.id === Number(id));

  if (index === -1) {
    return res.status(404).json({
      ok: false,
      message: "Projeto não encontrado.",
    });
  }

  projetos[index] = {
    ...projetos[index],
    nome: nome || projetos[index].nome,
    descricao: descricao || projetos[index].descricao,
    status: status || projetos[index].status,
  };

  return res.status(200).json({
    ok: true,
    message: "Projeto atualizado com sucesso.",
    projeto: projetos[index],
  });
});

// Remove um projeto.
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const index = projetos.findIndex((item) => item.id === Number(id));

  if (index === -1) {
    return res.status(404).json({
      ok: false,
      message: "Projeto não encontrado.",
    });
  }

  const [projetoRemovido] = projetos.splice(index, 1);

  return res.status(200).json({
    ok: true,
    message: "Projeto removido com sucesso.",
    projeto: projetoRemovido,
  });
});

module.exports = router;
