import { useEffect, useMemo, useState } from "react";
import { calculateMonthlyBuyAllocation } from "../utils/monthlyBuyAllocation";

const STORAGE_KEY = "etfBiseoMonthlyInvestAmount";
const PRICE_STORAGE_KEY = "etfBiseoEtfPriceInputs";

const TEXT = {
  eyebrow: "MONTHLY BUY ALLOCATION",
  title: "\uC774\uBC88 \uB2EC \uC790\uB3D9 \uB9E4\uC218 \uBC30\uBD84",
  description:
    "\uC774\uBC88 \uB2EC \uC0C8\uB85C \uB123\uC744 \uD22C\uC790\uAE08\uB9CC \uAE30\uC900\uC73C\uB85C \uBD80\uC871\uD55C \uC790\uC0B0\uAD70\uC758 ETF \uB9E4\uC218 \uAE08\uC561\uACFC \uB9E4\uC218 \uC218\uB7C9\uC744 \uACC4\uC0B0\uD569\uB2C8\uB2E4.",
  monthlyAmount: "\uC774\uBC88 \uB2EC \uD22C\uC790\uAE08",
  quickAmount: "\uBE60\uB978 \uAE08\uC561",
  totalBudget: "\uD22C\uC790\uAE08",
  allocatedAmount: "\uBC30\uBD84 \uAE08\uC561",
  actualOrderAmount: "\uC2E4\uC81C \uC8FC\uBB38\uC561",
  remainingAmount: "\uB0A8\uC740 \uAE08\uC561",
  allocationRate: "\uBC30\uBD84\uB960",
  priority: "\uC6B0\uC120\uC21C\uC704",
  category: "\uBD84\uB958",
  recommendedEtf: "\uCD94\uCC9C ETF",
  plannedAmount: "\uCD94\uCC9C \uAE08\uC561",
  currentPrice: "\uD604\uC7AC\uAC00",
  buyShares: "\uB9E4\uC218 \uC218\uB7C9",
  usedAmount: "\uC0AC\uC6A9 \uAE08\uC561",
  itemCashLeft: "\uC794\uC561",
  reason: "\uC0AC\uC720",
  alternativeCandidates: "\uB300\uCCB4 \uD6C4\uBCF4",
  checklistTitle: "\uC2E4\uC804 \uC8FC\uBB38 \uCCB4\uD06C\uB9AC\uC2A4\uD2B8",
  notice:
    "\uACC4\uC0B0 \uAE30\uC900: \uBAA9\uD45C \uBE44\uC911 \uB300\uBE44 \uBD80\uC871 \uAE08\uC561\uC774 \uD070 \uD56D\uBAA9\uBD80\uD130 1,000\uC6D0 \uB2E8\uC704\uB85C \uBC30\uBD84\uD569\uB2C8\uB2E4.",
  noSell:
    "\uBE44\uC911 \uCD08\uACFC \uC790\uC0B0\uC740 \uC774\uBC88 \uB2EC \uB9E4\uC218 \uB300\uC0C1\uC5D0\uC11C \uC81C\uC678\uD569\uB2C8\uB2E4.",
  priceNotice:
    "\uD604\uC7AC\uAC00\uB294 \uC2E4\uC2DC\uAC04 \uC2DC\uC138\uAC00 \uC544\uB2C8\uBBC0\uB85C, \uC8FC\uBB38 \uC9C1\uC804 \uC99D\uAD8C\uC0AC \uD654\uBA74\uC5D0\uC11C \uB2E4\uC2DC \uD655\uC778\uD558\uC138\uC694.",
  won: "\uC6D0",
  shares: "\uC8FC",
};

const QUICK_AMOUNTS = [100000, 300000, 500000, 1000000, 2000000];

function formatWon(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return `0${TEXT.won}`;
  }

  return `${Math.round(number).toLocaleString("ko-KR")}${TEXT.won}`;
}

function formatShares(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return `0${TEXT.shares}`;
  }

  return `${Math.floor(number).toLocaleString("ko-KR")}${TEXT.shares}`;
}

function parseWonInput(value) {
  return Number(String(value).replace(/[^0-9]/g, "")) || 0;
}

function getPriceKey(item) {
  return String(item.etfCode || item.etfName || item.id || item.category || "unknown");
}

