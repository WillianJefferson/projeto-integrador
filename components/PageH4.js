export default function PageH4({ children, className }) {
  return (
    <h1 className={"text-2xl text-(--colorB1) font-bold " + className}>
      {children}
    </h1>
  );
}
