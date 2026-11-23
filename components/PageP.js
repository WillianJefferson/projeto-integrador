export default function PageP({ children, className, style }) {
  return (
    <h1 className={"text-xl text-(--txtColor2) " + className} style={style}>
      {children}
    </h1>
  );
}
