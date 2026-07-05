import { Trash2 } from "lucide-react";

export default function HoldingsListCard({
  holdings,
  summary,
  won,
  pct,
  removeHolding,
}) {
  return (
    <div className="card">
      <h2>📂 ETF 보유목록 ({holdings.length}개)</h2>

      {holdings.length === 0 ? (
        <p className="empty">아직 추가된 ETF가 없습니다.</p>
      ) : (
        holdings.map((h) => (
          <div className="holding" key={h.id}>
            <div>
              <b>{h.name}</b>
              <p>{h.account} · {h.region} · {h.theme}</p>
              <p>평균매수가 {h.avgPrice ? won(h.avgPrice) : "-"}</p>
              <p>현재가 {h.currentPrice ? won(h.currentPrice) : "-"}</p>
              <p>
                수익률{" "}
                {h.avgPrice && h.currentPrice
                  ? (((h.currentPrice - h.avgPrice) / h.avgPrice) * 100).toFixed(2) + "%"
                  : "-"}
              </p>
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
                        (h.currentPrice - h.avgPrice) * (h.amount / h.avgPrice)
                      )
                    )}`
                  : "-"}
              </small>

              <br />
              <small>{pct(h.amount, summary.total)}</small>

              <button onClick={() => removeHolding(h.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}