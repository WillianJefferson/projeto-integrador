const assert = require("node:assert/strict");
const { after, test } = require("node:test");

process.env.DB_PATH = ":memory:";
process.env.JWT_SECRET = "test-secret-with-at-least-thirty-two-bytes";

const db = require("../src/config/database");
const authService = require("../src/services/authService");
const projetoService = require("../src/services/projetoService");
const usuarioModel = require("../src/models/usuario");
const authMiddleware = require("../src/middlewares/authMiddleware");

after(() => {
  db.close();
});

test("cadastra, autentica e emite um token aceito pelo middleware", async () => {
  const registration = await authService.register({
    nome: "Aluna Senac",
    email: "  ALUNA@EXEMPLO.COM ",
    senha: "senha-segura-123",
  });

  assert.equal(registration.user.email, "aluna@exemplo.com");
  assert.equal("senha_hash" in registration.user, false);
  assert.equal(
    usuarioModel.findByEmail("aluna@exemplo.com").senha_hash.includes(
      "senha-segura-123"
    ),
    false
  );
  assert.match(usuarioModel.findByEmail("aluna@exemplo.com").senha_hash, /^scrypt\$/);

  const req = { headers: { authorization: `Bearer ${registration.token}` } };
  let authError;
  authMiddleware(req, {}, (error) => {
    authError = error;
  });
  assert.equal(authError, undefined);
  assert.equal(req.user.id, registration.user.id);

  const login = await authService.login({
    email: "ALUNA@EXEMPLO.COM",
    senha: "senha-segura-123",
  });
  assert.equal(login.user.id, registration.user.id);
  assert.equal("senha_hash" in login.user, false);
  assert.equal(login.token.split(".").length, 3);

  await assert.rejects(
    authService.register({
      nome: "Outra aluna",
      email: "aluna@exemplo.com",
      senha: "outra-senha-segura",
    }),
    { statusCode: 409 }
  );
  await assert.rejects(
    authService.login({ email: "aluna@exemplo.com", senha: "senha-incorreta" }),
    { statusCode: 401 }
  );
  await assert.rejects(
    authService.register({
      nome: "A",
      email: "nao-e-email",
      senha: "curta",
    }),
    { statusCode: 400 }
  );
});

test("aplica regras de visibilidade e propriedade aos projetos", () => {
  const owner = usuarioModel.create({
    nome: "Dono do Projeto",
    email: "dono@exemplo.com",
    senhaHash: "hash-dono",
  });
  const otherUser = usuarioModel.create({
    nome: "Outro Aluno",
    email: "outro@exemplo.com",
    senhaHash: "hash-outro",
  });

  const publicProject = projetoService.createProject({
    usuarioId: owner.id,
    nome: "Projeto Público",
    descricao: "Projeto visível para a comunidade.",
    tecnologias: ["Node.js", "SQLite"],
    githubUrl: "https://github.com/senac/projeto",
  });
  const privateProject = projetoService.createProject({
    usuarioId: owner.id,
    nome: "Projeto Privado",
    descricao: "Rascunho do grupo.",
    visibilidade: "privado",
  });

  assert.deepEqual(
    projetoService.listPublicProjects().map((project) => project.id),
    [publicProject.id]
  );
  assert.equal(projetoService.findPublicProjectById(publicProject.id).nome, "Projeto Público");
  assert.throws(
    () => projetoService.findPublicProjectById(privateProject.id),
    { statusCode: 404 }
  );
  assert.throws(
    () => projetoService.updateProject(publicProject.id, otherUser.id, { nome: "Alterado" }),
    { statusCode: 403 }
  );
  assert.throws(
    () => projetoService.createProject({
      usuarioId: owner.id,
      nome: "Link Inválido",
      descricao: "Link com protocolo não permitido.",
      githubUrl: "javascript:alert(1)",
    }),
    { statusCode: 400 }
  );

  const updatedProject = projetoService.updateProject(publicProject.id, owner.id, {
    tecnologias: ["TypeScript"],
    visibilidade: "turma",
  });
  assert.deepEqual(updatedProject.tecnologias, ["TypeScript"]);
  assert.equal(updatedProject.visibilidade, "turma");
  assert.equal(projetoService.listPublicProjects().length, 0);
  assert.equal(projetoService.removeProject(privateProject.id, owner.id).id, privateProject.id);
});
