function Bar({ label, value, total, pct }) {
  const width = total ? Math.round((value / total) * 100) : 0;

  return (
    <div className="bar-wrap">
      <div className="bar-top">
        <span>{label}</span>
        <b>{pct(value, total)}</b>
      </div>
      <div className="bar-bg">
        <div className="bar-fill" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

const TARGET_ASSETS = ["미국", "한국", "채권"];

function getGapStatus(gapPercent, amount) {
  if (Math.abs(gapPercent) < 1 && Math.abs(amount) < 10000) {
    return {
      label: "적정",
      className: "neutral",
      message: "목표 비중에 거의 맞습니다.",
    };
  }

  if (gapPercent > 0) {
    return {
      label: "부족",
      className: "under",
      message: "추가 매수 우선 후보입니다.",
    };
  }

  return {
    label: "초과",
    className: "over",
    message: "신규 매수는 잠시 줄이는 편이 좋습니다.",
  };
}

export default function AssetAnalysisCard({
  target,
  setTarget,
  currentWeight,
  rebalance,
  needAmount,
  won,
  summary,
  pct,
  etfDb = [],
}) {
  const targetItems = TARGET_ASSETS.map((asset) => {
    const current = currentWeight[asset] || 0;
    const targetWeight = target[asset] || 0;
    const gap = rebalance[asset] || 0;
    const amount = needAmount[asset] || 0;
    const status = getGapStatus(gap, amount);

    return {
      asset,
      current,
      targetWeight,
      gap,
      amount,
      absGap: Math.abs(gap),
      absAmount: Math.abs(amount),
      status,
    };
  });

  const buyPriorityItems = targetItems
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const overweightItems = targetItems
    .filter((item) => item.amount < 0)
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));

  const getCandidateEtfs = (asset) =>
    etfDb
      .filter((etf) => {
        if (asset === "채권") {
          return etf.type === "채권";
        }

        return etf.region === asset && etf.type !== "채권";
      })
      .slice(0, 3);

  return (
    
    <div className="card">
      <h2>📊 목표 비중 분석</h2>

      <div className="target-editor">
        <h3>목표 자산 배분</h3>

        {TARGET_ASSETS.map((asset) => (
          <div className="row" key={asset}>
            <span>{asset}</span>
            <input
              type="number"
              value={target[asset]}
              onChange={(e) =>
                setTarget({ ...target, [asset]: Number(e.target.value) })
              }
            />
          </div>
        ))}
      </div>

      <div className="rebalance-priority-list">
        <h3>매수 우선순위</h3>

        {buyPriorityItems.length > 0 ? (
          buyPriorityItems.map((item, index) => (
            <div className="priority-card buy" key={item.asset}>
              <div className="priority-rank">{index + 1}순위</div>

              <div className="priority-content">
                <strong>{item.asset}</strong>
                <p>
                  {won(item.amount)} 추가 매수 필요 · 부족{" "}
                  {Math.round(item.absGap)}%p
                </p>

                {getCandidateEtfs(item.asset).length > 0 && (
                  <div className="candidate-etfs">
                    <span>후보 ETF</span>
                    <ul>
                      {getCandidateEtfs(item.asset).map((etf) => (
                        <li key={etf.name}>
                          {etf.name}
                          <small>
                            {etf.region} · {etf.type}
                            {etf.theme ? ` · ${etf.theme}` : ""}
                          </small>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="priority-card neutral">
            <div className="priority-rank">OK</div>

            <div className="priority-content">
              <strong>추가 매수 우선순위 없음</strong>
              <p>목표 비중 기준으로 뚜렷하게 부족한 자산군이 없습니다.</p>
            </div>
          </div>
        )}

        {overweightItems.length > 0 && (
          <div className="overweight-note">
            <strong>비중 초과 자산</strong>
            <p>
              {overweightItems
                .map((item) => `${item.asset} ${won(item.absAmount)} 초과`)
                .join(" · ")}
            </p>
          </div>
        )}
      </div>

      <div className="target-gap-list">
        <h3>부족/초과 분석</h3>

        {targetItems.map((item) => (
          <div
            className={`target-gap-card ${item.status.className}`}
            key={item.asset}
          >
            <div className="target-gap-header">
              <strong>{item.asset}</strong>
              <span>{item.status.label}</span>
            </div>

            <div className="target-gap-detail">
              <p>
                현재 {Math.round(item.current)}% / 목표 {item.targetWeight}%
              </p>
              <p>
                {item.gap > 0 ? "부족" : item.gap < 0 ? "초과" : "차이"}{" "}
                {Math.round(item.absGap)}%p · 약 {won(item.absAmount)}
              </p>
            </div>

            <p className="target-gap-message">{item.status.message}</p>
          </div>
        ))}
      </div>

      <div className="target-action-summary">
        <h3>리밸런싱 제안</h3>

        {targetItems.map((item) => (
          <div className="row" key={item.asset}>
            <span>{item.asset}</span>
            <b>
              {item.amount > 0
                ? `${won(item.amount)} 추가 매수 필요`
                : item.amount < 0
                  ? `${won(item.absAmount)} 비중 초과`
                  : "목표 비중 적정"}
            </b>
          </div>
        ))}
      </div>

      <div className="asset-weight-bars">
        <h3>현재 자산 비중</h3>

        <Bar
          label="미국"
          value={summary.byRegion.미국 || 0}
          total={summary.total}
          pct={pct}
        />
        <Bar
          label="한국"
          value={summary.byRegion.한국 || 0}
          total={summary.total}
          pct={pct}
        />
        <Bar label="채권" value={summary.bond} total={summary.total} pct={pct} />
        <Bar
          label="반도체"
          value={summary.semiconductor}
          total={summary.total}
          pct={pct}
        />
      </div>
    </div>
  );
}