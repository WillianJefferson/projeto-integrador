import PageMain from "@/components/PageMain";
import "./projetos.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

export default function Home() {
  return (
    <PageMain>
      <div className="container flex-1 min-w-full ">
        <div className="top-left-title">Vitrine</div>

        <div className="sidebar">
          <div className="profile-card">
            <div className="profile-info">
              <span className="profile-name">Fulano Cliclano B.</span>
              <a href="#" className="profile-link">
                Configurações do perfil
              </a>
            </div>
            <div className="profile-avatar">
              <FontAwesomeIcon icon={faUser} size="2x" />
            </div>
          </div>

          <div className="menu-item active">Meus Projetos</div>
          <div className="menu-item">Vitrine de projetos</div>
          <div className="menu-item">Vitrine de projetos</div>
          <div className="menu-item">Vitrine de projetos</div>
          <div className="menu-item">Vitrine de projetos</div>
          <div className="menu-item">Vitrine de projetos</div>
        </div>

        <div className="main-content">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((project) => {
            return (
              <div key={project} className="project-card">
                <div className="project-image"></div>
                <span className="project-title">Titulo do projeto...</span>
              </div>
            );
          })}
        </div>
      </div>
    </PageMain>
  );
}
