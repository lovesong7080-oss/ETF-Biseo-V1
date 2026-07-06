export default function AssetWeightChartCard({ holdings, summary, won }) {
  const total = summary.total;

  const sortedHoldings = [...holdings].sort((a, b) => b.amount - a.amount);

  return (
    <div className="card">
      <h2>📊 ETF별 자산 비중</h2>

      {holdings.length === 0 || total <= 0 ? (
        <p className="empty">자산 비중을 표시할 보유 ETF가 없습니다.</p>
      ) : (
        <div className="weight-chart">
          {sortedHoldings.map((holding) => {
            const weight = (holding.amount / total) * 100;

            return (
              <div className="weight-row" key={holding.id}>
                <div className="weight-row-header">
                  <span>{holding.name}</span>
                  <strong>{weight.toFixed(1)}%</strong>
                </div>

                <div className="weight-bar-bg">
                  <div
                    className="weight-bar-fill"
                    style={{ width: `${weight}%` }}
                  />
                </div>

                <div className="weight-row-meta">
                  <span>{holding.account}</span>
                  <span>{won(holding.amount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}