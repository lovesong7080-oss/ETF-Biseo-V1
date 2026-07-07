import { useRef } from "react";

const APP_NAME = "ETF-Biseo-V1";
const HOLDINGS_STORAGE_KEY = "etf-biseo-holdings";

const TEXT = {
  title: "\u2699\uFE0F \uC124\uC815",
  guideTitle: "\uD63C\uC790 \uC4F0\uB294 \uC2E4\uC804 \uC0AC\uC6A9\uBC95",
  guide1: "1. \uBCF4\uC720 ETF\uB97C \uBA3C\uC800 \uC785\uB825\uD569\uB2C8\uB2E4.",
  guide2: "2. \uBD84\uC11D \uD0ED\uC5D0\uC11C \uBAA9\uD45C \uBE44\uC911\uACFC \uBD80\uC871 \uAE08\uC561\uC744 \uD655\uC778\uD569\uB2C8\uB2E4.",
  guide3: "3. \uC774\uBC88 \uB2EC \uD22C\uC790\uAE08\uC744 \uC785\uB825\uD569\uB2C8\uB2E4.",
  guide4: "4. ETF \uD604\uC7AC\uAC00\uB97C \uC785\uB825\uD574 \uB9E4\uC218 \uC218\uB7C9\uC744 \uD655\uC778\uD569\uB2C8\uB2E4.",
  guide5: "5. \uC8FC\uBB38 \uBA54\uBAA8\uB97C \uBCF5\uC0AC\uD574 \uC99D\uAD8C\uC0AC \uC571\uC5D0\uC11C \uC9C1\uC811 \uC8FC\uBB38\uD569\uB2C8\uB2E4.",
  guide6: "6. \uC8FC\uBB38 \uD6C4 \uBCF4\uC720 ETF \uAE08\uC561\uC740 \uC218\uB3D9\uC73C\uB85C \uC218\uC815\uD569\uB2C8\uB2E4.",
  dataTitle: "\uD83D\uDCBE \uB370\uC774\uD130 \uBC31\uC5C5 / \uBCF5\uC6D0",
  holdingsCount: "\uBCF4\uC720 ETF",
  backupAll: "\uC804\uCCB4 \uB370\uC774\uD130 \uBC31\uC5C5",
  restoreAll: "\uC804\uCCB4 \uB370\uC774\uD130 \uBCF5\uC6D0",
  backupHoldings: "\uBCF4\uC720 ETF\uB9CC \uBC31\uC5C5",
  restoreHoldings: "\uBCF4\uC720 ETF\uB9CC \uBCF5\uC6D0",
  dangerTitle: "\u26A0\uFE0F \uC704\uD5D8 \uC791\uC5C5",
  clearAll: "\uC804\uCCB4 \uB370\uC774\uD130 \uC0AD\uC81C",
  backupDone: "\uBC31\uC5C5 \uD30C\uC77C\uC744 \uB0B4\uB824\uBC1B\uC558\uC2B5\uB2C8\uB2E4.",
  restoreDone: "\uBCF5\uC6D0\uC774 \uC644\uB8CC\uB410\uC2B5\uB2C8\uB2E4. \uD654\uBA74\uC744 \uC0C8\uB85C\uACE0\uCE68\uD569\uB2C8\uB2E4.",
  invalidFile: "\uC62C\uBC14\uB978 ETF-Biseo \uBC31\uC5C5 \uD30C\uC77C\uC774 \uC544\uB2D9\uB2C8\uB2E4.",
  readError: "\uD30C\uC77C\uC744 \uC77D\uB294 \uC911 \uC624\uB958\uAC00 \uBC1C\uC0DD\uD588\uC2B5\uB2C8\uB2E4.",
};

function getTodayText() {
  return new Date().toISOString().slice(0, 10);
}

function isEtfBiseoStorageKey(key) {
  return key.startsWith("etf-biseo-") || key.startsWith("etfBiseo");
}

