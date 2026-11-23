const db = require("../config/database");

const publicFields = `
  id,
  nome,
  email,
  criado_em,
  atualizado_em
`;

const findPublicById = db.prepare(`
  SELECT ${publicFields}
  FROM usuarios
  WHERE id = ?
`);

const createUser = db.prepare(`
  INSERT INTO usuarios (nome, email, senha_hash)
  VALUES (@nome, @email, @senhaHash)
`);

const updateUser = db.prepare(`
  UPDATE usuarios
  SET nome = @nome,
      email = @email,
      atualizado_em = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
  WHERE id = @id
`);

const deleteUser = db.prepare("DELETE FROM usuarios WHERE id = ?");

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

function findById(id) {
  return findPublicById.get(id) || null;
}

function findByEmail(email) {
  return (
    db
      .prepare("SELECT id, nome, email, senha_hash FROM usuarios WHERE email = ?")
      .get(normalizeEmail(email)) || null
  );
}

function list() {
  return db
    .prepare(`SELECT ${publicFields} FROM usuarios ORDER BY criado_em DESC, id DESC`)
    .all();
}

function create({ nome, email, senhaHash }) {
  const result = createUser.run({
    nome: nome.trim(),
    email: normalizeEmail(email),
    senhaHash,
  });

  return findById(Number(result.lastInsertRowid));
}

function update(id, changes) {
  const currentUser = findById(id);
  if (!currentUser) {
    return null;
  }

  const nome = changes.nome === undefined ? currentUser.nome : changes.nome.trim();
  const email =
    changes.email === undefined
      ? currentUser.email
      : normalizeEmail(changes.email);

  updateUser.run({ id, nome, email });
  return findById(id);
}

function remove(id) {
  const currentUser = findById(id);
  if (!currentUser) {
    return null;
  }

  deleteUser.run(id);
  return currentUser;
}

module.exports = {
  create,
  findByEmail,
  findById,
  list,
  remove,
  update,
};