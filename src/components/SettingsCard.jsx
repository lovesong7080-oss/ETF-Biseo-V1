import { useRef } from "react";

export default function SettingsCard({ holdings, setHoldings }) {
  const fileInputRef = useRef(null);
  const fullRestoreFileInputRef = useRef(null);

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

  const handleBackupAllData = () => {
    const localStorageSnapshot = {};
    const parsedLocalStorageSnapshot = {};

    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);

      if (!key) continue;
      if (!key.startsWith("etf-biseo-")) continue;

      const value = localStorage.getItem(key);
      localStorageSnapshot[key] = value;

      try {
        parsedLocalStorageSnapshot[key] = JSON.parse(value);
      } catch {
        parsedLocalStorageSnapshot[key] = value;
      }
    }

    const backupData = {
      app: "ETF-Biseo-V1",
      type: "full-data-backup",
      version: 1,
      createdAt: new Date().toISOString(),
      data: {
        holdings,
        holdingsCount: holdingCount,
        localStorage: parsedLocalStorageSnapshot,
        localStorageRaw: localStorageSnapshot,
      },
    };

    const json = JSON.stringify(backupData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const today = new Date().toISOString().slice(0, 10);
    const link = document.createElement("a");

    link.href = url;
    link.download = `etf-biseo-full-data-backup-${today}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    alert(`전체 데이터 백업 파일을 저장했습니다.\n보유 ETF: ${holdingCount}개`);
  };

  const handleRestoreAllData = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const backupData = JSON.parse(reader.result);

        if (backupData.app !== "ETF-Biseo-V1") {
          alert("ETF-Biseo-V1 전체 백업 파일이 아닙니다.");
          return;
        }

        if (backupData.type !== "full-data-backup") {
          alert("전체 데이터 백업 파일이 아닙니다.");
          return;
        }

        const rawStorageData = backupData.data?.localStorageRaw;
        const parsedStorageData = backupData.data?.localStorage;
        const restoreStorageData = rawStorageData || parsedStorageData;

        if (
          !restoreStorageData ||
          typeof restoreStorageData !== "object" ||
          Array.isArray(restoreStorageData)
        ) {
          alert("복원할 전체 데이터가 없습니다.");
          return;
        }

        const restoreKeys = Object.keys(restoreStorageData).filter((key) =>
          key.startsWith("etf-biseo-")
        );

        if (restoreKeys.length === 0) {
          alert("복원할 ETF-Biseo 데이터가 없습니다.");
          return;
        }

        const ok = confirm(
          `전체 데이터 ${restoreKeys.length}개 항목을 복원할까요?\n현재 ETF-Biseo 저장 데이터는 백업 파일 내용으로 교체됩니다.\n이 작업은 되돌릴 수 없습니다.`
        );

        if (!ok) return;

        const currentKeys = [];

        for (let i = 0; i < localStorage.length; i += 1) {
          const key = localStorage.key(i);

          if (key && key.startsWith("etf-biseo-")) {
            currentKeys.push(key);
          }
        }

        currentKeys.forEach((key) => {
          localStorage.removeItem(key);
        });

        restoreKeys.forEach((key) => {
          const value = restoreStorageData[key];

          if (typeof value === "string") {
            localStorage.setItem(key, value);
          } else {
            localStorage.setItem(key, JSON.stringify(value));
          }
        });

        const restoredHoldings = backupData.data?.holdings;

        if (Array.isArray(restoredHoldings)) {
          setHoldings(restoredHoldings);
        }

        alert("전체 데이터 복원이 완료되었습니다. 화면을 새로고침합니다.");
        window.location.reload();
      } catch {
        alert("파일을 읽는 중 오류가 발생했습니다. 전체 데이터 백업 JSON 파일인지 확인하세요.");
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
          `보유 ETF ${restoredHoldings.length}개를 복원할까요?\n현재 보유 ETF ${holdingCount}개는 덮어써집니다.`
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
    <div className="card settings-card">
      <h2>⚙️ 설정</h2>

      <div className="settings-summary">
        <p>자동 저장이 켜져 있습니다.</p>
        <p>
          현재 보유 ETF: <strong>{holdingCount}개</strong>
        </p>
      </div>

      {!hasHoldings && (
        <p className="settings-notice">
          백업하려면 먼저 보유 ETF를 추가하세요.
        </p>
      )}

      <div className="settings-section">
        <h3>데이터 관리</h3>
        <p>
          보유 ETF 목록 또는 전체 앱 데이터를 JSON 파일로 백업하거나 복원합니다.
        </p>

        <div className="settings-actions">
          <button
            onClick={handleBackupHoldings}
            disabled={!hasHoldings}
          >
            보유 ETF 백업하기
          </button>

          <button onClick={handleBackupAllData}>
            전체 데이터 백업하기
          </button>

          <button onClick={() => fullRestoreFileInputRef.current?.click()}>
            전체 데이터 복원하기
          </button>

          <button onClick={() => fileInputRef.current?.click()}>
            보유 ETF 복원하기
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleRestoreHoldings}
          style={{ display: "none" }}
        />

        <input
          ref={fullRestoreFileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleRestoreAllData}
          style={{ display: "none" }}
        />
      </div>

      <div className="settings-section danger-zone">
        <h3>위험 구역</h3>
        <p>
          보유 ETF 목록만 초기화합니다. 계산 방식이나 다른 설정값은 삭제하지 않습니다.
        </p>

        <button
          className="danger"
          onClick={handleResetHoldings}
          disabled={!hasHoldings}
        >
          보유 ETF 전체 초기화
        </button>
      </div>
    </div>
  );
}