function collectAppStorage() {
  const raw = {};
  const parsed = {};

  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);

    if (!key || !isEtfBiseoStorageKey(key)) {
      continue;
    }

    const value = localStorage.getItem(key);
    raw[key] = value;

    try {
      parsed[key] = JSON.parse(value);
    } catch {
      parsed[key] = value;
    }
  }

  return {
    raw,
    parsed,
  };
}

function downloadJson(data, fileName) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function readJsonFile(file, onSuccess, onError) {
  const reader = new FileReader();

  reader.onload = () => {
    try {
      onSuccess(JSON.parse(reader.result));
    } catch {
      onError();
    }
  };

  reader.onerror = onError;
  reader.readAsText(file);
}

function normalizeHoldings(value) {
  return Array.isArray(value) ? value : null;
}

export default function SettingsCard({ holdings = [], setHoldings }) {
  const holdingsFileInputRef = useRef(null);
  const fullFileInputRef = useRef(null);

  const holdingCount = holdings.length;

  const handleBackupHoldings = () => {
    const backupData = {
      app: APP_NAME,
      type: "holdings-backup",
      version: 1,
      createdAt: new Date().toISOString(),
      holdingsCount: holdingCount,
      holdings,
    };

    downloadJson(
      backupData,
      `etf-biseo-holdings-backup-${getTodayText()}.json`
    );

    alert(TEXT.backupDone);
  };

  const handleBackupAllData = () => {
    const storage = collectAppStorage();

    const backupData = {
      app: APP_NAME,
      type: "full-data-backup",
      version: 2,
      createdAt: new Date().toISOString(),
      data: {
        holdings,
        holdingsCount: holdingCount,
        localStorageRaw: storage.raw,
        localStorage: storage.parsed,
      },
    };

    downloadJson(
      backupData,
      `etf-biseo-full-backup-${getTodayText()}.json`
    );

    alert(TEXT.backupDone);
  };

  const handleRestoreHoldings = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    readJsonFile(
      file,
      (backupData) => {
        const restoredHoldings = normalizeHoldings(backupData.holdings);

        if (backupData.app !== APP_NAME || !restoredHoldings) {
          alert(TEXT.invalidFile);
          event.target.value = "";
          return;
        }

        const ok = confirm(
          `\uBCF4\uC720 ETF ${restoredHoldings.length}\uAC1C\uB97C \uBCF5\uC6D0\uD560\uAE4C\uC694?\n\uD604\uC7AC \uBCF4\uC720 ETF\uB294 \uB36E\uC5B4\uC501\uB2C8\uB2E4.`
        );

        if (!ok) {
          event.target.value = "";
          return;
        }

        setHoldings(restoredHoldings);
        localStorage.setItem(HOLDINGS_STORAGE_KEY, JSON.stringify(restoredHoldings));

        alert(TEXT.restoreDone);
        event.target.value = "";
        window.location.reload();
      },
      () => {
        alert(TEXT.readError);
        event.target.value = "";
      }
    );
  };

  const handleRestoreAllData = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    readJsonFile(
      file,
      (backupData) => {
        const rawStorage = backupData.data?.localStorageRaw;
        const parsedStorage = backupData.data?.localStorage;
        const storageData = rawStorage || parsedStorage;

        if (
          backupData.app !== APP_NAME ||
          backupData.type !== "full-data-backup" ||
          !storageData ||
          typeof storageData !== "object" ||
          Array.isArray(storageData)
        ) {
          alert(TEXT.invalidFile);
          event.target.value = "";
          return;
        }

        const restoreKeys = Object.keys(storageData).filter(isEtfBiseoStorageKey);

        if (restoreKeys.length === 0) {
          alert(TEXT.invalidFile);
          event.target.value = "";
          return;
        }

        const ok = confirm(
          `\uC804\uCCB4 \uB370\uC774\uD130 ${restoreKeys.length}\uAC1C \uD56D\uBAA9\uC744 \uBCF5\uC6D0\uD560\uAE4C\uC694?\n\uD604\uC7AC ETF-Biseo \uB370\uC774\uD130\uB294 \uBC31\uC5C5 \uD30C\uC77C \uB0B4\uC6A9\uC73C\uB85C \uAD50\uCCB4\uB429\uB2C8\uB2E4.`
        );

        if (!ok) {
          event.target.value = "";
          return;
        }

        const currentKeys = [];

        for (let i = 0; i < localStorage.length; i += 1) {
          const key = localStorage.key(i);

          if (key && isEtfBiseoStorageKey(key)) {
            currentKeys.push(key);
          }
        }

        currentKeys.forEach((key) => localStorage.removeItem(key));

        restoreKeys.forEach((key) => {
          const value = storageData[key];

          if (typeof value === "string") {
            localStorage.setItem(key, value);
          } else {
            localStorage.setItem(key, JSON.stringify(value));
          }
        });

        const restoredHoldings = normalizeHoldings(backupData.data?.holdings);

        if (restoredHoldings) {
          setHoldings(restoredHoldings);
          localStorage.setItem(HOLDINGS_STORAGE_KEY, JSON.stringify(restoredHoldings));
        }

        alert(TEXT.restoreDone);
        event.target.value = "";
        window.location.reload();
      },
      () => {
        alert(TEXT.readError);
        event.target.value = "";
      }
    );
  };

  const handleClearAllData = () => {
    const ok = confirm(
      "\uC815\uB9D0 \uC804\uCCB4 \uB370\uC774\uD130\uB97C \uC0AD\uC81C\uD560\uAE4C\uC694?\n\uC0AD\uC81C \uC804\uC5D0 \uBC18\uB4DC\uC2DC \uC804\uCCB4 \uBC31\uC5C5\uC744 \uBA3C\uC800 \uBC1B\uC544\uB450\uC138\uC694."
    );

    if (!ok) {
      return;
    }

    const keysToRemove = [];

    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);

      if (key && isEtfBiseoStorageKey(key)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key));
    setHoldings([]);

    alert("\uC804\uCCB4 \uB370\uC774\uD130\uB97C \uC0AD\uC81C\uD588\uC2B5\uB2C8\uB2E4.");
    window.location.reload();
  };

  return (
    <div className="card">
      <h2>{TEXT.title}</h2>

      <div className="settings-section">
        <h3>{TEXT.guideTitle}</h3>
        <ol className="settings-guide">
          <li>{TEXT.guide1}</li>
          <li>{TEXT.guide2}</li>
          <li>{TEXT.guide3}</li>
          <li>{TEXT.guide4}</li>
          <li>{TEXT.guide5}</li>
          <li>{TEXT.guide6}</li>
        </ol>
      </div>

      <div className="settings-section">
        <h3>{TEXT.dataTitle}</h3>
        <p>
          {TEXT.holdingsCount}: <strong>{holdingCount}</strong>
        </p>

        <div className="settings-actions">
          <button type="button" onClick={handleBackupAllData}>
            {TEXT.backupAll}
          </button>

          <button type="button" onClick={() => fullFileInputRef.current?.click()}>
            {TEXT.restoreAll}
          </button>

          <button type="button" onClick={handleBackupHoldings}>
            {TEXT.backupHoldings}
          </button>

          <button
            type="button"
            onClick={() => holdingsFileInputRef.current?.click()}
          >
            {TEXT.restoreHoldings}
          </button>
        </div>

        <input
          ref={fullFileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleRestoreAllData}
          style={{ display: "none" }}
        />

        <input
          ref={holdingsFileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleRestoreHoldings}
          style={{ display: "none" }}
        />
      </div>

      <div className="settings-section">
        <h3>{TEXT.dangerTitle}</h3>
        <button type="button" className="danger" onClick={handleClearAllData}>
          {TEXT.clearAll}
        </button>
      </div>
    </div>
  );
}
