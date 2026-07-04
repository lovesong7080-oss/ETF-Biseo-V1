export default function SimulationCard(props) {
  return (
    <div className="card">
      <h2>🎯 목표 달성 시뮬레이션</h2>

      {props.simulationResult.map((item) => (
        <div className="row" key={item.invest}>
          <span>월 {item.invest}만원 투자</span>
          <b>{item.year}년</b>
        </div>
      ))}

      <div className="row">
        <span>목표 달성</span>
        <b>
          {props.futureAssetManwon >= props.neededRetirementAsset
            ? "✅ 가능"
            : "❌ 부족"}
        </b>
      </div>

      <div
        style={{
          height: "10px",
          background: "#e5e7eb",
          borderRadius: "999px",
          overflow: "hidden",
          marginTop: "8px",
        }}
      >
        <div
          style={{
            width: `${props.retirementProgress}%`,
            height: "100%",
            background: "#22c55e",
          }}
        />
      </div>
    </div>
  );
}