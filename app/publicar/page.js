import PageMain from "@/components/PageMain";
import "./publicar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faFile, faImage, faLink } from "@fortawesome/free-solid-svg-icons";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function Home() {
  function adicionarImagem() {}

  return (
    <PageMain>
      <div className="overlay">
        <div className="modal">
          <header className="modal-header">
            <h2>
              <i className="fa-solid fa-laptop-code"></i>
              Enviar Projeto
            </h2>
            <button id="btnClose" className="btn-close" type="button">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </header>

          <section className="usuario">
            <Image
              src="/avatar-example.jpg"
              alt="Usuário"
              width={100}
              height={100}
              className="w-100 h-100 avatar"
            />
            <div>
              <h3>Kennedy Henrique</h3>
              <select id="visibilidade">
                <option value="Público">Público</option>
                <option value="Somente Turma">Somente Turma</option>
                <option value="Privado">Privado</option>
              </select>
            </div>
          </section>
          <form id="formProjeto">
            <input
              type="text"
              id="titulo"
              placeholder="Título do Projeto"
              required
            />

            <div className="editor-container">
              <label> Descrição do Projeto </label>
              <div
                id="editorDescricao"
                className="editor-descricao"
                contenteditable="true"
                data-placeholder="Conte um pouco sobre seu projeto..."
              ></div>
              <div
                id="areaDropDescricao"
                className="area-drop-descricao relative"
              >
                <i className="fa-solid fa-cloud-arrow-up"></i>
                <p>Arraste imagens ou PDFs aqui</p>
                <span> ou clique para selecionar </span>

                <input
                  type="file"
                  id="arquivosDescricao"
                  accept="image/*,.pdf"
                  multiple
                  className="w-full h-full absolute left-0 top-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <input
              type="text"
              id="tecnologias"
              placeholder="Tecnologias utilizadas: HTML, CSS, JavaScript, React..."
            />
            <div className="upload">
              <label className="drop-area">
                <i className="fa-solid fa-folder-open"></i>
                <h3>Arraste a pasta do projeto</h3>
                <p>ou clique para selecionar</p>
                <input
                  type="file"
                  id="pastaProjeto"
                  webkitdirectory
                  directory
                  multiple
                  hidden
                />
              </label>
            </div>

            <div id="listaArquivos" className="lista-arquivos">
              Nenhuma pasta selecionada.
            </div>

            <div className="barra-anexos">
              {[
                { icon: faImage, id: 0 },
                { icon: faVideo, id: 1 },
                { icon: faFile, id: 2 },
                { icon: faGithub, id: 3 },
                { icon: faLink, id: 4 },
              ].map((icon) => {
                return (
                  <button
                    key={icon.id}
                    type="button"
                    id="btnImagem"
                    title="Adicionar imagem"
                  >
                    <FontAwesomeIcon icon={icon.icon} size="2x" />
                  </button>
                );
              })}
            </div>

            <input
              type="file"
              id="inputImagem"
              accept="image/*"
              multiple
              hidden
            />

            <input type="file" id="inputVideo" accept="video/*" hidden />
            <input type="file" id="inputPdf" accept=".pdf" hidden />
            <div id="anexos" className="anexos"></div>
            <div className="links">
              <input type="url" id="github" placeholder="Link do GitHub" />
              <input type="url" id="demo" placeholder="Link da Demonstração" />
            </div>
            <footer className="acoes">
              <button type="button" className="cancelar">
                Cancelar
              </button>
              <button type="submit" className="publicar">
                <i className="fa-solid fa-upload"></i>
                Enviar Projeto
              </button>
            </footer>
          </form>
        </div>
      </div>
    </PageMain>
  );
}
