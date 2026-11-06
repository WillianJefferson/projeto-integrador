// Importa os módulos principais do backend.
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Carrega as variáveis de ambiente do arquivo .env.
dotenv.config();

// Cria a instância do Express para configurar a API.
const app = express();

// Remove o cabeçalho que expõe a tecnologia do servidor.
app.disable("x-powered-by");

// Permite que apenas alguns endereços front-end acessem a API.
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  process.env.CLIENT_URL,
].filter(Boolean);

// Configura o CORS para aceitar requisições do front-end autorizado.
app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requisições sem origin, como ferramentas internas/tests.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Origem não permitida pelo CORS"));
    },
    credentials: true,
  })
);

// Permite receber JSON e dados de formulários no corpo das requisições.
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Rota base da API para confirmar que o backend está funcionando.
app.get("/", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "API do Projeto Integrador funcionando.",
    timestamp: new Date().toISOString(),
  });
});

// Rota de health check para monitoramento e testes de disponibilidade.
app.get("/api/health", (req, res) => {
  res.status(200).json({
    ok: true,
    status: "online",
    message: "Servidor pronto para receber requisições.",
  });
});

// Middleware para respostas de rota não encontrada.
app.use((req, res) => {
  res.status(404).json({
    ok: false,
    message: "Rota não encontrada.",
  });
});

// Middleware global de tratamento de erros do Express.
app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    ok: false,
    message: err.message || "Erro interno do servidor.",
  });
});

// Exporta o app para ser usado pelo servidor principal.
module.exports = app;

