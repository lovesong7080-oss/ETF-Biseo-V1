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
      <h2>자산 비중</h2>

      <div className="card">
        <h2>🎯 목표 자산배분</h2>

        <div className="row">
          <span>미국</span>
          <input
            type="number"
            value={target.미국}
            onChange={(e) =>
              setTarget({ ...target, 미국: Number(e.target.value) })
            }
          />
        </div>

        <div className="row">
          <span>한국</span>
          <input
            type="number"
            value={target.한국}
            onChange={(e) =>
              setTarget({ ...target, 한국: Number(e.target.value) })
            }
          />
        </div>

        <div className="row">
          <span>채권</span>
          <input
            type="number"
            value={target.채권}
            onChange={(e) =>
              setTarget({ ...target, 채권: Number(e.target.value) })
            }
          />
        </div>

        <div className="card">
          <h2>📊 목표 대비 차이</h2>

          {["미국", "한국", "채권"].map((asset) => (
            <div className="row" key={asset}>
              <span>{asset}</span>
              <b>
                현재 {Math.round(currentWeight[asset])}% / 목표 {target[asset]}
                % / 차이 {Math.round(rebalance[asset])}%
              </b>
            </div>
          ))}
        </div>

        <div className="card">
          <h2>💰 리밸런싱 제안</h2>

          {["미국", "한국", "채권"].map((asset) => (
            <div className="row" key={asset}>
              <span>{asset}</span>
              <b>
                {needAmount[asset] > 0
                  ? `+${won(needAmount[asset])} 매수`
                  : `-${won(Math.abs(needAmount[asset]))} 비중 초과`}
              </b>
            </div>
          ))}
        </div>
      </div>

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
  );
}