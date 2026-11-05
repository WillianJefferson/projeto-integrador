
/**
 * Projeto Integrador — SENAC AL
 * D4: Tecnologias Utilizadas
 * Integrantes: Ially e Vinicius
 */

const tecnologias = [
  "Live Share", "HTML", "CSS", "JavaScript",
  "SQLite", "Git", "GitHub", "Live Server"
];

const selecionadas = new Set();

function iniciarTecnologias() {
  const area = document.getElementById("d4-tecnologias");
  if (!area) return;

  area.innerHTML = `
    <section class="d4-tecnologias">
      <h2>Tecnologias utilizadas</h2>
      <p>Selecione as tecnologias do projeto.</p>

      <label for="d4-busca">Buscar tecnologia</label>
      <input id="d4-busca" type="search"
             placeholder="Buscar tecnologia...">

      <div id="d4-lista" class="d4-lista-tecnologias"></div>

      <label for="d4-nova">Adicionar tecnologia</label>
      <div class="d4-adicionar">
        <input id="d4-nova" maxlength="50"
               placeholder="Nome da tecnologia">
        <button id="d4-adicionar" type="button">Adicionar</button>
      </div>

      <h3>Selecionadas</h3>
      <div id="d4-selecionadas" class="d4-selecionadas"
           aria-live="polite"></div>
      <p id="d4-erro" class="d4-erro" role="alert" hidden></p>
    </section>
  `;

  document.getElementById("d4-busca").oninput = renderizar;
  document.getElementById("d4-adicionar").onclick = adicionar;

  document.getElementById("d4-nova").onkeydown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      adicionar();
    }
  };

  renderizar();
}

function renderizar() {
  const lista = document.getElementById("d4-lista");
  const escolhidas = document.getElementById("d4-selecionadas");
  if (!lista || !escolhidas) return;

  const busca = document.getElementById("d4-busca")
    .value.trim().toLowerCase();

  lista.replaceChildren();
  escolhidas.replaceChildren();

  tecnologias
    .filter(t => t.toLowerCase().includes(busca))
    .forEach(t => {
      const botao = document.createElement("button");
      botao.type = "button";
      botao.textContent = t;
      botao.className = "d4-tag-tecnologia";
      botao.classList.toggle("ativa", selecionadas.has(t));
      botao.setAttribute("aria-pressed", selecionadas.has(t));

      botao.onclick = () => {
        selecionadas.has(t) ? selecionadas.delete(t) : selecionadas.add(t);
        atualizar();
      };

      lista.append(botao);
    });

  selecionadas.forEach(t => {
    const tag = document.createElement("span");
    tag.className = "d4-tag-selecionada";
    tag.textContent = `${t} `;

    const remover = document.createElement("button");
    remover.type = "button";
    remover.textContent = "×";
    remover.setAttribute("aria-label", `Remover ${t}`);
    remover.onclick = () => {
      selecionadas.delete(t);
      atualizar();
    };

    tag.append(remover);
    escolhidas.append(tag);
  });

  if (!escolhidas.children.length) {
    escolhidas.textContent = "Nenhuma tecnologia selecionada.";
  }

  if (!lista.children.length) {
    lista.textContent = "Nenhuma tecnologia encontrada.";
  }
}

function adicionar() {
  const campo = document.getElementById("d4-nova");
  const nome = campo.value.trim().replace(/\s+/g, " ");

  if (!nome) return erro("Digite uma tecnologia.");

  const existente = tecnologias.find(
    t => t.toLowerCase() === nome.toLowerCase()
  );

  const tecnologia = existente || nome;

  if (!existente) tecnologias.push(nome);

  selecionadas.add(tecnologia);
  campo.value = "";
  atualizar();
}

function erro(mensagem = "") {
  const elemento = document.getElementById("d4-erro");
  if (!elemento) return;

  elemento.textContent = mensagem;
  elemento.hidden = !mensagem;
}

function atualizar() {
  renderizar();
  erro();

  document.dispatchEvent(new CustomEvent(
    "d4:tecnologias-alteradas",
    { detail: { tecnologias: [...selecionadas] } }
  ));
}

function validar() {
  if (selecionadas.size) {
    erro();
    return true;
  }

  erro("Selecione pelo menos uma tecnologia.");
  return false;
}

function definir(lista = []) {
  if (!Array.isArray(lista)) return;

  selecionadas.clear();

  lista.forEach(nome => {
    if (typeof nome !== "string") return;
    nome = nome.trim().replace(/\s+/g, " ");
    if (!nome || nome.length > 50) return;

    const existente = tecnologias.find(
      t => t.toLowerCase() === nome.toLowerCase()
    );

    if (!existente) tecnologias.push(nome);
    selecionadas.add(existente || nome);
  });

  atualizar();
}

// Funções disponíveis para integrar com outras partes do projeto
window.D4Tecnologias = {
  iniciar: iniciarTecnologias,
  obter: () => [...selecionadas],
  validar,
  definir
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciarTecnologias);
} else {
  iniciarTecnologias();
}
