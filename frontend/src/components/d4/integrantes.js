
/**
 * PROJETO INTEGRADOR — SENAC AL
 * D4: Integrantes dos Projetos
 * Responsáveis: Ially e Vinicius
 * JavaScript puro
 */

(() => {
  // Rota provisória: confirmar com a equipe do backend
  let urlUsuarios = "/api/usuarios";

  let alunosDisponiveis = [];
  let idsPendentes = [];
  let carregando = false;

  const selecionados = new Map();
  const $ = id => document.getElementById(id);

  // Inicializa a interface
  function iniciar() {
    const area = $("d4-integrantes");
    if (!area || area.dataset.iniciado) return;

    area.dataset.iniciado = "true";

    area.innerHTML = `
      <section class="d4-integrantes">
        <h2>Integrantes do projeto</h2>
        <p>Selecione os alunos cadastrados na plataforma.</p>

        <label for="d4-busca-integrante">
          Buscar integrante
        </label>

        <input id="d4-busca-integrante"
               type="search"
               placeholder="Buscar pelo nome do aluno">

        <div id="d4-lista-integrantes"
             class="d4-lista-integrantes"></div>

        <button id="d4-atualizar-integrantes"
                type="button">
          Atualizar lista de alunos
        </button>

        <h3>Integrantes selecionados</h3>

        <div id="d4-integrantes-selecionados"
             class="d4-selecionadas"
             aria-live="polite"></div>

        <p id="d4-erro-integrantes"
           class="d4-erro" role="alert" hidden></p>
      </section>
    `;

    $("d4-busca-integrante")
      .addEventListener("input", renderizar);

    $("d4-atualizar-integrantes")
      .addEventListener("click", carregar);

    renderizar();
    carregar();
  }

  // Busca os usuários cadastrados no backend
  async function carregar() {
    if (carregando) return false;

    carregando = true;
    const botao = $("d4-atualizar-integrantes");

    if (botao) botao.disabled = true;

    const lista = $("d4-lista-integrantes");
    if (lista) lista.textContent = "Carregando alunos...";

    try {
      const resposta = await fetch(urlUsuarios, {
        credentials: "same-origin",
        headers: { Accept: "application/json" }
      });

      if (!resposta.ok) {
        throw new Error(`Erro HTTP ${resposta.status}`);
      }

      const dados = await resposta.json();

      // Aceita um array ou { usuarios: [...] }
      const usuarios = Array.isArray(dados)
        ? dados : dados.usuarios;

      if (!Array.isArray(usuarios)) {
        throw new Error("Resposta da API inválida.");
      }

      // Utiliza somente ID e nome do estudante
      const mapa = new Map();

      usuarios.forEach(usuario => {
        if (
          usuario.id == null ||
          typeof usuario.nome !== "string"
        ) return;

        const id = String(usuario.id);
        const nome = usuario.nome.trim();

        if (id && nome) {
          mapa.set(id, { id, nome });
        }
      });

      alunosDisponiveis = [...mapa.values()];

      // Mantém os integrantes que ainda existem na API
      const ids = new Set([
        ...selecionados.keys(),
        ...idsPendentes
      ]);

      selecionados.clear();

      alunosDisponiveis.forEach(aluno => {
        if (ids.has(aluno.id)) {
          selecionados.set(aluno.id, aluno);
        }
      });

      idsPendentes = [];
      mostrarErro();
      atualizar();

      return true;

    } catch (erro) {
      if (lista) {
        lista.textContent =
          "Não foi possível consultar os alunos.";
      }

      mostrarErro(
        "Erro ao carregar integrantes. Verifique a API."
      );

      console.error("[D4] Falha ao buscar alunos:", erro);
      return false;

    } finally {
      carregando = false;
      if (botao) botao.disabled = false;
    }
  }

  // Exibe usuários e selecionados
  function renderizar() {
    const lista = $("d4-lista-integrantes");
    const area = $("d4-integrantes-selecionados");

    if (!lista || !area) return;

    const busca = $("d4-busca-integrante").value
      .trim().toLocaleLowerCase("pt-BR");

    lista.replaceChildren();
    area.replaceChildren();

    alunosDisponiveis
      .filter(aluno =>
        aluno.nome.toLocaleLowerCase("pt-BR")
          .includes(busca)
      )
      .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
      .forEach(aluno => {
        const botao = document.createElement("button");
        botao.type = "button";
        botao.className = "d4-tag-integrante";
        botao.textContent = aluno.nome;

        const ativo = selecionados.has(aluno.id);

        botao.classList.toggle("ativa", ativo);
        botao.setAttribute("aria-pressed", String(ativo));

        botao.addEventListener("click", () => {
          if (selecionados.has(aluno.id)) {
            selecionados.delete(aluno.id);
          } else {
            selecionados.set(aluno.id, aluno);
          }

          idsPendentes = [];
          atualizar();
        });

        lista.append(botao);
      });

    if (!lista.children.length) {
      lista.textContent = "Nenhum aluno encontrado.";
    }

    selecionados.forEach(aluno => {
      const tag = document.createElement("span");
      tag.className = "d4-tag-selecionada";

      const nome = document.createElement("span");
      nome.textContent = aluno.nome;

      const remover = document.createElement("button");
      remover.type = "button";
      remover.textContent = "×";

      remover.setAttribute(
        "aria-label",
        `Remover ${aluno.nome}`
      );

      remover.addEventListener("click", () => {
        selecionados.delete(aluno.id);
        atualizar();
      });

      tag.append(nome, remover);
      area.append(tag);
    });

    if (!selecionados.size) {
      area.textContent = "Nenhum integrante selecionado.";
    }
  }

  // Atualiza a tela e informa os outros módulos
  function atualizar() {
    renderizar();

    document.dispatchEvent(new CustomEvent(
      "d4:integrantes-alterados",
      { detail: { integrantes: obter() } }
    ));
  }

  // Retorna os IDs dos integrantes
  function obter() {
    return [...selecionados.keys()];
  }

  // Valida antes de salvar
  function validar() {
    if (selecionados.size > 0) {
      mostrarErro();
      return true;
    }

    mostrarErro("Selecione pelo menos um integrante.");
    return false;
  }

  // Carrega os integrantes de um projeto existente
  function definir(ids = []) {
    if (!Array.isArray(ids)) return;

    selecionados.clear();
    idsPendentes = [...new Set(
      ids.filter(id => id != null).map(String)
    )];

    alunosDisponiveis.forEach(aluno => {
      if (idsPendentes.includes(aluno.id)) {
        selecionados.set(aluno.id, aluno);
      }
    });

    atualizar();
  }

  // Permite configurar a rota usada pela outra equipe
  function configurar(opcoes = {}) {
    if (typeof opcoes.urlUsuarios === "string" &&
        opcoes.urlUsuarios.trim()) {
      urlUsuarios = opcoes.urlUsuarios.trim();
    }
  }

  function mostrarErro(mensagem = "") {
    const elemento = $("d4-erro-integrantes");
    if (!elemento) return;

    elemento.textContent = mensagem;
    elemento.hidden = !mensagem;
  }

  // API pública para integração
  window.D4Integrantes = {
    iniciar,
    carregar,
    obter,
    validar,
    definir,
    configurar
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
