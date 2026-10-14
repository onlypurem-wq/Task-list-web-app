export default function TaskSkeleton({ rows = 4 }) {
  return (
    <ul
      aria-busy="true"
      aria-label="Loading tasks"
      style={{ listStyle: "none", padding: 0 }}
    >
      {Array.from({ length: rows }).map((_, i) => (
        <li
          key={i}
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            margin: "12px 0",
          }}
        >
          <div className="skeleton" style={{ width: 18, height: 18 }} />
          <div
            className="skeleton"
            style={{ width: `${70 - i * 10}%`, height: 16 }}
          />
        </li>
      ))}
    </ul>
  );
}