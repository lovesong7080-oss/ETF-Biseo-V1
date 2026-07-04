export default function RetirementCard(props) {
  return (
    <div className="card">
      <h2>📊 은퇴 분석</h2>

      <div className="row">
        <span>은퇴까지</span>
        <b>{props.yearsLeft}년</b>
      </div>

      <div className="row">
        <span>부족 생활비</span>
        <b>{props.monthlyGap.toLocaleString()}만원/월</b>
      </div>

      <div className="row">
        <span>필요 은퇴자산</span>
        <b>{props.neededRetirementAsset.toLocaleString()}만원</b>
      </div>

      <div className="row">
        <span>현재 자산</span>
        <b>{props.currentAsset.toLocaleString()}만원</b>
      </div>

      <div className="row">
        <span>부족한 자산</span>
        <b>{props.shortageAsset.toLocaleString()}만원</b>
      </div>

      <div className="row">
        <span>매월 필요한 투자금</span>
        <b>{props.monthlySavingNeed.toLocaleString()}만원</b>
      </div>

      <div className="row">
        <span>목표 달성률</span>
        <b>{props.retirementProgress}%</b>
      </div>
    </div>
  );
}