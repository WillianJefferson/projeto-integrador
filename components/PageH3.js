export default function PageH3({ children, className }) {
  return (
    <h1 className={"text-3xl text-(--colorB1) font-bold " + className}>
      {children}
    </h1>
  );
}
