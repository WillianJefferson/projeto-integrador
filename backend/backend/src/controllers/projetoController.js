const projetoService = require("../services/projetoService");
const asyncHandler = require("../utils/asyncHandler");

const listPublic = asyncHandler((req, res) => {
  res.status(200).json({
    ok: true,
    projetos: projetoService.listPublicProjects(),
  });
});

const listMine = asyncHandler((req, res) => {
  res.status(200).json({
    ok: true,
    projetos: projetoService.listUserProjects(req.user.id),
  });
});

const findById = asyncHandler((req, res) => {
  res.status(200).json({
    ok: true,
    projeto: projetoService.findProjectByIdForUser(
      req.params.id,
      req.user?.id
    ),
  });
});

const create = asyncHandler((req, res) => {
  const project = projetoService.createProject({
    ...req.body,
    usuarioId: req.user.id,
  });

  res.status(201).json({
    ok: true,
    message: "Projeto criado com sucesso.",
    projeto: project,
  });
});

const update = asyncHandler((req, res) => {
  const project = projetoService.updateProject(
    req.params.id,
    req.user.id,
    req.body || {}
  );

  res.status(200).json({
    ok: true,
    message: "Projeto atualizado com sucesso.",
    projeto: project,
  });
});

const remove = asyncHandler((req, res) => {
  const project = projetoService.removeProject(req.params.id, req.user.id);

  res.status(200).json({
    ok: true,
    message: "Projeto removido com sucesso.",
    projeto: project,
  });
});

module.exports = {
  create,
  findById,
  listMine,
  listPublic,
  remove,
  update,
};