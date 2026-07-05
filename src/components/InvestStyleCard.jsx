export default function InvestStyleCard({ investStyle, setInvestStyle }) {
  return (
    <div className="card">
      <h2>🎯 투자 성향</h2>

      <select
        value={investStyle}
        onChange={(e) => setInvestStyle(e.target.value)}
        style={{ width: "100%", padding: "10px", marginTop: "10px" }}
      >
        <option value="balanced">균형형</option>
        <option value="growth">성장형</option>
        <option value="dividend">배당형</option>
        <option value="safe">안정형</option>
      </select>
    </div>
  );
}