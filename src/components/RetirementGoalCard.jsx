export default function RetirementGoalCard({
  retireAge,
  setRetireAge,
  retireYear,
  setRetireYear,
  pensionManwon,
  setPensionManwon,
  livingCostManwon,
  setLivingCostManwon,
}) {
  return (
    <div className="card">
      <h2>🎯 은퇴 목표</h2>

      <div className="row">
        <span>은퇴 나이</span>
        <input
          type="number"
          value={retireAge}
          onChange={(e) => setRetireAge(Number(e.target.value))}
          style={{ width: "80px" }}
        />
      </div>

      <div className="row">
        <span>은퇴 예정</span>
        <input
          type="number"
          value={retireYear}
          onChange={(e) => setRetireYear(Number(e.target.value))}
          style={{ width: "90px" }}
        />
      </div>

      <div className="row">
        <span>국민연금(만원)</span>
        <input
          type="number"
          value={pensionManwon}
          onChange={(e) => setPensionManwon(Number(e.target.value))}
          style={{ width: "90px" }}
        />
      </div>

      <div className="row">
        <span>목표 생활비(만원)</span>
        <input
          type="number"
          value={livingCostManwon}
          onChange={(e) => setLivingCostManwon(Number(e.target.value))}
          style={{ width: "90px" }}
        />
      </div>
    </div>
  );
}