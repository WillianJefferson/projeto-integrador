// Lucas
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const publicDir = path.join(__dirname, "../frontend/");

const server = http.createServer((req, res) => {
  let filePath = path.join(
    publicDir,
    req.url === "/" ? "index.html" : req.url
  );

  const ext = path.extname(filePath);

  const mimeTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
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
//Lucas