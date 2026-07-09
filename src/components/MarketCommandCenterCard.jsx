import { useEffect, useState } from "react";

const STORAGE_KEY = "etf-biseo-market-command-center";

const DECISION_META = {
  매수: {
    emoji: "🟢",
    title: "매수",
    desc: "분할매수 가능 구간입니다. 단, 목표 비중이 부족한 ETF 위주로만 접근하세요.",
    color: "#166534",
    bg: "#dcfce7",
    border: "#86efac",
  },
  대기: {
    emoji: "🟡",
    title: "대기",
    desc: "무리하지 않고 관망하는 구간입니다. 현금과 다음 매수 후보를 점검하세요.",
    color: "#92400e",
    bg: "#fef3c7",
    border: "#facc15",
  },
  주의: {
    emoji: "🔴",
    title: "주의",
    desc: "신규매수 자제 구간입니다. 과열, 외국인 수급, 포트폴리오 편중을 먼저 확인하세요.",
    color: "#991b1b",
    bg: "#fee2e2",
    border: "#fca5a5",
  },
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function readData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeData(value) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function defaultRecord() {
  return {
    usBriefing: false,
    todayStrategy: false,
    koreaClose: false,
    tomorrowStrategy: false,
    foreignerAlert: false,
    aiBubble: false,
    portfolioRisk: false,
    riskLevel: "보통",
    decision: "대기",
    morningMemo: "",
    closingMemo: "",
  };
}

export default function MarketCommandCenterCard() {
  const date = todayKey();
  const [records, setRecords] = useState(() => readData());
  const [saved, setSaved] = useState(false);

  const record = {
    ...defaultRecord(),
    ...(records[date] || {}),
  };

  const decision = DECISION_META[record.decision] || DECISION_META.대기;

  useEffect(() => {
    writeData(records);
    setSaved(true);

    const timer = window.setTimeout(() => setSaved(false), 1000);
    return () => window.clearTimeout(timer);
  }, [records]);

  const update = (patch) => {
    setRecords((prev) => ({
      ...prev,
      [date]: {
        ...defaultRecord(),
        ...(prev[date] || {}),
        ...patch,
      },
    }));
  };

  const toggle = (key) => {
    update({ [key]: !record[key] });
  };

  const resetToday = () => {
    if (!window.confirm("오늘 투자 관제센터 기록을 초기화할까요?")) {
      return;
    }

    setRecords((prev) => {
      const next = { ...prev };
      delete next[date];
      return next;
    });
  };

  const checkedCount = [
    record.usBriefing,
    record.todayStrategy,
    record.koreaClose,
    record.tomorrowStrategy,
    record.foreignerAlert,
    record.aiBubble,
    record.portfolioRisk,
  ].filter(Boolean).length;

  const riskColor =
    record.riskLevel === "높음"
      ? "#991b1b"
      : record.riskLevel === "낮음"
        ? "#166534"
        : "#92400e";

  const riskBg =
    record.riskLevel === "높음"
      ? "#fee2e2"
      : record.riskLevel === "낮음"
        ? "#dcfce7"
        : "#fef3c7";

  return (
    <section style={styles.card}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🧭 투자 관제센터</h2>
          <p style={styles.desc}>
            ChatGPT 브리핑을 받고 오늘의 투자 판단을 기록합니다.
          </p>
        </div>

        <div style={styles.dateBox}>
          <div>오늘</div>
          <strong>{date}</strong>
          <div>{checkedCount}/7</div>
        </div>
      </div>

      <div
        style={{
          ...styles.decisionPanel,
          background: decision.bg,
          borderColor: decision.border,
        }}
      >
        <div style={styles.decisionTop}>
          <div>
            <div style={styles.decisionLabel}>오늘 최종 판단</div>
            <div style={{ ...styles.decisionValue, color: decision.color }}>
              {decision.emoji} {decision.title}
            </div>
          </div>

          <div
            style={{
              ...styles.decisionBadge,
              color: decision.color,
              borderColor: decision.border,
            }}
          >
            {record.riskLevel} 위험
          </div>
        </div>

        <p style={styles.decisionDesc}>{decision.desc}</p>

        <div style={styles.decisionButtons}>
          {Object.entries(DECISION_META).map(([key, meta]) => {
            const active = record.decision === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => update({ decision: key })}
                style={{
                  ...styles.decisionButton,
                  ...(active
                    ? {
                        color: meta.color,
                        background: "#ffffff",
                        borderColor: meta.border,
                        boxShadow: "0 6px 16px rgba(15, 23, 42, 0.12)",
                      }
                    : {}),
                }}
              >
                {meta.emoji} {meta.title}
              </button>
            );
          })}
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.block}>
          <h3 style={styles.blockTitle}>09:00 미국장 분석 / 오늘 전략</h3>

          <label style={styles.row}>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={record.usBriefing}
              onChange={() => toggle("usBriefing")}
            />
            미국장 브리핑 확인
          </label>

          <label style={styles.row}>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={record.todayStrategy}
              onChange={() => toggle("todayStrategy")}
            />
            오늘 한국장 전략 기록
          </label>

          <textarea
            style={styles.textarea}
            value={record.morningMemo}
            onChange={(event) => update({ morningMemo: event.target.value })}
            placeholder="오전 전략 메모"
          />
        </div>

        <div style={styles.block}>
          <h3 style={styles.blockTitle}>15:40 한국장 마감 / 내일 전략</h3>

          <label style={styles.row}>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={record.koreaClose}
              onChange={() => toggle("koreaClose")}
            />
            한국장 마감 확인
          </label>

          <label style={styles.row}>
            <input
              type="checkbox"
              style={styles.checkbox}
              checked={record.tomorrowStrategy}
              onChange={() => toggle("tomorrowStrategy")}
            />
            내일 대응 전략 기록
          </label>

          <textarea
            style={styles.textarea}
            value={record.closingMemo}
            onChange={(event) => update({ closingMemo: event.target.value })}
            placeholder="마감 전략 메모"
          />
        </div>
      </div>

      <div style={styles.block}>
        <h3 style={styles.blockTitle}>항상 체크</h3>

        <label style={styles.row}>
          <input
            type="checkbox"
            style={styles.checkbox}
            checked={record.foreignerAlert}
            onChange={() => toggle("foreignerAlert")}
          />
          외국인 수급 경보 체크
        </label>

        <label style={styles.row}>
          <input
            type="checkbox"
            style={styles.checkbox}
            checked={record.aiBubble}
            onChange={() => toggle("aiBubble")}
          />
          AI / 반도체 과열 체크
        </label>

        <label style={styles.row}>
          <input
            type="checkbox"
            style={styles.checkbox}
            checked={record.portfolioRisk}
            onChange={() => toggle("portfolioRisk")}
          />
          포트폴리오 위험도 체크
        </label>

        <div style={styles.riskLine}>
          <span>포트폴리오 위험도</span>

          <select
            value={record.riskLevel}
            onChange={(event) => update({ riskLevel: event.target.value })}
            style={{
              ...styles.select,
              color: riskColor,
              background: riskBg,
            }}
          >
            <option value="낮음">낮음</option>
            <option value="보통">보통</option>
            <option value="높음">높음</option>
          </select>
        </div>
      </div>

      <div style={styles.footer}>
        <span style={styles.saved}>{saved ? "저장됨" : ""}</span>

        <button type="button" style={styles.button} onClick={resetToday}>
          오늘 기록 초기화
        </button>
      </div>
    </section>
  );
}

