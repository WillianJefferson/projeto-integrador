import Link from "next/link";
import SenacLogo from "./SenacLogo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import WaveForm from "./WaveForm";

const navGroups = [
  {
    groupName: "Navegação",
    vertical: true,
    links: [
      { content: "Início", href: "/" },
      { content: "Entrada", href: "/entrada" },
      { content: "Cadastro", href: "/cadastro" },
    ],
  },
  {
    groupName: "Institucional",
    vertical: true,
    links: [
      { content: "Sobre a Plataforma", href: "/sobre" },
      { content: "Termos de Uso", href: "/termos" },
      { content: "Privacidade", href: "/privacidade" },
    ],
  },
  {
    groupName: "Siga-nos",
    vertical: false,
    links: [
      {
        content: <FontAwesomeIcon icon={faLinkedin} size="2x" />,
        href: "https://br.linkedin.com/company/senac-alagoas",
      },
      {
        content: <FontAwesomeIcon icon={faYoutube} size="2x" />,
        href: "https://www.youtube.com/SenacAlagoasOficial",
      },
      {
        content: <FontAwesomeIcon icon={faInstagram} size="2x" />,
        href: "https://www.instagram.com/senacalagoas/",
      },
    ],
  },
];

export default function PageFooter() {
  return (
    <footer className="flex flex-col items-center justify-evenly px-30 py-5 h-60 bg-(--colorB1) text-(--txtColor1) relative shadow-t z-100">
      <WaveForm
        className={"w-50 absolute left-0 bottom-0 fill-(--colorA1) z-0"}
      />
      <WaveForm
        type={1}
        className={"w-25 absolute right-0 bottom-0 fill-(--colorA2) z-0"}
      />
      <WaveForm
        className={
          "w-50 absolute right-0 bottom-0 rotate-y-180 fill-(--colorA1) z-0"
        }
      />

      <section className="flex items-center justify-evenly w-full h-full z-100">
        <div className="flex items-center gap-6 h-full">
          <SenacLogo type={1} />

          <span className="font-bold text-xl">
            Projeto <br /> Integrador
          </span>

          <span className="flex items-center h-50/100 border-l-2 border-(--bgColor3) pl-8 text-xl">
            Plataforma de Projetos Integradores
          </span>
        </div>

        <nav className="flex gap-10">
          {navGroups.map((navGroup) => {
            return (
              <div key={navGroup.groupName} className="flex flex-col gap-1">
                <span className="font-bold border-b border-(--bgColor3) text-center">
                  {navGroup.groupName}
                </span>

                {navGroup.vertical ? (
                  <ul className="flex flex-col gap-1 pl-5 list-disc">
                    {navGroup.links.map((link) => {
                      return (
                        <li
                          key={link.href}
                          className="hover:text-(--colorA2) duration-250"
                        >
                          {link.href.indexOf("/") > 0 ? (
                            link.content
                          ) : (
                            <span key={link.href}>
                              <Link href={link.href}>{link.content}</Link>
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="flex">
                    {navGroup.links.map((link) => {
                      return (
                        <div
                          key={link.href}
                          className="hover:text-(--colorA2) duration-250"
                        >
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener"
                            referrerPolicy="no-referrer"
                          >
                            {link.content}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </section>

      <section className="flex items-center justify-between w-full pt-4 border-t-2 border-white z-100">
        <span>
          &copy; 2026 Projeto Integrador. Plataforma para divugação de projetos
          integradores.
        </span>

        <span>Desenvolvido para o Senac</span>
      </section>
    </footer>
  );
}
