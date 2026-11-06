
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const publicDir = path.resolve(__dirname, "../frontend");

const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(
    new URL(req.url, `http://localhost:${PORT}`).pathname
  );

  const relativePath =
    pathname === "/" ? "html/index.html" : `.${pathname}`;

  const filePath = path.resolve(publicDir, relativePath);

  // Impede acesso a arquivos fora da pasta frontend
  if (
    filePath !== publicDir &&
    !filePath.startsWith(publicDir + path.sep)
  ) {
    res.writeHead(403);
    return res.end("403 - Acesso negado");
  }

  const ext = path.extname(filePath);

  const mimeTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".svg": "image/svg+xml"
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("404 - Arquivo não encontrado");
    }

    res.writeHead(200, {
      "Content-Type": mimeTypes[ext] || "application/octet-stream"
    });

    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// // Importa a aplicação configurada no Express.
// const app = require("./app");

// // Usa a porta definida no ambiente ou a padrão 3001.
// const PORT = process.env.PORT || 3001;

// // Inicia o servidor backend.
// app.listen(PORT, () => {
//   console.log(`Servidor backend rodando em http://localhost:${PORT}`);
// });
