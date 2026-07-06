export default function AccountWeightChartCard({ holdings, summary, won }) {
  const total = summary.total;

  const accountWeights = holdings.reduce((acc, holding) => {
    const account = holding.account || "미분류";

    if (!acc[account]) {
      acc[account] = {
        account,
        amount: 0,
      };
    }

    acc[account].amount += holding.amount;

    return acc;
  }, {});

  const sortedAccounts = Object.values(accountWeights).sort(
    (a, b) => b.amount - a.amount
  );

  return (
    <div className="card">
      <h2>🏦 계좌별 자산 비중</h2>

      {holdings.length === 0 || total <= 0 ? (
        <p className="empty">계좌별 비중을 표시할 보유 ETF가 없습니다.</p>
      ) : (
        <div className="weight-chart">
          {sortedAccounts.map((item) => {
            const weight = (item.amount / total) * 100;

            return (
              <div className="weight-row" key={item.account}>
                <div className="weight-row-header">
                  <span>{item.account}</span>
                  <strong>{weight.toFixed(1)}%</strong>
                </div>

                <div className="weight-bar-bg">
                  <div
                    className="weight-bar-fill"
                    style={{ width: `${weight}%` }}
                  />
                </div>

                <div className="weight-row-meta">
                  <span>{item.account}</span>
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