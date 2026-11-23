"use client";

import {
  faEnvelope,
  faLock,
  faUser,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageH4 from "./PageH4";
import PageH2 from "./PageH2";
import PageP from "./PageP";

const formInputs = [
  {
    name: "Nome completo",
    required: true,
    placeholder: "Digite seu nome completo",
    icon: (
      <FontAwesomeIcon icon={faUser} size="2x" className="text-(--bgColor4)" />
    ),
  },
  {
    name: "E-mail",
    required: true,
    placeholder: "Digite seu e-mail institucional ou pessoal",
    icon: (
      <FontAwesomeIcon
        icon={faEnvelope}
        size="2x"
        className="text-(--bgColor4)"
      />
    ),
  },
  {
    name: "Senha",
    required: true,
    placeholder: "Digite uma senha (minímo 8 caracteres)",
    icon: (
      <FontAwesomeIcon icon={faLock} size="2x" className="text-(--bgColor4)" />
    ),
  },
  {
    name: "Confirmar Senha",
    required: true,
    placeholder: "Repita sua senha",
    icon: (
      <FontAwesomeIcon icon={faLock} size="2x" className="text-(--bgColor4)" />
    ),
  },
];

export default function SignonForm() {
  const router = useRouter();

  return (
    <form
      className="flex flex-col items-center gap-5 w-150 h-max p-10 bg-(--bgColor1) rounded-2xl shadow-b z-100"
      onSubmit={(e) => {
        e.preventDefault();
        router.push("/projetos");
      }}
    >
      <div className="flex gap-4 w-full">
        <div className="flex items-center justify-center w-16 min-w-16 h-16 bg-(--colorA3) rounded-md text-(--colorA1)">
          <FontAwesomeIcon icon={faUserPlus} size="2x" />
        </div>

        <div>
          <PageH2>Cadastro</PageH2>
          <PageP>Crie sua conta aqui</PageP>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {formInputs.map((input) => {
          return (
            <div key={input.name} className="flex flex-col gap-1">
              <PageH4>
                {input.name}{" "}
                <span className="text-(--colorA1)">
                  {input.required ? "*" : ""}
                </span>
              </PageH4>

              <div className="flex items-center justify-center gap-2 p-3 border-2 border-(--bgColor3) rounded-xl">
                {input.icon}

                <input
                  className="w-full h-full text-xl text-(--txtColor2) placeholder:text-(--bgColor4)"
                  placeholder={input.placeholder}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col items-center justify-center gap-2 w-full">
        <button className="flex items-center justify-center gap-2 w-full h-14 button-gradient rounded-xl text-xl cursor-pointer">
          <FontAwesomeIcon icon={faUserPlus} />
          Criar conta
        </button>

        <Link
          href={"/entrada"}
          className="w-max text-(--linkColor) font-bold text-center border-b-2"
        >
          Já tem conta? Clique aqui
        </Link>
      </div>
    </form>
  );
}
