export default function SettingsCard({ setHoldings }) {
  const handleResetHoldings = () => {
    const ok = confirm(
      "보유 ETF 목록을 모두 초기화할까요?\n이 작업은 되돌릴 수 없습니다."
    );

    if (!ok) return;

    setHoldings([]);
  };

  return (
    <div className="card">
      <h2>설정</h2>
      <p>자동 저장이 켜져 있습니다.</p>

      <button
        className="danger"
        onClick={handleResetHoldings}
      >
        보유 ETF 전체 초기화
      </button>
    </div>
  );
}