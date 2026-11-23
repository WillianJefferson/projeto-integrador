const assert = require("node:assert/strict");
const { test } = require("node:test");

process.env.DB_PATH = ":memory:";

const db = require("../src/config/database");
const usuarioModel = require("../src/models/usuario");
const projetoModel = require("../src/models/projeto");

test("persiste usuários e projetos respeitando seus relacionamentos", () => {
  const usuario = usuarioModel.create({
    nome: "Aluna Senac",
    email: "  ALUNA@EXEMPLO.COM ",
    senhaHash: "hash-seguro",
  });

  assert.equal(usuario.nome, "Aluna Senac");
  assert.equal(usuario.email, "aluna@exemplo.com");
  assert.equal("senha_hash" in usuario, false);
  assert.equal(usuarioModel.findByEmail("ALUNA@EXEMPLO.COM").senha_hash, "hash-seguro");

  assert.throws(
    () =>
      usuarioModel.create({
        nome: "Outra aluna",
        email: "aluna@exemplo.com",
        senhaHash: "outro-hash",
      }),
    { code: "SQLITE_CONSTRAINT_UNIQUE" }
  );

  const projeto = projetoModel.create({
    usuarioId: usuario.id,
    nome: "Portfólio Acadêmico",
    descricao: "Plataforma para apresentar projetos integradores.",
    tecnologias: ["Node.js", "SQLite"],
    githubUrl: "https://github.com/senac/projeto",
  });

  assert.deepEqual(projeto.tecnologias, ["Node.js", "SQLite"]);
  assert.equal(projeto.visibilidade, "publico");
  assert.equal(projetoModel.list({ usuarioId: usuario.id }).length, 1);
  assert.equal(projetoModel.list({ visibilidade: "privado" }).length, 0);

  const projetoAtualizado = projetoModel.update(projeto.id, {
    visibilidade: "privado",
  });
  assert.equal(projetoAtualizado.visibilidade, "privado");
  assert.equal(projetoModel.list({ visibilidade: "privado" }).length, 1);

  assert.throws(
    () =>
      projetoModel.create({
        usuarioId: 9999,
        nome: "Projeto sem autor",
        descricao: "A chave estrangeira deve impedir este registro.",
      }),
    { code: "SQLITE_CONSTRAINT_FOREIGNKEY" }
  );

  usuarioModel.remove(usuario.id);
  assert.equal(usuarioModel.findById(usuario.id), null);
  assert.equal(projetoModel.findById(projeto.id), null);

  db.close();
});
