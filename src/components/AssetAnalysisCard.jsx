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
}) {
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

      <div className="target-gap-list">
        <h3>부족/초과 분석</h3>

        {TARGET_ASSETS.map((asset) => {
          const current = currentWeight[asset] || 0;
          const targetWeight = target[asset] || 0;
          const gap = rebalance[asset] || 0;
          const amount = needAmount[asset] || 0;
          const status = getGapStatus(gap, amount);
          const absGap = Math.abs(gap);
          const absAmount = Math.abs(amount);

          return (
            <div
              className={`target-gap-card ${status.className}`}
              key={asset}
            >
              <div className="target-gap-header">
                <strong>{asset}</strong>
                <span>{status.label}</span>
              </div>

              <div className="target-gap-detail">
                <p>
                  현재 {Math.round(current)}% / 목표 {targetWeight}%
                </p>
                <p>
                  {gap > 0 ? "부족" : gap < 0 ? "초과" : "차이"}{" "}
                  {Math.round(absGap)}%p · 약 {won(absAmount)}
                </p>
              </div>

              <p className="target-gap-message">{status.message}</p>
            </div>
          );
        })}
      </div>

      <div className="target-action-summary">
        <h3>리밸런싱 제안</h3>

        {TARGET_ASSETS.map((asset) => {
          const amount = needAmount[asset] || 0;

          return (
            <div className="row" key={asset}>
              <span>{asset}</span>
              <b>
                {amount > 0
                  ? `${won(amount)} 추가 매수 필요`
                  : amount < 0
                    ? `${won(Math.abs(amount))} 비중 초과`
                    : "목표 비중 적정"}
              </b>
            </div>
          );
        })}
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