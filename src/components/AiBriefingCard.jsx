export default function AiBriefingCard({ briefing, aiAdvice }) {
  return (
    <div className="card">
      <h2>🤖 AI 브리핑</h2>

      <p>{briefing}</p>

      {aiAdvice.length > 0 && (
        <ul style={{ marginTop: "10px", paddingLeft: "18px" }}>
          {aiAdvice.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}