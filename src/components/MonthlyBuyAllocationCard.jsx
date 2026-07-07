import { useMemo, useState } from "react";
import { calculateMonthlyBuyAllocation } from "../utils/monthlyBuyAllocation";

function formatWon(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "0원";
  }

  return `${Math.round(number).toLocaleString("ko-KR")}원`;
}

function parseWonInput(value) {
  return Number(String(value).replace(/[^0-9]/g, ""));
}

export default function MonthlyBuyAllocationCard({
  rebalancePriorityList = [],
  rebalanceEtfCandidates = [],
}) {
  const [monthlyInvestAmountInput, setMonthlyInvestAmountInput] =
    useState("500000");

  const monthlyInvestAmount = parseWonInput(monthlyInvestAmountInput);

  const allocationResult = useMemo(() => {
    return calculateMonthlyBuyAllocation({
      monthlyInvestAmount,
      rebalancePriorityList,
      rebalanceEtfCandidates,
      minAllocationUnit: 1000,
    });
  }, [monthlyInvestAmount, rebalancePriorityList, rebalanceEtfCandidates]);

  const allocationRate =
    allocationResult.totalBudget > 0
      ? Math.round(
          (allocationResult.allocatedAmount / allocationResult.totalBudget) *
            100
        )
      : 0;

  return (
    <section style={styles.card}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>Monthly Buy Allocation</p>
          <h2 style={styles.title}>이번 달 자동 매수 배분</h2>
          <p style={styles.description}>
            이번 달 새로 넣을 투자금만 기준으로 부족한 자산군의 ETF 매수
            금액을 계산합니다. 매도는 반영하지 않습니다.
          </p>
        </div>
      </div>

      <div style={styles.inputBox}>
        <label style={styles.label} htmlFor="monthly-invest-amount">
          이번 달 투자금
        </label>
        <div style={styles.inputRow}>
          <input
            id="monthly-invest-amount"
            type="text"
            inputMode="numeric"
            value={monthlyInvestAmountInput}
            onChange={(event) =>
              setMonthlyInvestAmountInput(event.target.value)
            }
            placeholder="예: 500000"
            style={styles.input}
          />
          <span style={styles.wonText}>원</span>
        </div>
      </div>

      <div style={styles.summaryGrid}>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>투자금</span>
          <strong style={styles.summaryValue}>
            {formatWon(allocationResult.totalBudget)}
          </strong>
        </div>

        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>배분 금액</span>
          <strong style={styles.summaryValue}>
            {formatWon(allocationResult.allocatedAmount)}
          </strong>
        </div>

        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>남은 금액</span>
          <strong style={styles.summaryValue}>
            {formatWon(allocationResult.remainingAmount)}
          </strong>
        </div>

        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>배분률</span>
          <strong style={styles.summaryValue}>{allocationRate}%</strong>
        </div>
      </div>

      {allocationResult.items.length > 0 ? (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>우선순위</th>
                <th style={styles.th}>분류</th>
                <th style={styles.th}>추천 ETF</th>
                <th style={styles.th}>추천 금액</th>
                <th style={styles.th}>사유</th>
              </tr>
            </thead>
            <tbody>
              {allocationResult.items.map((item, index) => (
                <tr key={item.id || `${item.category}-${index}`}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>{item.category}</td>
                  <td style={styles.td}>
                    <strong>{item.etfName}</strong>
                    {item.etfCode ? (
                      <span style={styles.code}> {item.etfCode}</span>
                    ) : null}
                  </td>
                  <td style={styles.tdStrong}>{formatWon(item.amount)}</td>
                  <td style={styles.td}>{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={styles.emptyBox}>{allocationResult.message}</div>
      )}

      <p style={styles.notice}>
        계산 기준: 목표 비중 대비 부족 금액이 큰 항목부터 1,000원 단위로
        배분합니다.
      </p>
    </section>
  );
}

const styles = {
  card: {
    marginTop: "24px",
    padding: "24px",
    borderRadius: "18px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "20px",
  },
  eyebrow: {
    margin: 0,
    fontSize: "12px",
    fontWeight: 700,
    color: "#2563eb",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  title: {
    margin: "6px 0 8px",
    fontSize: "22px",
    fontWeight: 800,
    color: "#111827",
  },
  description: {
    margin: 0,
    fontSize: "14px",
    lineHeight: 1.6,
    color: "#4b5563",
  },
  inputBox: {
    marginBottom: "18px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: 700,
    color: "#374151",
  },
  inputRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  input: {
    width: "220px",
    maxWidth: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    fontWeight: 700,
    color: "#111827",
    outline: "none",
  },
  wonText: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#374151",
  },
  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "12px",
    marginBottom: "18px",
  },
  summaryItem: {
    padding: "14px",
    borderRadius: "14px",
    background: "#f9fafb",
    border: "1px solid #eef2f7",
  },
  summaryLabel: {
    display: "block",
    marginBottom: "6px",
    fontSize: "12px",
    color: "#6b7280",
  },
  summaryValue: {
    fontSize: "18px",
    color: "#111827",
  },
  tableWrap: {
    overflowX: "auto",
    borderRadius: "14px",
    border: "1px solid #e5e7eb",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: "14px",
  },
  th: {
    padding: "12px",
    background: "#f3f4f6",
    borderBottom: "1px solid #e5e7eb",
    textAlign: "left",
    color: "#374151",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #f1f5f9",
    color: "#374151",
    verticalAlign: "top",
  },
  tdStrong: {
    padding: "12px",
    borderBottom: "1px solid #f1f5f9",
    color: "#111827",
    fontWeight: 800,
    whiteSpace: "nowrap",
    verticalAlign: "top",
  },
  code: {
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: 600,
  },
  emptyBox: {
    padding: "18px",
    borderRadius: "14px",
    background: "#f9fafb",
    border: "1px dashed #d1d5db",
    color: "#6b7280",
    fontSize: "14px",
  },
  notice: {
    margin: "14px 0 0",
    fontSize: "12px",
    color: "#6b7280",
  },
};
