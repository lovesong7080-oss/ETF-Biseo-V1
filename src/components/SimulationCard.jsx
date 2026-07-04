export default function SimulationCard({
  simulationResult,
  futureAssetManwon,
  neededRetirementAsset,
  retirementProgress,
}) {
  return (
    <div style={{ marginTop: "20px" }}>
      <b>🎯 목표 달성 시뮬레이션</b>

      {simulationResult.map((item) => (
        <div className="row" key={item.invest}>
          <span>월 {item.invest}만원 투자</span>
          <b>{item.year}년</b>
        </div>
      ))}

      <div className="row">
        <span>목표 달성</span>
        <b>
          {futureAssetManwon >= neededRetirementAsset ? "✅ 가능" : "❌ 부족"}
        </b>
      </div>

      <div
        style={{
          height: "10px",
          background: "#e5e7eb",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${retirementProgress}%`,
            height: "100%",
            background: "#22c55e",
          }}
        />
      </div>
    </div>
  );
}