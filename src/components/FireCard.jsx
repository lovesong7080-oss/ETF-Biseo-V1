export default function FireCard({
  fireAsset80,
  fireAsset90,
  fireAsset100,
}) {
  return (
    <div className="card">
      <h2>🔥 FIRE 분석</h2>

      <div className="row">
        <span>80세 예상자산</span>
        <b>{fireAsset80.toLocaleString()}만원</b>
      </div>

      <div className="row">
        <span>90세 예상자산</span>
        <b>{fireAsset90.toLocaleString()}만원</b>
      </div>

      <div className="row">
        <span>100세 예상자산</span>
        <b>{fireAsset100.toLocaleString()}만원</b>
      </div>
    </div>
  );
}