const assert = require("node:assert/strict");
const { after, test } = require("node:test");

process.env.DB_PATH = ":memory:";
process.env.JWT_SECRET = "test-secret-with-at-least-thirty-two-bytes";

const app = require("../src/app");
const db = require("../src/config/database");

let server;
let baseUrl;

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
  }
  db.close();
});

async function request(path, { method = "GET", token, body } = {}) {
  const headers = {};
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }
  if (body !== undefined) {
    headers["content-type"] = "application/json";
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  return {
    status: response.status,
    body: await response.json(),
  };
}

test("expõe autenticação, perfil e projetos com autorização", async () => {
  server = app.listen(0);
  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;

  const registration = await request("/api/auth/register", {
    method: "POST",
    body: {
      nome: "Aluna Senac",
      email: "aluna@exemplo.com",
      senha: "senha-segura-123",
    },
  });
  assert.equal(registration.status, 201);
  assert.equal(registration.body.user.email, "aluna@exemplo.com");
  assert.equal(typeof registration.body.token, "string");

  const login = await request("/api/auth/login", {
    method: "POST",
    body: { email: "aluna@exemplo.com", senha: "senha-segura-123" },
  });
  assert.equal(login.status, 200);

  const missingToken = await request("/api/usuarios/me");
  assert.equal(missingToken.status, 401);
  assert.equal(missingToken.body.ok, false);

  const profile = await request("/api/usuarios/me", {
    token: login.body.token,
  });
  assert.equal(profile.status, 200);
  assert.equal(profile.body.usuario.email, "aluna@exemplo.com");

  const profileUpdate = await request("/api/usuarios/me", {
    method: "PUT",
    token: login.body.token,
    body: { nome: "Aluna Atualizada" },
  });
  assert.equal(profileUpdate.status, 200);
  assert.equal(profileUpdate.body.usuario.nome, "Aluna Atualizada");

  const project = await request("/api/projetos", {
    method: "POST",
    token: login.body.token,
    body: {
      nome: "Projeto Público",
      descricao: "Projeto integrador de exemplo.",
      tecnologias: ["Node.js", "SQLite"],
      githubUrl: "https://github.com/senac/projeto",
    },
  });
  assert.equal(project.status, 201);
  assert.equal(project.body.projeto.usuario_id, profile.body.usuario.id);

  const privateProject = await request("/api/projetos", {
    method: "POST",
    token: login.body.token,
    body: {
      nome: "Projeto Privado",
      descricao: "Rascunho do grupo.",
      visibilidade: "privado",
    },
  });
  assert.equal(privateProject.status, 201);

  const publicProjects = await request("/api/projetos");
  assert.deepEqual(
    publicProjects.body.projetos.map((item) => item.nome),
    ["Projeto Público"]
  );
  assert.equal(
    (await request(`/api/projetos/${privateProject.body.projeto.id}`)).status,
    404
  );

  const ownedPrivateProject = await request(
    `/api/projetos/${privateProject.body.projeto.id}`,
    { token: login.body.token }
  );
  assert.equal(ownedPrivateProject.status, 200);

  const otherRegistration = await request("/api/auth/register", {
    method: "POST",
    body: {
      nome: "Outro Aluno",
      email: "outro@exemplo.com",
      senha: "senha-segura-456",
    },
  });
  const forbiddenUpdate = await request(
    `/api/projetos/${privateProject.body.projeto.id}`,
    {
      method: "PUT",
      token: otherRegistration.body.token,
      body: { nome: "Alteração não autorizada" },
    }
  );
  assert.equal(forbiddenUpdate.status, 403);

  const invalidProject = await request("/api/projetos", {
    method: "POST",
    token: login.body.token,
    body: {
      nome: "Projeto Inválido",
      descricao: "Link com protocolo não permitido.",
      githubUrl: "javascript:alert(1)",
    },
  });
  assert.equal(invalidProject.status, 400);

  const deletedAccount = await request("/api/usuarios/me", {
    method: "DELETE",
    token: login.body.token,
  });
  assert.equal(deletedAccount.status, 200);
  assert.equal(
    (await request(`/api/projetos/${project.body.projeto.id}`)).status,
    404
  );
});
