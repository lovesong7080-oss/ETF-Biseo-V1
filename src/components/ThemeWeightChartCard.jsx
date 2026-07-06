export default function ThemeWeightChartCard({ holdings, summary, won }) {
  const total = summary.total;

  const themeWeights = holdings.reduce((acc, holding) => {
    const theme = holding.theme || "미분류";

    if (!acc[theme]) {
      acc[theme] = {
        theme,
        amount: 0,
      };
    }

    acc[theme].amount += holding.amount;

    return acc;
  }, {});

  const sortedThemes = Object.values(themeWeights).sort(
    (a, b) => b.amount - a.amount
  );

  return (
    <div className="card">
      <h2>🧩 테마별 자산 비중</h2>

      {holdings.length === 0 || total <= 0 ? (
        <p className="empty">테마별 비중을 표시할 보유 ETF가 없습니다.</p>
      ) : (
        <div className="weight-chart">
          {sortedThemes.map((item) => {
            const weight = (item.amount / total) * 100;

            return (
              <div className="weight-row" key={item.theme}>
                <div className="weight-row-header">
                  <span>{item.theme}</span>
                  <strong>{weight.toFixed(1)}%</strong>
                </div>

                <div className="weight-bar-bg">
                  <div
                    className="weight-bar-fill"
                    style={{ width: `${weight}%` }}
                  />
                </div>

                <div className="weight-row-meta">
                  <span>{item.theme}</span>
                  <span>{won(item.amount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}