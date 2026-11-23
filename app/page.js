import PageH1 from "@/components/PageH1";
import PageH2 from "@/components/PageH2";
import PageH4 from "@/components/PageH4";
import PageMain from "@/components/PageMain";
import PageP from "@/components/PageP";
import WaveForm from "@/components/WaveForm";
import {
  faArrowUpRightFromSquare,
  faRocket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";

const genders = [
  { name: "Desenvolvimento", bgColor: "--colorB3", txtColor: "--colorB1" },
  { name: "Análise de Dados", bgColor: "--colorA3", txtColor: "--colorA1" },
  { name: "Aplicativo Mobile", bgColor: "--colorC2", txtColor: "--colorC1" },
];
const projects = [
  {
    id: 1,
    gender: genders[0],
    name: "Sistema de Gestão",
    description:
      "Plataforma web para organização de atividades, alunos e notas.",
    team: "Equipe TechLearn",
    image: "/image-notebook-2.png",
  },
  {
    id: 2,
    gender: genders[1],
    name: "Indicadores de Desempenho Escolar",
    description: "Análise e visualização de dados com dashboards interativos.",
    team: "Grupo Dados+",
    image: "/image-tablet-1.png",
  },
  {
    id: 3,
    gender: genders[2],
    name: "Bem-Estar Estudantil",
    description:
      "App com recursos para organização, saúde e produtividade do estudante.",
    team: "Equipe Equilíbrio",
    image: "/image-cell-phone-1.png",
  },
];  

export default function Home() {
  return (
    <PageMain className={"items-center"}>
      <section className="flex items-center justify-center gap-8 w-full py-30 relative overflow-hidden">
        <WaveForm
          type={1}
          className={"w-50 fill-(--colorB3) absolute left-0 top-0 rotate-z-180"}
        />
        <WaveForm
          className={"w-100 fill-(--colorA3) absolute left-0 bottom-0"}
        />
        <WaveForm
          type={1}
          className={
            "fill-(--colorA3) w-75 absolute right-0 top-0 rotate-x-180"
          }
        />

        <div className="flex flex-col xl:flex-row w-8xl z-100">
          <div className="flex flex-col xl:flex-row items-center justify-center gap-16 xl:gap-8">
            <Image
              src={"/image-notebook-1.png"}
              alt="Imagem de um notebook."
              width={1000}
              height={1000}
              className="w-160 h-70 xl:w-0"
              loading="eager"
            ></Image>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <PageH1>Projeto Integrador</PageH1>
                <PageP>
                  Compartilhe seus projetos <br /> desenvolva seu portifólio e{" "}
                  <br />
                  habilidades profissionais.
                </PageP>
              </div>

              <Link
                href="/entrada"
                className="flex items-center justify-center gap-2 w-70 h-12 button-gradient rounded-md text-xl"
              >
                <FontAwesomeIcon icon={faRocket} size="1x" />
                Explorar Projetos
              </Link>
            </div>
          </div>

          <Image
            src={"/image-notebook-1.png"}
            alt="Imagem de um notebook."
            width={1000}
            height={1000}
            className="w-160 h-70 scale-0 xl:scale-100"
            loading="eager"
          ></Image>
        </div>
      </section>

      <section className="flex flex-col items-center xl:items-start justify-center gap-20 w-full py-20 bg-(--bgColor1) shadow-t z-100">
        <div className="flex flex-col gap-2 w-8xl xl:pl-40 pl-0">
          <PageH2 className={"relative"}>
            <div className="w-10 h-2 bg-(--colorA1) rounded-full absolute right-100/98 top-1/2 -translate-y-1/2" />
            Projetos em Destaque
          </PageH2>
          <PageP>
            Conheça alguns projetos desenvolvidos por nossos estudantes.
          </PageP>
        </div>

        <div className="flex flex-wrap justify-center w-8xl gap-5">
          {projects.map((project) => {
            return (
              <Link
                href={"/entrada"}
                key={project.id}
                className="flex items-center gap-4 min-w-150 w-150 h-60 p-4 shadow-b rounded-2xl hover:scale-95 hover:brightness-90 duration-250"
              >
                <div
                  className={`h-full aspect-square rounded-xl`}
                  style={{
                    background: `linear-gradient(-20deg,var(${project.gender.txtColor})5%,var(${project.gender.bgColor}))`,
                  }}
                >
                  <Image
                    src={project.image}
                    alt="Imagem de um notebook."
                    width={1000}
                    height={1000}
                    className="w-full h-full object-contain"
                    loading="eager"
                  ></Image>
                </div>

                <div className="flex flex-col gap-2">
                  <PageP
                    className={`flex items-center justify-center w-max h-max px-4  py-1 rounded-full font-semibold`}
                    style={{
                      background: `var(${project.gender.bgColor})`,
                      color: `var(${project.gender.txtColor})`,
                    }}
                  >
                    {project.gender.name}
                  </PageP>

                  <div>
                    <PageH4>{project.name}</PageH4>

                    <PageP>{project.description}</PageP>
                  </div>

                  <div className="flex justify-between w-full">
                    <PageP>
                      <FontAwesomeIcon icon={faUser} /> {project.team}
                    </PageP>

                    <FontAwesomeIcon
                      icon={faArrowUpRightFromSquare}
                      size="2x"
                      className="text-(--colorA1)"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </PageMain>
  );
}
