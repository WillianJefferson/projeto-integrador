export default function PageMain({ children, className }) {
  return (
    <main className={"flex flex-col flex-1 bg-(--bgColor2) " + className}>
      {children}
    </main>
  );
}
