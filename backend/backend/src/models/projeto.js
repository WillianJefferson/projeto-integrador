const db = require("../config/database");

const projectFields = `
  id,
  usuario_id,
  nome,
  descricao,
  tecnologias,
  github_url,
  demo_url,
  status,
  visibilidade,
  criado_em,
  atualizado_em
`;

const findByIdQuery = db.prepare(`
  SELECT ${projectFields}
  FROM projetos
  WHERE id = ?
`);

const createProject = db.prepare(`
  INSERT INTO projetos (
    usuario_id,
    nome,
    descricao,
    tecnologias,
    github_url,
    demo_url,
    status,
    visibilidade
  )
  VALUES (
    @usuarioId,
    @nome,
    @descricao,
    @tecnologias,
    @githubUrl,
    @demoUrl,
    @status,
    @visibilidade
  )
`);

const updateProject = db.prepare(`
  UPDATE projetos
  SET nome = @nome,
      descricao = @descricao,
      tecnologias = @tecnologias,
      github_url = @githubUrl,
      demo_url = @demoUrl,
      status = @status,
      visibilidade = @visibilidade,
      atualizado_em = strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
  WHERE id = @id
`);

function mapProject(row) {
  if (!row) {
    return null;
  }

  return {
    ...row,
    tecnologias: JSON.parse(row.tecnologias),
  };
}

function findById(id) {
  return mapProject(findByIdQuery.get(id));
}

function list({ usuarioId, visibilidade } = {}) {
  const filters = [];
  const parameters = {};

  if (usuarioId !== undefined) {
    filters.push("usuario_id = @usuarioId");
    parameters.usuarioId = usuarioId;
  }

  if (visibilidade !== undefined) {
    filters.push("visibilidade = @visibilidade");
    parameters.visibilidade = visibilidade;
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
  const rows = db
    .prepare(`
      SELECT ${projectFields}
      FROM projetos
      ${whereClause}
      ORDER BY criado_em DESC, id DESC
    `)
    .all(parameters);

  return rows.map(mapProject);
}

function create({
  usuarioId,
  nome,
  descricao,
  tecnologias = [],
  githubUrl = null,
  demoUrl = null,
  status = "ativo",
  visibilidade = "publico",
}) {
  const result = createProject.run({
    usuarioId,
    nome: nome.trim(),
    descricao: descricao.trim(),
    tecnologias: JSON.stringify(tecnologias),
    githubUrl,
    demoUrl,
    status,
    visibilidade,
  });

  return findById(Number(result.lastInsertRowid));
}

function update(id, changes) {
  const currentProject = findById(id);
  if (!currentProject) {
    return null;
  }

  updateProject.run({
    id,
    nome: changes.nome === undefined ? currentProject.nome : changes.nome.trim(),
    descricao:
      changes.descricao === undefined
        ? currentProject.descricao
        : changes.descricao.trim(),
    tecnologias:
      changes.tecnologias === undefined
        ? JSON.stringify(currentProject.tecnologias)
        : JSON.stringify(changes.tecnologias),
    githubUrl:
      changes.githubUrl === undefined
        ? currentProject.github_url
        : changes.githubUrl,
    demoUrl:
      changes.demoUrl === undefined ? currentProject.demo_url : changes.demoUrl,
    status: changes.status === undefined ? currentProject.status : changes.status,
    visibilidade:
      changes.visibilidade === undefined
        ? currentProject.visibilidade
        : changes.visibilidade,
  });

  return findById(id);
}

function remove(id) {
  const currentProject = findById(id);
  if (!currentProject) {
    return null;
  }

  db.prepare("DELETE FROM projetos WHERE id = ?").run(id);
  return currentProject;
}

module.exports = {
  create,
  findById,
  list,
  remove,
  update,
};