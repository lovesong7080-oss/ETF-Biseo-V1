export default function TotalAssetCard({ summary, won }) {
  return (
    <div className="hero-card">
      <span className="label">총자산</span>

      <strong>{won(summary.total)}</strong>

      <div className="mini-grid">
        <div>
          <span>총 손익</span>
          <b>{won(summary.profit)}</b>
        </div>

        <div>
          <span>수익률</span>
          <b>
            {summary.total
              ? ((summary.profit / (summary.total - summary.profit)) * 100).toFixed(2)
              : 0}
            %
          </b>
        </div>
      </div>
    </div>
  );
}