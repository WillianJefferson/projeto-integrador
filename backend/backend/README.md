# Backend

## Requisitos

- Node.js 20 ou superior
- npm

## Instalação e execução

Na raiz do repositório, instale as dependências e inicie a API:

```bash
npm --prefix backend install
npm --prefix backend run dev
```

A API fica disponível em `http://localhost:3001`; `GET /api/health` verifica se está funcionando.

## Banco de dados

O SQLite cria o arquivo `backend/data/projeto-integrador.sqlite` automaticamente na primeira inicialização. Esse diretório não deve ser versionado.

Para mudar a porta ou o caminho do banco, copie `.env.example` para `.env` dentro de `backend/` e edite os valores. Defina `JWT_SECRET` com um segredo aleatório de pelo menos 32 bytes; por exemplo, gere um com `node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"`. Não use o valor de exemplo em produção. Um `DB_PATH` relativo é resolvido a partir da pasta `backend/`; use `:memory:` apenas para testes.

Os modelos `Usuario` e `Projeto` estão em `src/models/`. A senha deve ser armazenada como hash (`senhaHash`), nunca em texto puro. Projetos pertencem a um usuário e são removidos junto com ele.

Os serviços em `src/services/` oferecem cadastro/login de usuários e operações de projetos. O cadastro e login retornam um token Bearer com validade de uma hora; o segredo deve estar configurado em `JWT_SECRET`. Projetos públicos podem ser listados sem autenticação; projetos de turma ou privados devem ser consultados pelo próprio dono.

## Endpoints da API

- `POST /api/auth/register` — cadastra com `{ "nome", "email", "senha" }`.
- `POST /api/auth/login` — autentica com `{ "email", "senha" }`.
- `GET /api/projetos` — lista projetos públicos.
- `GET /api/projetos/:id` — consulta projeto público; projetos privados e de turma só são visíveis ao dono autenticado.
- `GET /api/projetos/me` — lista os projetos do usuário autenticado.
- `POST /api/projetos` — cria projeto autenticado com `nome`, `descricao` e, opcionalmente, `tecnologias` (lista de textos), `githubUrl`, `demoUrl` e `visibilidade` (`publico`, `turma` ou `privado`).
- `PUT /api/projetos/:id` e `DELETE /api/projetos/:id` — alteram/removem projetos próprios.
- `GET /api/usuarios/me`, `PUT /api/usuarios/me` e `DELETE /api/usuarios/me` — consultam, atualizam nome/email e removem a conta autenticada.

Envie o token retornado no cadastro/login no cabeçalho `Authorization: Bearer <token>`. Não há ainda dados de turma/matrícula para determinar quem pode ver projetos com visibilidade `turma`; por segurança, eles ficam visíveis somente ao autor.

## Testes

```bash
npm --prefix backend test
```
