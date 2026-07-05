import GrowthCard from "./GrowthCard";

export default function RetirementCard({
  yearsLeft,
  monthlyGap,
  neededRetirementAsset,
  currentAsset,
  shortageAsset,
  monthlySavingNeed,
  retirementProgress,
  monthlyInvest,
  setMonthlyInvest,
  expectedReturn,
  setExpectedReturn,
  dividendYield,
  setDividendYield,
  inflationRate,
  setInflationRate,
  futureAssetManwon,
  estimatedRetireYear,
  yearlyDividend,
  monthlyDividend,
  dividendCoverage,
  dividendGap,
  asset10Year,
  asset20Year,
  asset30Year,
  growthData,
  yearDiff,
}) {
  return (
    <div className="card">
      <h2>📊 은퇴 분석</h2>

      <div className="row">
        <span>은퇴까지</span>
        <b>{yearsLeft}년</b>
      </div>

      <div className="row">
        <span>부족 생활비</span>
        <b>{monthlyGap.toLocaleString()}만원/월</b>
      </div>

      <div className="row">
        <span>필요 은퇴자산</span>
        <b>{neededRetirementAsset.toLocaleString()}만원</b>
      </div>

      <div className="row">
        <span>현재 자산</span>
        <b>{currentAsset.toLocaleString()}만원</b>
      </div>

      <div className="row">
        <span>부족한 자산</span>
        <b>{shortageAsset.toLocaleString()}만원</b>
      </div>

      <div className="row">
        <span>매월 필요한 투자금</span>
        <b>{monthlySavingNeed.toLocaleString()}만원</b>
      </div>

      <div style={{ marginTop: "18px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "6px",
            fontWeight: "bold",
          }}
        >
          <span>목표 달성률</span>
          <span>{retirementProgress}%</span>
        </div>

        <div className="row">
          <span>매월 투자</span>
          <input
            type="number"
            value={monthlyInvest}
            onChange={(e) => setMonthlyInvest(Number(e.target.value))}
            style={{ width: "90px", textAlign: "right" }}
          />
        </div>

        <div className="row">
          <span>예상 수익률</span>
          <input
            type="number"
            value={expectedReturn}
            onChange={(e) => setExpectedReturn(Number(e.target.value))}
            style={{ width: "90px", textAlign: "right" }}
          />
        </div>

        <div className="row">
          <span>배당수익률</span>
          <input
            type="number"
            value={dividendYield}
            onChange={(e) => setDividendYield(Number(e.target.value))}
            style={{ width: "90px", textAlign: "right" }}
          />
        </div>

        <div className="row">
          <span>물가상승률</span>
          <input
            type="number"
            value={inflationRate}
            onChange={(e) => setInflationRate(Number(e.target.value))}
            style={{ width: "90px", textAlign: "right" }}
          />
        </div>

        <div className="row">
          <span>예상 은퇴자산</span>
          <b>{futureAssetManwon.toLocaleString()}만원</b>
        </div>

        <div className="row">
          <span>예상 달성 연도</span>
          <b>{estimatedRetireYear}년</b>
        </div>

        <div className="row">
          <span>예상 연 배당금</span>
          <b>{yearlyDividend.toLocaleString()}만원</b>
        </div>

        <div className="row">
          <span>예상 월 배당금</span>
          <b>{monthlyDividend.toLocaleString()}만원</b>
        </div>

        <div className="row">
          <span>배당 생활비 충족률</span>
          <b>{dividendCoverage}%</b>
        </div>

        <div className="row">
          <span>배당 부족액</span>
          <b>{dividendGap.toLocaleString()}만원/월</b>
        </div>

        <GrowthCard
          asset10Year={asset10Year}
          asset20Year={asset20Year}
          asset30Year={asset30Year}
          growthData={growthData}
          yearDiff={yearDiff}
        />
      </div>
    </div>
  );
}