import CollapsibleCard from "./CollapsibleCard";

export default function RegionWeightChartCard({ holdings, summary, won }) {
  const total = summary.total;

  const regionWeights = holdings.reduce((acc, holding) => {
    const region = holding.region || "미분류";

    if (!acc[region]) {
      acc[region] = {
        region,
        amount: 0,
      };
    }

    acc[region].amount += holding.amount;

    return acc;
  }, {});

  const sortedRegions = Object.values(regionWeights).sort(
    (a, b) => b.amount - a.amount
  );

  return (
    <CollapsibleCard title="🌍 지역별 자산 비중">
      {holdings.length === 0 || total <= 0 ? (
        <p className="empty">지역별 비중을 표시할 보유 ETF가 없습니다.</p>
      ) : (
        <div className="weight-chart">
          {sortedRegions.map((item) => {
            const weight = (item.amount / total) * 100;

            return (
              <div className="weight-row" key={item.region}>
                <div className="weight-row-header">
                  <span>{item.region}</span>
                  <strong>{weight.toFixed(1)}%</strong>
                </div>

                <div className="weight-bar-bg">
                  <div
                    className="weight-bar-fill"
                    style={{ width: `${weight}%` }}
                  />
                </div>

                <div className="weight-row-meta">
                  <span>{item.region}</span>
                  <span>{won(item.amount)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </CollapsibleCard>
  );
}