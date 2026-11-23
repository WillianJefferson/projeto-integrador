"use client";

import Link from "next/link";
import SenacLogo from "./SenacLogo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";

export default function PageHeader({ className, logged }) {
  const pathname = usePathname();

  return (
    <header
      className={
        "flex items-center justify-evenly w-full h-30 bg-(--bgColor1) shadow-b z-100 relative " +
        className
      }
    >
      <div className="flex items-center gap-6 h-full">
        <SenacLogo ty />

        <span className="text-(--colorB1) font-bold text-xl">
          Projeto <br /> Integrador
        </span>

        <div className="w-0.5 h-50/100 bg-(--bgColor3)"></div>

        <span className="flex items-center h-50/100 text-(--txtColor2) text-xl w-0 xl:w-max overflow-hidden">
          Plataforma de Projetos Integradores
        </span>
      </div>

      <nav className="flex items-center justify-center gap-15 text-(--txtColor2)">
        <Link
          href={"/"}
          className="flex flex-col items-center px-2 text-(--colorB2) font-bold relative"
        >
          Início
          <div
            className={
              "w-101/100 h-1 bg-(--colorA2) rounded-full absolute top-full " +
              (pathname === "/" ? "" : "hidden")
            }
          />
        </Link>

        <Link
          href={"/entrada"}
          className="flex items-center justify-center gap-2 w-30 h-10 rounded-xl button-gradient"
        >
          <FontAwesomeIcon icon={faUser} />
          Entrar
        </Link>
      </nav>
    </header>
  );
}
