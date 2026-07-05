export default function SettingsCard({ setHoldings }) {
  return (
    <div className="card">
      <h2>설정</h2>
      <p>자동 저장이 켜져 있습니다.</p>

      <button
        className="danger"
        onClick={() =>
          confirm("모든 데이터를 삭제할까요?") && setHoldings([])
        }
      >
        전체 데이터 삭제
      </button>
    </div>
  );
}