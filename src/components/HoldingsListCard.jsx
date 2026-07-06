import { Check, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";

export default function HoldingsListCard({
  holdings,
  summary,
  won,
  pct,
  removeHolding,
  updateHolding,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editAmountManwon, setEditAmountManwon] = useState("");
  const [editAvgPrice, setEditAvgPrice] = useState("");
  const [editCurrentPrice, setEditCurrentPrice] = useState("");

  const onlyNumbers = (value) => value.replace(/[^0-9]/g, "");

  const startEdit = (holding) => {
    setEditingId(holding.id);
    setEditAmountManwon(String(Math.round(holding.amount / 10000)));
    setEditAvgPrice(holding.avgPrice ? String(holding.avgPrice) : "");
    setEditCurrentPrice(holding.currentPrice ? String(holding.currentPrice) : "");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditAmountManwon("");
    setEditAvgPrice("");
    setEditCurrentPrice("");
  };

  const saveEdit = (holding) => {
    if (!editAmountManwon) {
      alert("투자금액을 입력하세요.");
      return;
    }

    const amount = Number(editAmountManwon) * 10000;
    const avgPrice = Number(editAvgPrice || 0);
    const currentPrice = Number(editCurrentPrice || 0);

    if (amount <= 0) {
      alert("투자금액은 0보다 커야 합니다.");
      return;
    }

    updateHolding(holding.id, {
      amount,
      avgPrice,
      currentPrice,
    });

    cancelEdit();
  };

  return (
    <div className="card">
      <h2>📂 ETF 보유목록 ({holdings.length}개)</h2>

      {holdings.length === 0 ? (
        <p className="empty">아직 추가된 ETF가 없습니다.</p>
      ) : (
        holdings.map((h) => {
          const isEditing = editingId === h.id;

          return (
            <div className="holding" key={h.id}>
              <div>
                <b>{h.name}</b>
                <p>
                  {h.account} · {h.region} · {h.theme}
                </p>

                {isEditing ? (
                  <div>
                    <label>투자금액 / 만원 단위</label>
                    <input
                      value={editAmountManwon}
                      onChange={(e) =>
                        setEditAmountManwon(onlyNumbers(e.target.value))
                      }
                      placeholder="예: 2500"
                      inputMode="numeric"
                    />

                    <label>평균매수가 / 원</label>
                    <input
                      value={editAvgPrice}
                      onChange={(e) =>
                        setEditAvgPrice(onlyNumbers(e.target.value))
                      }
                      placeholder="예: 25000"
                      inputMode="numeric"
                    />

                    <label>현재가 / 원</label>
                    <input
                      value={editCurrentPrice}
                      onChange={(e) =>
                        setEditCurrentPrice(onlyNumbers(e.target.value))
                      }
                      placeholder="예: 27500"
                      inputMode="numeric"
                    />
                  </div>
                ) : (
                  <>
                    <p>평균매수가 {h.avgPrice ? won(h.avgPrice) : "-"}</p>
                    <p>현재가 {h.currentPrice ? won(h.currentPrice) : "-"}</p>
                    <p>
                      수익률{" "}
                      {h.avgPrice && h.currentPrice
                        ? (
                            ((h.currentPrice - h.avgPrice) / h.avgPrice) *
                            100
                          ).toFixed(2) + "%"
                        : "-"}
                    </p>
                  </>
                )}
              </div>

              <div className="right">
                <strong>{won(h.amount)}</strong>
                <br />

                <small
                  style={{
                    color:
                      h.avgPrice && h.currentPrice
                        ? h.currentPrice >= h.avgPrice
                          ? "red"
                          : "blue"
                        : "inherit",
                  }}
                >
                  손익{" "}
                  {h.avgPrice && h.currentPrice
                    ? `${h.currentPrice >= h.avgPrice ? "+" : ""}${won(
                        Math.round(
                          (h.currentPrice - h.avgPrice) *
                            (h.amount / h.avgPrice)
                        )
                      )}`
                    : "-"}
                </small>

                <br />
                <small>{pct(h.amount, summary.total)}</small>

                {isEditing ? (
                  <>
                    <button onClick={() => saveEdit(h)}>
                      <Check size={16} />
                    </button>

                    <button onClick={cancelEdit}>
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => startEdit(h)}>
                      <Pencil size={16} />
                    </button>

                    <button onClick={() => removeHolding(h.id)}>
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}