
/**
 * PROJETO INTEGRADOR — SENAC AL
 * D4: Tecnologias, Ferramentas e Competências
 * Responsáveis: Ially e Vinicius
 * JavaScript puro
 */

(() => {
  // Sugestões para diferentes cursos do Senac
  const sugestoes = {
    "Tecnologia": [
      "HTML", "CSS", "JavaScript", "SQLite",
      "Git", "GitHub", "Live Share", "Live Server",
      "Python", "Java", "MySQL"
    ],
    "Saúde e Farmácia": [
      "Controle de estoque", "Biossegurança",
      "Equipamentos laboratoriais",
      "Boas práticas de armazenamento"
    ],
    "Comércio e Gestão": [
      "Atendimento ao cliente", "Gestão de estoque",
      "Excel", "Técnicas de vendas", "Gestão financeira"
    ],
    "Gastronomia": [
      "Segurança alimentar", "Técnicas culinárias",
      "Manipulação de alimentos", "Equipamentos de cozinha"
    ],
    "Beleza e Estética": [
      "Biossegurança", "Atendimento ao cliente",
      "Técnicas de estética", "Equipamentos de estética"
    ]
  };

  const catalogo = new Set(Object.values(sugestoes).flat());
  const selecionadas = new Set();

  const $ = id => document.getElementById(id);
  const normalizar = texto =>
    texto.trim().replace(/\s+/g, " ");

  function encontrar(nome) {
    return [...catalogo].find(
      item => item.toLocaleLowerCase("pt-BR") ===
              nome.toLocaleLowerCase("pt-BR")
    );
  }

  function iniciar() {
    const area = $("d4-tecnologias");
    if (!area || area.dataset.iniciado) return;

    area.dataset.iniciado = "true";

    area.innerHTML = `
      <section class="d4-tecnologias">
        <h2>Tecnologias utilizadas</h2>
        <p>Informe as tecnologias, ferramentas ou
        competências utilizadas no projeto.</p>

        <label for="d4-area">Área do projeto</label>
        <select id="d4-area">
          <option value="">Todas as áreas</option>
          ${Object.keys(sugestoes).map(area =>
            `<option value="${area}">${area}</option>`
          ).join("")}
        </select>

        <label for="d4-busca">Buscar</label>
        <input id="d4-busca" type="search"
               placeholder="Buscar tecnologia ou ferramenta">

        <div id="d4-lista"
             class="d4-lista-tecnologias"></div>

        <label for="d4-nova">Adicionar outro recurso</label>
        <div class="d4-adicionar">
          <input id="d4-nova" type="text" maxlength="60"
                 placeholder="Nome da tecnologia ou competência">
          <button id="d4-adicionar" type="button">
            Adicionar
          </button>
        </div>

        <h3>Recursos selecionados</h3>
        <div id="d4-selecionadas"
             class="d4-selecionadas"
             aria-live="polite"></div>

        <p id="d4-erro" class="d4-erro"
           role="alert" hidden></p>
      </section>
    `;

    $("d4-area").addEventListener("change", renderizar);
    $("d4-busca").addEventListener("input", renderizar);
    $("d4-adicionar").addEventListener("click", adicionar);

    $("d4-nova").addEventListener("keydown", evento => {
      if (evento.key === "Enter") {
        evento.preventDefault();
        adicionar();
      }
    });

    renderizar();
  }

  // Exibe os recursos disponíveis
  function renderizar() {
    const lista = $("d4-lista");
    const escolhidas = $("d4-selecionadas");
    if (!lista || !escolhidas) return;

    const area = $("d4-area").value;
    const busca = normalizar($("d4-busca").value)
      .toLocaleLowerCase("pt-BR");

    const itens = area ? sugestoes[area] : [...catalogo];

    lista.replaceChildren();
    escolhidas.replaceChildren();

    [...new Set(itens)]
      .filter(item =>
        item.toLocaleLowerCase("pt-BR").includes(busca)
      )
      .sort((a, b) => a.localeCompare(b, "pt-BR"))
      .forEach(item => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "d4-tag-tecnologia";
        botao.textContent = item;

        const ativo = selecionadas.has(item);
        botao.classList.toggle("ativa", ativo);
        botao.setAttribute("aria-pressed", String(ativo));

        botao.addEventListener("click", () => {
          ativo ? selecionadas.delete(item) :
                  selecionadas.add(item);
          atualizar();
        });

        lista.append(botao);
      });

    if (!lista.children.length) {
      lista.textContent = "Nenhum recurso encontrado.";
    }

    selecionadas.forEach(item => {
      const tag = document.createElement("span");
      tag.className = "d4-tag-selecionada";

      const nome = document.createElement("span");
      nome.textContent = item;

      const remover = document.createElement("button");
      remover.type = "button";
      remover.textContent = "×";
      remover.setAttribute("aria-label", `Remover ${item}`);

      remover.addEventListener("click", () => {
        selecionadas.delete(item);
        atualizar();
      });

      tag.append(nome, remover);
      escolhidas.append(tag);
    });

    if (!selecionadas.size) {
      escolhidas.textContent = "Nenhum recurso selecionado.";
    }
  }

  // Cadastra um recurso personalizado
  function adicionar() {
    const campo = $("d4-nova");
    if (!campo) return;

    const nome = normalizar(campo.value);

    if (!nome) return mostrarErro("Digite um recurso.");
    if (nome.length > 60) {
      return mostrarErro("Máximo de 60 caracteres.");
    }

    const existente = encontrar(nome);
    const recurso = existente || nome;

    catalogo.add(recurso);
    selecionadas.add(recurso);

    campo.value = "";
    atualizar();
  }

  // Atualiza os dados e notifica outros módulos
  function atualizar() {
    renderizar();
    mostrarErro();

    document.dispatchEvent(new CustomEvent(
      "d4:tecnologias-alteradas",
      { detail: { tecnologias: obter() } }
    ));
  }

  function obter() {
    return [...selecionadas];
  }

  function validar() {
    if (selecionadas.size > 0) {
      mostrarErro();
      return true;
    }

    mostrarErro("Selecione pelo menos um recurso.");
    return false;
  }

  // Recupera os recursos ao editar um projeto
  function definir(lista = []) {
    if (!Array.isArray(lista)) return;

    selecionadas.clear();

    lista.forEach(item => {
      if (typeof item !== "string") return;

      const nome = normalizar(item);
      if (!nome || nome.length > 60) return;

      const recurso = encontrar(nome) || nome;
      catalogo.add(recurso);
      selecionadas.add(recurso);
    });

    atualizar();
  }

  function mostrarErro(mensagem = "") {
    const elemento = $("d4-erro");
    if (!elemento) return;

    elemento.textContent = mensagem;
    elemento.hidden = !mensagem;
  }

  // API pública para o cadastro de projetos
  window.D4Tecnologias = {
    iniciar,
    obter,
    validar,
    definir
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
