export default function PageH2({ children, className }) {
  return (
    <h1 className={"text-4xl text-(--colorB1) font-bold " + className}>
      {children}
    </h1>
  );
}
