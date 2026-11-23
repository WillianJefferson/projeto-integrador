const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");

const configuredPath = process.env.DB_PATH || "./data/projeto-integrador.sqlite";
const databasePath =
  configuredPath === ":memory:"
    ? configuredPath
    : path.resolve(__dirname, "../../", configuredPath);

if (databasePath !== ":memory:") {
  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
}

const db = new Database(databasePath);

db.pragma("foreign_keys = ON");
db.pragma("journal_mode = WAL");
db.pragma("busy_timeout = 5000");

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL CHECK (length(trim(nome)) > 0),
    email TEXT NOT NULL COLLATE NOCASE UNIQUE CHECK (length(trim(email)) > 0),
    senha_hash TEXT NOT NULL,
    criado_em TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    atualizado_em TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );

  CREATE TABLE IF NOT EXISTS projetos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    nome TEXT NOT NULL CHECK (length(trim(nome)) > 0),
    descricao TEXT NOT NULL CHECK (length(trim(descricao)) > 0),
    tecnologias TEXT NOT NULL DEFAULT '[]' CHECK (json_valid(tecnologias)),
    github_url TEXT,
    demo_url TEXT,
    status TEXT NOT NULL DEFAULT 'ativo' CHECK (length(trim(status)) > 0),
    visibilidade TEXT NOT NULL DEFAULT 'publico'
      CHECK (visibilidade IN ('publico', 'turma', 'privado')),
    criado_em TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    atualizado_em TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_projetos_usuario_id ON projetos(usuario_id);
  CREATE INDEX IF NOT EXISTS idx_projetos_visibilidade_criado_em
    ON projetos(visibilidade, criado_em DESC);
`);

module.exports = db;