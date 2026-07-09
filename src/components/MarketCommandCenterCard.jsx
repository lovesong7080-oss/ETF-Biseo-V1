import { useEffect, useMemo, useState } from "react";

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
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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

function clampScore(value) {
  return Math.max(0, Math.min(100, value));
}

function getScoreEngine(record) {
  let score = 50;
  const plus = [];
  const minus = [];
  const neutral = [];

  if (record.riskLevel === "낮음") {
    score += 20;
    plus.push("포트폴리오 위험도가 낮아 +20점");
  }

  if (record.riskLevel === "보통") {
    neutral.push("포트폴리오 위험도는 보통입니다.");
  }

  if (record.riskLevel === "높음") {
    score -= 30;
    minus.push("포트폴리오 위험도가 높아 -30점");
  }

  if (record.foreignerAlert) {
    score -= 25;
    minus.push("외국인 수급 경보 체크로 -25점");
  }

  if (record.aiBubble) {
    score -= 20;
    minus.push("AI / 반도체 과열 체크로 -20점");
  }

  if (record.portfolioRisk) {
    score += 10;
    plus.push("포트폴리오 위험 점검 완료로 +10점");
  }

  if (record.usBriefing) {
    score += 10;
    plus.push("미국장 브리핑 확인으로 +10점");
  }

  if (record.todayStrategy) {
    score += 10;
    plus.push("오늘 전략 기록으로 +10점");
  }

  if (record.koreaClose) {
    score += 5;
    plus.push("한국장 마감 확인으로 +5점");
  }

  if (record.tomorrowStrategy) {
    score += 5;
    plus.push("내일 전략 기록으로 +5점");
  }

  if (
    record.foreignerAlert &&
    record.aiBubble &&
    record.riskLevel === "높음"
  ) {
    score -= 10;
    minus.push("수급 경보 + AI 과열 + 위험도 높음 동시 발생으로 추가 -10점");
  }

  const finalScore = clampScore(score);

  if (finalScore >= 70) {
    return {
      score: finalScore,
      decision: "매수",
      level: "매수 가능",
      allocation: "월 투자금 80~100% 사용 가능",
      action:
        "목표 비중이 부족한 ETF 위주로 분할매수를 검토하세요. 한 번에 몰빵하지 말고 계획된 금액 안에서 집행하세요.",
      plus,
      minus,
      neutral,
    };
  }

  if (finalScore >= 50) {
    return {
      score: finalScore,
      decision: "대기",
      level: "소액 매수 가능",
      allocation: "월 투자금 30~50%만 사용",
      action:
        "완전 매수 구간은 아닙니다. 꼭 산다면 목표 비중 부족 ETF에 한해 소액 분할매수만 적절합니다.",
      plus,
      minus,
      neutral,
    };
  }

  if (finalScore >= 30) {
    return {
      score: finalScore,
      decision: "대기",
      level: "대기 우선",
      allocation: "월 투자금 0~30%만 사용",
      action:
        "신규매수보다 관망이 우선입니다. 현금 비중을 유지하고 다음 매수 후보만 정리하세요.",
      plus,
      minus,
      neutral,
    };
  }

  return {
    score: finalScore,
    decision: "주의",
    level: "주의",
    allocation: "신규매수 중단",
    action:
      "지금은 방어가 우선입니다. 신규매수는 멈추고, 과열 종목·편중 ETF·현금 비중을 먼저 점검하세요.",
    plus,
    minus,
    neutral,
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

  const scoreEngine = useMemo(() => getScoreEngine(record), [record]);
  const decision = DECISION_META[record.decision] || DECISION_META.대기;
  const autoMeta = DECISION_META[scoreEngine.decision] || DECISION_META.대기;
  const isSameDecision = record.decision === scoreEngine.decision;

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

  const applyAutoDecision = () => {
    update({ decision: scoreEngine.decision });
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
            브리핑 체크, 위험도 입력, 투자 점수 계산으로 오늘의 매수 판단을 관리합니다.
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
          ...styles.scorePanel,
          background: autoMeta.bg,
          borderColor: autoMeta.border,
        }}
      >
        <div style={styles.scoreTop}>
          <div>
            <div style={styles.scoreLabel}>오늘 투자 점수</div>
            <div style={{ ...styles.scoreValue, color: autoMeta.color }}>
              {scoreEngine.score}점
            </div>
          </div>

          <div style={styles.scoreRight}>
            <div style={{ ...styles.scoreDecision, color: autoMeta.color }}>
              {autoMeta.emoji} {scoreEngine.level}
            </div>
            <div style={styles.allocation}>{scoreEngine.allocation}</div>
          </div>
        </div>

        <div style={styles.scoreBarOuter}>
          <div
            style={{
              ...styles.scoreBarInner,
              width: `${scoreEngine.score}%`,
              background: autoMeta.color,
            }}
          />
        </div>

        <p style={styles.scoreAction}>{scoreEngine.action}</p>

        <div style={styles.reasonGrid}>
          <div style={styles.reasonBox}>
            <div style={styles.reasonTitle}>가점</div>
            {scoreEngine.plus.length > 0 ? (
              scoreEngine.plus.map((item) => (
                <div key={item} style={styles.reasonItem}>
                  + {item}
                </div>
              ))
            ) : (
              <div style={styles.emptyReason}>가점 항목 없음</div>
            )}
          </div>

          <div style={styles.reasonBox}>
            <div style={styles.reasonTitle}>감점</div>
            {scoreEngine.minus.length > 0 ? (
              scoreEngine.minus.map((item) => (
                <div key={item} style={styles.reasonItem}>
                  - {item}
                </div>
              ))
            ) : (
              <div style={styles.emptyReason}>감점 항목 없음</div>
            )}
          </div>
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

        <button
          type="button"
          onClick={applyAutoDecision}
          disabled={isSameDecision}
          style={{
            ...styles.applyButton,
            color: autoMeta.color,
            borderColor: autoMeta.border,
            opacity: isSameDecision ? 0.55 : 1,
            cursor: isSameDecision ? "default" : "pointer",
          }}
        >
          {isSameDecision ? "자동 추천 적용됨" : "자동 추천을 최종 판단에 적용"}
        </button>
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
  scorePanel: {
    marginBottom: "14px",
    padding: "14px",
    borderRadius: "16px",
    border: "1px solid",
  },
  scoreTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },
  scoreLabel: {
    fontSize: "12px",
    fontWeight: 900,
    color: "#4b5563",
    marginBottom: "3px",
  },
  scoreValue: {
    fontSize: "34px",
    fontWeight: 1000,
    lineHeight: 1,
  },
  scoreRight: {
    textAlign: "right",
  },
  scoreDecision: {
    fontSize: "17px",
    fontWeight: 1000,
  },
  allocation: {
    marginTop: "4px",
    fontSize: "12px",
    fontWeight: 900,
    color: "#374151",
  },
  scoreBarOuter: {
    width: "100%",
    height: "10px",
    marginTop: "12px",
    borderRadius: "999px",
    background: "rgba(255, 255, 255, 0.7)",
    overflow: "hidden",
    border: "1px solid rgba(148, 163, 184, 0.35)",
  },
  scoreBarInner: {
    height: "100%",
    borderRadius: "999px",
    transition: "width 0.2s ease",
  },
  scoreAction: {
    margin: "12px 0",
    fontSize: "13px",
    fontWeight: 800,
    color: "#374151",
    lineHeight: 1.5,
  },
  reasonGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "10px",
  },
  reasonBox: {
    padding: "10px",
    borderRadius: "12px",
    background: "rgba(255, 255, 255, 0.72)",
    border: "1px solid rgba(148, 163, 184, 0.28)",
  },
  reasonTitle: {
    marginBottom: "6px",
    fontSize: "12px",
    fontWeight: 1000,
    color: "#111827",
  },
  reasonItem: {
    marginTop: "4px",
    fontSize: "12px",
    fontWeight: 750,
    color: "#374151",
    lineHeight: 1.45,
  },
  emptyReason: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#6b7280",
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
  applyButton: {
    width: "100%",
    marginTop: "10px",
    padding: "10px 12px",
    borderRadius: "12px",
    border: "1px solid",
    background: "#ffffff",
    fontSize: "13px",
    fontWeight: 1000,
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