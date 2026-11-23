export default function PageH1({ children, className }) {
  return (
    <h1 className={"text-5xl text-(--colorB1) font-bold " + className}>
      {children}
    </h1>
  );
}