function safeStorageGet(key) {
  try {
    if (typeof window === "undefined") {
      return "";
    }

    return window.localStorage.getItem(key) || "";
  } catch {
    return "";
  }
}

function safeStorageSet(key, value) {
  try {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
    }
  } catch {
    // localStorage access can fail in restricted browser modes.
  }
}

function safeJsonStorageGet(key) {
  try {
    const rawValue = safeStorageGet(key);

    if (!rawValue) {
      return {};
    }

    const parsed = JSON.parse(rawValue);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export default function MonthlyBuyAllocationCard({
  rebalancePriorityList = [],
  rebalanceEtfCandidates = [],
}) {
  const [monthlyInvestAmountInput, setMonthlyInvestAmountInput] = useState(() => {
    return safeStorageGet(STORAGE_KEY) || "500000";
  });

  const [etfPrices, setEtfPrices] = useState(() => {
    return safeJsonStorageGet(PRICE_STORAGE_KEY);
  });

  useEffect(() => {
    safeStorageSet(STORAGE_KEY, monthlyInvestAmountInput);
  }, [monthlyInvestAmountInput]);

  useEffect(() => {
    safeStorageSet(PRICE_STORAGE_KEY, JSON.stringify(etfPrices));
  }, [etfPrices]);

  const monthlyInvestAmount = parseWonInput(monthlyInvestAmountInput);

  const allocationResult = useMemo(() => {
    return calculateMonthlyBuyAllocation({
      monthlyInvestAmount,
      rebalancePriorityList,
      rebalanceEtfCandidates,
      minAllocationUnit: 1000,
    });
  }, [monthlyInvestAmount, rebalancePriorityList, rebalanceEtfCandidates]);

  const allocationItems = useMemo(() => {
    return allocationResult.items.map((item) => {
      const priceKey = getPriceKey(item);
      const priceInput = etfPrices[priceKey] || "";
      const currentPrice = parseWonInput(priceInput);
      const buyShares = currentPrice > 0 ? Math.floor(item.amount / currentPrice) : 0;
      const usedAmount = buyShares * currentPrice;
      const itemCashLeft = Math.max(0, item.amount - usedAmount);

      return {
        ...item,
        priceKey,
        priceInput,
        currentPrice,
        buyShares,
        usedAmount,
        itemCashLeft,
      };
    });
  }, [allocationResult.items, etfPrices]);

  const actualOrderAmount = allocationItems.reduce(
    (sum, item) => sum + item.usedAmount,
    0
  );

  const totalCashLeftAfterOrder = Math.max(
    0,
    allocationResult.totalBudget - actualOrderAmount
  );

  const allocationRate =
    allocationResult.totalBudget > 0
      ? Math.round(
          (allocationResult.allocatedAmount / allocationResult.totalBudget) *
            100
        )
      : 0;

  const handlePriceChange = (item, value) => {
    const priceKey = getPriceKey(item);

    setEtfPrices((prevPrices) => {
      const nextPrices = { ...prevPrices };

      if (!value) {
        delete nextPrices[priceKey];
      } else {
        nextPrices[priceKey] = value;
      }

      return nextPrices;
    });
  };

  return (
    <section style={styles.card}>
      <div style={styles.header}>
        <div>
          <p style={styles.eyebrow}>{TEXT.eyebrow}</p>
          <h2 style={styles.title}>{TEXT.title}</h2>
          <p style={styles.description}>{TEXT.description}</p>
        </div>
      </div>

      <div style={styles.inputBox}>
        <label style={styles.label} htmlFor="monthly-invest-amount">
          {TEXT.monthlyAmount}
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
            placeholder="500000"
            style={styles.input}
          />
          <span style={styles.wonText}>{TEXT.won}</span>
        </div>

        <div style={styles.quickBox}>
          <span style={styles.quickLabel}>{TEXT.quickAmount}</span>
          {QUICK_AMOUNTS.map((amount) => (
            <button
              key={amount}
              type="button"
              style={styles.quickButton}
              onClick={() => setMonthlyInvestAmountInput(String(amount))}
            >
              {formatWon(amount)}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.summaryGrid}>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>{TEXT.totalBudget}</span>
          <strong style={styles.summaryValue}>
            {formatWon(allocationResult.totalBudget)}
          </strong>
        </div>

        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>{TEXT.allocatedAmount}</span>
          <strong style={styles.summaryValue}>
            {formatWon(allocationResult.allocatedAmount)}
          </strong>
        </div>

        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>{TEXT.actualOrderAmount}</span>
          <strong style={styles.summaryValue}>
            {formatWon(actualOrderAmount)}
          </strong>
        </div>

        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>{TEXT.remainingAmount}</span>
          <strong style={styles.summaryValue}>
            {formatWon(totalCashLeftAfterOrder)}
          </strong>
        </div>

        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>{TEXT.allocationRate}</span>
          <strong style={styles.summaryValue}>{allocationRate}%</strong>
        </div>
      </div>

      {allocationItems.length > 0 ? (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>{TEXT.priority}</th>
                <th style={styles.th}>{TEXT.category}</th>
                <th style={styles.th}>{TEXT.recommendedEtf}</th>
                <th style={styles.th}>{TEXT.plannedAmount}</th>
                <th style={styles.th}>{TEXT.currentPrice}</th>
                <th style={styles.th}>{TEXT.buyShares}</th>
                <th style={styles.th}>{TEXT.usedAmount}</th>
                <th style={styles.th}>{TEXT.itemCashLeft}</th>
                <th style={styles.th}>{TEXT.reason}</th>
              </tr>
            </thead>
            <tbody>
              {allocationItems.map((item, index) => {
                const alternativeCandidates = (item.candidates || [])
                  .slice(1, 3)
                  .map((candidate) => candidate.name || candidate.etfName)
                  .filter(Boolean);

                return (
                  <tr key={item.id || `${item.category}-${index}`}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{item.category}</td>
                    <td style={styles.td}>
                      <strong>{item.etfName}</strong>
                      {item.etfCode ? (
                        <span style={styles.code}> {item.etfCode}</span>
                      ) : null}

                      {alternativeCandidates.length > 0 && (
                        <div style={styles.alternativeText}>
                          {TEXT.alternativeCandidates}:{" "}
                          {alternativeCandidates.join(" / ")}
                        </div>
                      )}
                    </td>
                    <td style={styles.tdStrong}>{formatWon(item.amount)}</td>
                    <td style={styles.td}>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={item.priceInput}
                        onChange={(event) =>
                          handlePriceChange(item, event.target.value)
                        }
                        placeholder="0"
                        style={styles.priceInput}
                      />
                    </td>
                    <td style={styles.tdStrong}>{formatShares(item.buyShares)}</td>
                    <td style={styles.tdStrong}>{formatWon(item.usedAmount)}</td>
                    <td style={styles.td}>{formatWon(item.itemCashLeft)}</td>
                    <td style={styles.td}>{item.reason}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={styles.emptyBox}>{allocationResult.message}</div>
      )}

      <div style={styles.checklistBox}>
        <h3 style={styles.checklistTitle}>{TEXT.checklistTitle}</h3>
        <ul style={styles.checklist}>
          <li>{TEXT.noSell}</li>
          <li>{TEXT.notice}</li>
          <li>{TEXT.priceNotice}</li>
        </ul>
      </div>
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
  priceInput: {
    width: "90px",
    padding: "8px 10px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "13px",
    fontWeight: 700,
    color: "#111827",
    outline: "none",
  },
  wonText: {
    fontSize: "15px",
    fontWeight: 700,
    color: "#374151",
  },
  quickBox: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "8px",
    marginTop: "12px",
  },
  quickLabel: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#6b7280",
  },
  quickButton: {
    padding: "8px 10px",
    borderRadius: "999px",
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    color: "#374151",
    fontSize: "12px",
    fontWeight: 700,
    cursor: "pointer",
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
  alternativeText: {
    marginTop: "6px",
    color: "#6b7280",
    fontSize: "12px",
    lineHeight: 1.5,
  },
  emptyBox: {
    padding: "18px",
    borderRadius: "14px",
    background: "#f9fafb",
    border: "1px dashed #d1d5db",
    color: "#6b7280",
    fontSize: "14px",
  },
  checklistBox: {
    marginTop: "16px",
    padding: "14px",
    borderRadius: "14px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  checklistTitle: {
    margin: "0 0 8px",
    fontSize: "14px",
    color: "#111827",
  },
  checklist: {
    margin: 0,
    paddingLeft: "20px",
    fontSize: "12px",
    lineHeight: 1.7,
    color: "#4b5563",
  },
};
