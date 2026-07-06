import { useRef } from "react";

export default function SettingsCard({ holdings, setHoldings }) {
  const fileInputRef = useRef(null);
  const holdingCount = holdings.length;
  const hasHoldings = holdingCount > 0;

  const handleBackupHoldings = () => {
    if (!hasHoldings) {
      alert("백업할 보유 ETF가 없습니다.");
      return;
    }

    const backupData = {
      app: "ETF-Biseo-V1",
      type: "holdings-backup",
      version: 1,
      createdAt: new Date().toISOString(),
      holdingsCount: holdingCount,
      holdings,
    };

    const json = JSON.stringify(backupData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const today = new Date().toISOString().slice(0, 10);
    const link = document.createElement("a");

    link.href = url;
    link.download = `etf-biseo-holdings-backup-${today}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    alert(`보유 ETF ${holdingCount}개 백업 파일을 저장했습니다.`);
  };

  const handleRestoreHoldings = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const backupData = JSON.parse(reader.result);

        if (backupData.app && backupData.app !== "ETF-Biseo-V1") {
          alert("ETF-Biseo-V1 백업 파일이 아닙니다.");
          return;
        }

        if (backupData.type && backupData.type !== "holdings-backup") {
          alert("보유 ETF 백업 파일이 아닙니다.");
          return;
        }

        const restoredHoldings = Array.isArray(backupData)
          ? backupData
          : backupData.holdings;

        if (!Array.isArray(restoredHoldings)) {
          alert("복원할 수 없는 파일입니다. 보유 ETF 백업 파일인지 확인하세요.");
          return;
        }

        const ok = confirm(
          `보유 ETF ${restoredHoldings.length}개를 복원할까요?\n현재 보유 ETF ${holdingCount}개는 덮어씌워집니다.`
        );

        if (!ok) return;

        setHoldings(restoredHoldings);
        alert("보유 ETF 복원이 완료되었습니다.");
      } catch {
        alert("파일을 읽는 중 오류가 발생했습니다. JSON 백업 파일인지 확인하세요.");
      } finally {
        event.target.value = "";
      }
    };

    reader.onerror = () => {
      alert("파일을 읽을 수 없습니다.");
      event.target.value = "";
    };

    reader.readAsText(file);
  };

  const handleResetHoldings = () => {
    if (!hasHoldings) {
      alert("초기화할 보유 ETF가 없습니다.");
      return;
    }

    const ok = confirm(
      `현재 보유 ETF ${holdingCount}개를 모두 초기화할까요?\n이 작업은 되돌릴 수 없습니다.`
    );

    if (!ok) return;

    setHoldings([]);
  };

  return (
    <div className="card">
      <h2>설정</h2>
      <p>자동 저장이 켜져 있습니다.</p>
      <p>현재 보유 ETF: {holdingCount}개</p>

      {!hasHoldings && (
        <p>백업하려면 먼저 보유 ETF를 추가하세요.</p>
      )}

      <button
        onClick={handleBackupHoldings}
        disabled={!hasHoldings}
      >
        보유 ETF 백업하기
      </button>

      <button onClick={() => fileInputRef.current?.click()}>
        보유 ETF 복원하기
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleRestoreHoldings}
        style={{ display: "none" }}
      />

      <button
        className="danger"
        onClick={handleResetHoldings}
        disabled={!hasHoldings}
      >
        보유 ETF 전체 초기화
      </button>
    </div>
  );
}