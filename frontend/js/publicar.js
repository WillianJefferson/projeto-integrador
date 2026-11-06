// ==============================
// ELEMENTOS
// ==============================
const form = document.getElementById("formProjeto");
const titulo = document.getElementById("titulo");
const editorDescricao = document.getElementById("editorDescricao");
const areaDropDescricao = document.getElementById("areaDropDescricao");
const arquivosDescricao = document.getElementById("arquivosDescricao");
const tecnologias = document.getElementById("tecnologias");
const visibilidade = document.getElementById("visibilidade");
const pastaProjeto = document.getElementById("pastaProjeto");
const listaArquivos = document.getElementById("listaArquivos");
const anexos = document.getElementById("anexos");

const inputImagem = document.getElementById("inputImagem");
const inputVideo = document.getElementById("inputVideo");
const inputPdf = document.getElementById("inputPdf");

const btnImagem = document.getElementById("btnImagem");
const btnVideo = document.getElementById("btnVideo");
const btnPdf = document.getElementById("btnPdf");
const btnGithub = document.getElementById("btnGithub");
const btnLink = document.getElementById("btnLink");
const btnClose = document.getElementById("btnClose");

const github = document.getElementById("github");
const demo = document.getElementById("demo");

const btnCancelar = document.querySelector(".cancelar");
const overlay = document.querySelector(".overlay");

// ==============================
// ARRAYS
// ==============================
let arquivosProjeto = [];
let anexosProjeto = [];
let anexosDescricao = [];

// Guarda as URLs temporárias das pré-visualizações
const urlsDescricao = new Map();

// ==============================
// UTILITÁRIOS
// ==============================

// Formata o tamanho dos arquivos
function formatarTamanho(bytes) {
  if (bytes < 1024) {
    return bytes + " B";
  }

  if (bytes < 1024 * 1024) {
    return (bytes / 1024).toFixed(1) + " KB";
  }

  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}