const styles = {
  card: {
    marginTop: "16px",
    padding: "18px",
    borderRadius: "18px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "14px",
  },
  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 900,
    color: "#111827",
  },
  desc: {
    margin: "8px 0 0",
    fontSize: "13px",
    color: "#4b5563",
    lineHeight: 1.5,
  },
  dateBox: {
    minWidth: "104px",
    padding: "10px",
    borderRadius: "14px",
    background: "#eff6ff",
    color: "#1d4ed8",
    textAlign: "center",
    fontSize: "12px",
    fontWeight: 800,
    lineHeight: 1.4,
  },
  decisionPanel: {
    marginBottom: "14px",
    padding: "14px",
    borderRadius: "16px",
    border: "1px solid",
  },
  decisionTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
  decisionLabel: {
    fontSize: "12px",
    fontWeight: 800,
    color: "#4b5563",
    marginBottom: "4px",
  },
  decisionValue: {
    fontSize: "22px",
    fontWeight: 1000,
  },
  decisionBadge: {
    padding: "7px 10px",
    borderRadius: "999px",
    border: "1px solid",
    background: "#ffffff",
    fontSize: "12px",
    fontWeight: 900,
    whiteSpace: "nowrap",
  },
  decisionDesc: {
    margin: "10px 0 12px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#374151",
    lineHeight: 1.5,
  },
  decisionButtons: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "8px",
  },
  decisionButton: {
    padding: "10px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    color: "#374151",
    fontSize: "13px",
    fontWeight: 900,
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
  },
  block: {
    marginTop: "12px",
    padding: "14px",
    borderRadius: "14px",
    background: "#f9fafb",
    border: "1px solid #e5e7eb",
  },
  blockTitle: {
    margin: "0 0 10px",
    fontSize: "14px",
    fontWeight: 900,
    color: "#111827",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    minWidth: "18px",
    accentColor: "#16a34a",
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: "8px",
    marginBottom: "8px",
    fontSize: "13px",
    fontWeight: 700,
    color: "#374151",
  },
  textarea: {
    width: "100%",
    minHeight: "76px",
    padding: "10px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "13px",
    boxSizing: "border-box",
    resize: "vertical",
  },
  riskLine: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginTop: "10px",
    fontSize: "13px",
    fontWeight: 800,
  },
  select: {
    padding: "7px 12px",
    borderRadius: "999px",
    border: "1px solid #d1d5db",
    fontSize: "13px",
    fontWeight: 900,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "12px",
  },
  saved: {
    fontSize: "12px",
    color: "#16a34a",
    fontWeight: 800,
  },
  button: {
    padding: "8px 10px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    color: "#374151",
    fontSize: "12px",
    fontWeight: 800,
    cursor: "pointer",
  },
};