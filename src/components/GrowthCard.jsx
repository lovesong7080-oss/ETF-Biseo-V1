export default function GrowthCard(props) {
  return (
    <div className="card">
      <h2>📈 자산 성장 분석</h2>

      <div className="row">
        <span>10년 후 자산</span>
        <b>{props.asset10Year.toLocaleString()}만원</b>
      </div>

      <div className="row">
        <span>20년 후 자산</span>
        <b>{props.asset20Year.toLocaleString()}만원</b>
      </div>

      <div className="row">
        <span>30년 후 자산</span>
        <b>{props.asset30Year.toLocaleString()}만원</b>
      </div>

      <div style={{ marginTop: "18px" }}>
        <b>📈 자산 성장 그래프</b>

        {props.growthData.map((item) => (
          <div key={item.year} style={{ marginTop: "10px" }}>
            <div className="row">
              <span>{item.year === 0 ? "현재" : `${item.year}년 후`}</span>
              <b>{item.value.toLocaleString()}만원</b>
            </div>

            <div
              style={{
                height: "8px",
                background: "#e5e7eb",
                borderRadius: "999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${Math.min(100, (item.value / props.asset30Year) * 100)}%`,
                  height: "100%",
                  background: "#22c55e",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="row" style={{ marginTop: "16px" }}>
        <span>목표 대비</span>
        <b>
          {props.yearDiff <= 0
            ? `✅ ${Math.abs(props.yearDiff)}년 여유`
            : `⏰ ${props.yearDiff}년 추가`}
        </b>
      </div>
    </div>
  );
}