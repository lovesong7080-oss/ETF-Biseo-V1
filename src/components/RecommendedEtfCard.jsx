export default function RecommendedEtfCard({ recommendedEtfGroups }) {
  if (recommendedEtfGroups.length === 0) {
    return null;
  }

  return (
    <div className="card">
      <h2>📈 추천 ETF</h2>

      {recommendedEtfGroups.map((group, i) => (
        <div key={i} style={{ marginTop: "12px" }}>
          <b>{group.title}</b>
          <p style={{ fontSize: "13px", color: "#666", marginTop: "6px" }}>
            {group.desc}
          </p>
          <ul style={{ marginTop: "6px", paddingLeft: "18px" }}>
            {group.items.map((etf, j) => (
              <li key={j}>{etf}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}