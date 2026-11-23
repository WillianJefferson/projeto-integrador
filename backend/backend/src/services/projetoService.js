const projetoModel = require("../models/projeto");
const usuarioModel = require("../models/usuario");

const VISIBILITIES = new Set(["publico", "turma", "privado"]);
const MAX_TECHNOLOGIES = 30;

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

function requirePositiveInteger(value, fieldName) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number <= 0) {
    throw createError(`${fieldName} inválido.`, 400);
  }

  return number;
}

function validateText(value, fieldName, { min = 1, max }) {
  if (
    typeof value !== "string" ||
    value.trim().length < min ||
    value.trim().length > max
  ) {
    throw createError(`${fieldName} deve ter entre ${min} e ${max} caracteres.`, 400);
  }

  return value.trim();
}

function validateUrl(value, fieldName) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string" || value.length > 2048) {
    throw createError(`${fieldName} inválido.`, 400);
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    throw createError(`${fieldName} deve ser uma URL válida.`, 400);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw createError(`${fieldName} deve usar HTTP ou HTTPS.`, 400);
  }

  return url.toString();
}

function validateTechnologies(value) {
  if (!Array.isArray(value) || value.length > MAX_TECHNOLOGIES) {
    throw createError(`Informe até ${MAX_TECHNOLOGIES} tecnologias em uma lista.`, 400);
  }

  return value.map((technology) =>
    validateText(technology, "Cada tecnologia", { max: 50 })
  );
}

function validateVisibility(value) {
  if (!VISIBILITIES.has(value)) {
    throw createError("Visibilidade deve ser publico, turma ou privado.", 400);
  }

  return value;
}

function listPublicProjects() {
  return projetoModel.list({ visibilidade: "publico" });
}

function findPublicProjectById(id) {
  const projectId = requirePositiveInteger(id, "ID do projeto");
  const project = projetoModel.findById(projectId);

  if (!project || project.visibilidade !== "publico") {
    throw createError("Projeto não encontrado.", 404);
  }

  return project;
}

function findProjectByIdForUser(id, userId) {
  const projectId = requirePositiveInteger(id, "ID do projeto");
  const project = projetoModel.findById(projectId);

  if (!project) {
    throw createError("Projeto não encontrado.", 404);
  }

  if (project.visibilidade !== "publico" && project.usuario_id !== userId) {
    throw createError("Projeto não encontrado.", 404);
  }

  return project;
}

function listUserProjects(userId) {
  const ownerId = requirePositiveInteger(userId, "ID do usuário");
  return projetoModel.list({ usuarioId: ownerId });
}

function createProject({ usuarioId, nome, descricao, tecnologias = [], githubUrl, demoUrl, visibilidade = "publico" } = {}) {
  const ownerId = requirePositiveInteger(usuarioId, "ID do usuário");
  if (!usuarioModel.findById(ownerId)) {
    throw createError("Usuário não encontrado.", 404);
  }

  return projetoModel.create({
    usuarioId: ownerId,
    nome: validateText(nome, "Nome", { max: 150 }),
    descricao: validateText(descricao, "Descrição", { max: 10000 }),
    tecnologias: validateTechnologies(tecnologias),
    githubUrl: validateUrl(githubUrl, "Link do GitHub"),
    demoUrl: validateUrl(demoUrl, "Link da demonstração"),
    visibilidade: validateVisibility(visibilidade),
  });
}

function updateProject(id, userId, changes = {}) {
  const projectId = requirePositiveInteger(id, "ID do projeto");
  const ownerId = requirePositiveInteger(userId, "ID do usuário");
  const project = projetoModel.findById(projectId);

  if (!project) {
    throw createError("Projeto não encontrado.", 404);
  }

  if (project.usuario_id !== ownerId) {
    throw createError("Você não tem permissão para alterar este projeto.", 403);
  }

  const allowedFields = new Set([
    "nome",
    "descricao",
    "tecnologias",
    "githubUrl",
    "demoUrl",
    "status",
    "visibilidade",
  ]);
  if (Object.keys(changes).some((field) => !allowedFields.has(field))) {
    throw createError("A atualização contém campos não permitidos.", 400);
  }

  const validatedChanges = {};
  if (changes.nome !== undefined) {
    validatedChanges.nome = validateText(changes.nome, "Nome", { max: 150 });
  }
  if (changes.descricao !== undefined) {
    validatedChanges.descricao = validateText(changes.descricao, "Descrição", {
      max: 10000,
    });
  }
  if (changes.tecnologias !== undefined) {
    validatedChanges.tecnologias = validateTechnologies(changes.tecnologias);
  }
  if (changes.githubUrl !== undefined) {
    validatedChanges.githubUrl = validateUrl(changes.githubUrl, "Link do GitHub");
  }
  if (changes.demoUrl !== undefined) {
    validatedChanges.demoUrl = validateUrl(
      changes.demoUrl,
      "Link da demonstração"
    );
  }
  if (changes.status !== undefined) {
    validatedChanges.status = validateText(changes.status, "Status", { max: 50 });
  }
  if (changes.visibilidade !== undefined) {
    validatedChanges.visibilidade = validateVisibility(changes.visibilidade);
  }

  if (Object.keys(validatedChanges).length === 0) {
    throw createError("Informe ao menos um campo permitido para atualizar.", 400);
  }

  return projetoModel.update(projectId, validatedChanges);
}

function removeProject(id, userId) {
  const projectId = requirePositiveInteger(id, "ID do projeto");
  const ownerId = requirePositiveInteger(userId, "ID do usuário");
  const project = projetoModel.findById(projectId);

  if (!project) {
    throw createError("Projeto não encontrado.", 404);
  }

  if (project.usuario_id !== ownerId) {
    throw createError("Você não tem permissão para remover este projeto.", 403);
  }

  return projetoModel.remove(projectId);
}

module.exports = {
  createProject,
  findProjectByIdForUser,
  findPublicProjectById,
  listPublicProjects,
  listUserProjects,
  removeProject,
  updateProject,
};