export default function WaveForm({ type = 0, className }) {
  return (
    <div className={className}>
      {type === 0 ? (
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 149 44"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0V44H149C149 44 119 28.5 76.5 16.5C34 4.5 0 0 0 0Z" />
        </svg>
      ) : (
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 106 140"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M106 0V140H0C0 140 21.3423 90.6818 51.5772 52.5C81.8121 14.3182 106 0 106 0Z" />
        </svg>
      )}
    </div>
  );
}