// Valida URLs externas
function validarLink(valor) {
  if (!valor.trim()) {
    return true;
  }

  try {
    const url = new URL(valor);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Sanitiza o HTML da descrição
function sanitizarDescricao(html) {
  const documento = new DOMParser().parseFromString(html, "text/html");

  const tagsPermitidas = [
    "P",
    "BR",
    "STRONG",
    "B",
    "EM",
    "I",
    "U",
    "UL",
    "OL",
    "LI",
    "BLOCKQUOTE",
    "H1",
    "H2",
    "H3",
    "A",
  ];

  function limparElemento(elemento) {
    [...elemento.children].forEach((filho) => {
      if (!tagsPermitidas.includes(filho.tagName)) {
        filho.replaceWith(...filho.childNodes);
        return;
      }

      [...filho.attributes].forEach((atributo) => {
        if (filho.tagName !== "A" || atributo.name !== "href") {
          filho.removeAttribute(atributo.name);
        }
      });

      if (filho.tagName === "A") {
        const href = filho.getAttribute("href");

        if (href && !validarLink(href)) {
          filho.removeAttribute("href");
        }

        filho.setAttribute("rel", "noopener noreferrer");
      }

      limparElemento(filho);
    });
  }

  limparElemento(documento.body);

  return documento.body.innerHTML;
}

// ==============================
// EDITOR DE DESCRIÇÃO
// IMAGENS + PDF
// ==============================

areaDropDescricao.addEventListener("click", () => {
  arquivosDescricao.click();
});

arquivosDescricao.addEventListener("change", (e) => {
  adicionarArquivosDescricao(e.target.files);
});

areaDropDescricao.addEventListener("dragover", (e) => {
  e.preventDefault();
  areaDropDescricao.classList.add("arrastando");
});

areaDropDescricao.addEventListener("dragleave", () => {
  areaDropDescricao.classList.remove("arrastando");
});

areaDropDescricao.addEventListener("drop", (e) => {
  e.preventDefault();

  areaDropDescricao.classList.remove("arrastando");

  adicionarArquivosDescricao(e.dataTransfer.files);
});

function adicionarArquivosDescricao(arquivos) {
  [...arquivos].forEach((arquivo) => {
    const permitido =
      arquivo.type.startsWith("image/") || arquivo.type === "application/pdf";

    if (!permitido) {
      alert("Formato não permitido: " + arquivo.name);
      return;
    }

    anexosDescricao.push(arquivo);

    mostrarArquivoDescricao(arquivo);
  });

  arquivosDescricao.value = "";
}

function mostrarArquivoDescricao(arquivo) {
  const bloco = document.createElement("div");
  bloco.className = "arquivo-editor";

  const url = URL.createObjectURL(arquivo);

  urlsDescricao.set(arquivo, url);

  if (arquivo.type.startsWith("image/")) {
    const img = document.createElement("img");

    img.src = url;
    img.alt = arquivo.name;
    img.className = "imagem-editor";

    bloco.appendChild(img);
  } else {
    const nome = document.createElement("p");
    const icone = document.createElement("i");

    icone.className = "fa-solid fa-file-pdf";

    nome.appendChild(icone);
    nome.appendChild(document.createTextNode(" " + arquivo.name));

    bloco.appendChild(nome);

    const pdf = document.createElement("iframe");

    pdf.src = url;
    pdf.title = "Visualização de " + arquivo.name;
    pdf.className = "pdf-editor";

    bloco.appendChild(pdf);
  }

  const remover = document.createElement("button");

  remover.type = "button";
  remover.className = "remover-editor";
  remover.textContent = "✕";
  remover.title = "Remover arquivo";

  remover.addEventListener("click", () => {
    bloco.remove();

    anexosDescricao = anexosDescricao.filter((item) => item !== arquivo);

    URL.revokeObjectURL(url);
    urlsDescricao.delete(arquivo);
  });

  bloco.appendChild(remover);

  editorDescricao.appendChild(bloco);
}

// ==============================
// PASTA DO PROJETO
// ==============================

pastaProjeto.addEventListener("change", () => {
  arquivosProjeto = [...pastaProjeto.files];

  listaArquivos.innerHTML = "";

  if (arquivosProjeto.length === 0) {
    listaArquivos.textContent = "Nenhuma pasta selecionada.";
    return;
  }

  const tituloLista = document.createElement("p");

  tituloLista.textContent =
    "📁 " + arquivosProjeto.length + " arquivos encontrados";

  listaArquivos.appendChild(tituloLista);

  arquivosProjeto.forEach((arquivo) => {
    const item = document.createElement("small");

    item.textContent = arquivo.webkitRelativePath || arquivo.name;

    item.className = "item-arquivo";

    listaArquivos.appendChild(item);
  });
});

// ==============================
// ANEXOS EXTERNOS
// ==============================

// IMAGENS
btnImagem.addEventListener("click", () => {
  inputImagem.click();
});

inputImagem.addEventListener("change", () => {
  [...inputImagem.files].forEach((arquivo) => {
    adicionarAnexo(arquivo, "fa-image", "Imagem");
  });

  inputImagem.value = "";
});

// PDF
btnPdf.addEventListener("click", () => {
  inputPdf.click();
});

inputPdf.addEventListener("change", () => {
  const arquivo = inputPdf.files[0];

  if (arquivo) {
    adicionarAnexo(arquivo, "fa-file-pdf", "PDF");
  }

  inputPdf.value = "";
});

// VÍDEO
btnVideo.addEventListener("click", () => {
  inputVideo.click();
});

inputVideo.addEventListener("change", () => {
  const arquivo = inputVideo.files[0];

  if (arquivo) {
    adicionarAnexo(arquivo, "fa-video", "Vídeo");
  }

  inputVideo.value = "";
});

// ADICIONAR ANEXO
function adicionarAnexo(arquivo, icone, tipo) {
  const tipoValido =
    (tipo === "Imagem" && arquivo.type.startsWith("image/")) ||
    (tipo === "PDF" && arquivo.type === "application/pdf") ||
    (tipo === "Vídeo" && arquivo.type.startsWith("video/"));

  if (!tipoValido) {
    alert("Arquivo inválido: " + arquivo.name);
    return;
  }

  const objeto = {
    arquivo,
    nome: arquivo.name,
    tipo,
    tamanho: arquivo.size,
  };

  anexosProjeto.push(objeto);

  criarCardAnexo(objeto, icone);
}

// CRIAR CARD
function criarCardAnexo(objeto, icone) {
  const card = document.createElement("div");

  card.className = "card-anexo";

  const iconeElemento = document.createElement("i");

  iconeElemento.className = "fa-solid " + icone;

  const informacoes = document.createElement("div");

  const nome = document.createElement("strong");

  nome.textContent = objeto.nome;

  const tipo = document.createElement("small");

  tipo.textContent = objeto.tipo + " • " + formatarTamanho(objeto.tamanho);

  informacoes.appendChild(nome);
  informacoes.appendChild(tipo);

  const remover = document.createElement("button");

  remover.type = "button";
  remover.className = "remover-anexo";
  remover.textContent = "✕";
  remover.title = "Remover anexo";

  remover.addEventListener("click", () => {
    card.remove();

    anexosProjeto = anexosProjeto.filter((item) => item !== objeto);
  });

  card.appendChild(iconeElemento);
  card.appendChild(informacoes);
  card.appendChild(remover);

  anexos.appendChild(card);
}

// ==============================
// LINKS
// ==============================

btnGithub.addEventListener("click", () => {
  const link = prompt("Digite o link do GitHub:");

  if (link !== null && link.trim()) {
    github.value = link.trim();
  }
});

btnLink.addEventListener("click", () => {
  const link = prompt("Digite o link da demonstração:");

  if (link !== null && link.trim()) {
    demo.value = link.trim();
  }
});

// ==============================
// FECHAR MODAL
// ==============================

btnClose.addEventListener("click", () => {
  overlay.style.display = "none";
});

// ==============================
// PUBLICAR PROJETO
// ==============================

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Verifica os links
  if (!validarLink(github.value)) {
    alert("Digite um link válido para o GitHub.");
    github.focus();
    return;
  }

  if (!validarLink(demo.value)) {
    alert("Digite um link válido para a demonstração.");
    demo.focus();
    return;
  }

  // Recupera a descrição sem os cards de anexos
  const descricaoClone = editorDescricao.cloneNode(true);

  descricaoClone
    .querySelectorAll(".arquivo-editor")
    .forEach((elemento) => elemento.remove());

  const descricao = sanitizarDescricao(descricaoClone.innerHTML);

  const projeto = {
    id: Date.now(),

    titulo: titulo.value.trim(),

    descricao,

    anexosDescricao: anexosDescricao.map((item) => ({
      nome: item.name,
      tipo: item.type,
      tamanho: item.size,
    })),

    tecnologias: tecnologias.value.trim(),

    visibilidade: visibilidade.value,

    github: github.value.trim(),

    demo: demo.value.trim(),

    arquivos: arquivosProjeto.length,

    listaArquivos: arquivosProjeto.map((arquivo) => ({
      nome: arquivo.name,
      caminho: arquivo.webkitRelativePath || arquivo.name,
    })),

    anexos: anexosProjeto.map((item) => ({
      nome: item.nome,
      tipo: item.tipo,
      tamanho: item.tamanho,
    })),

    data: new Date().toLocaleDateString("pt-BR"),
  };

  // Salvar no localStorage
  try {
    let projetos = JSON.parse(localStorage.getItem("projetos") || "[]");

    if (!Array.isArray(projetos)) {
      projetos = [];
    }

    projetos.push(projeto);

    localStorage.setItem("projetos", JSON.stringify(projetos));

    alert("Projeto publicado com sucesso!");

    limparFormulario();
  } catch (erro) {
    console.error("Erro ao salvar projeto:", erro);

    alert(
      "Não foi possível salvar o projeto. " +
        "Verifique o espaço disponível no navegador.",
    );
  }
});

// ==============================
// BOTÃO CANCELAR
// ==============================

btnCancelar.addEventListener("click", (e) => {
  e.preventDefault();

  limparFormulario();
});

// ==============================
// LIMPAR TUDO
// ==============================

function limparFormulario() {
  // Liberar memória das pré-visualizações
  urlsDescricao.forEach((url) => {
    URL.revokeObjectURL(url);
  });

  urlsDescricao.clear();

  // Limpar formulário
  form.reset();

  // Limpar editor
  editorDescricao.innerHTML = "";

  // Limpar anexos
  anexos.innerHTML = "";

  // Limpar lista de arquivos
  listaArquivos.textContent = "Nenhuma pasta selecionada.";

  // Limpar arrays
  arquivosProjeto = [];
  anexosProjeto = [];
  anexosDescricao = [];

  // Limpar inputs de arquivos
  inputImagem.value = "";
  inputPdf.value = "";
  inputVideo.value = "";
  arquivosDescricao.value = "";
  pastaProjeto.value = "";

  // Remover estado de arrastamento
  areaDropDescricao.classList.remove("arrastando");
}
