import Image from "next/image";

export default function SenacLogo({ type = 0 }) {
  return (
    <Image
      src={`/logo-senac-${type}.png`}
      alt="Logo do Senac"
      width={125}
      height={80}
      style={{ width: "125px", height: "80px" }}
    ></Image>
  );
}
