import MonthlyBuyAllocationCard from "./MonthlyBuyAllocationCard";

const TEXT = {
  us: "\uBBF8\uAD6D",
  korea: "\uD55C\uAD6D",
  bond: "\uCC44\uAD8C",
  semiconductor: "\uBC18\uB3C4\uCCB4",
  targetAnalysis: "\uD83D\uDCCA \uBAA9\uD45C \uBE44\uC911 \uBD84\uC11D",
  targetAllocation: "\uBAA9\uD45C \uC790\uC0B0 \uBC30\uBD84",
  buyPriority: "\uB9E4\uC218 \uC6B0\uC120\uC21C\uC704",
  candidateEtf: "\uD6C4\uBCF4 ETF",
  noBuyPriority: "\uCD94\uAC00 \uB9E4\uC218 \uC6B0\uC120\uC21C\uC704 \uC5C6\uC74C",
  noBuyPriorityMessage:
    "\uBAA9\uD45C \uBE44\uC911 \uAE30\uC900\uC73C\uB85C \uD06C\uAC8C \uBD80\uC871\uD55C \uC790\uC0B0\uAD70\uC774 \uC5C6\uC2B5\uB2C8\uB2E4.",
  overweightAssets: "\uBE44\uC911 \uCD08\uACFC \uC790\uC0B0",
  gapAnalysis: "\uBD80\uC871/\uCD08\uACFC \uBD84\uC11D",
  rebalanceProposal: "\uB9AC\uBC38\uB7F0\uC2F1 \uC81C\uC548",
  currentWeight: "\uD604\uC7AC \uC790\uC0B0 \uBE44\uC911",
  current: "\uD604\uC7AC",
  target: "\uBAA9\uD45C",
  gap: "\uCC28\uC774",
  shortage: "\uBD80\uC871",
  overweight: "\uCD08\uACFC",
  normal: "\uC801\uC815",
  buyNeeded: "\uCD94\uAC00 \uB9E4\uC218 \uD544\uC694",
  overweightAmount: "\uBE44\uC911 \uCD08\uACFC",
  targetOk: "\uBAA9\uD45C \uBE44\uC911 \uC801\uC815",
  won: "\uC6D0",
  rank: "\uC21C\uC704",
  shortageReason: "\uBAA9\uD45C \uBE44\uC911 \uB300\uBE44 \uBD80\uC871",
};

const DEFAULT_ASSET_KEYS = [TEXT.us, TEXT.korea, TEXT.bond];

function assetDisplayName(asset) {
  const text = String(asset || "");
  const lower = text.toLowerCase();

  if (
    text.includes(TEXT.us) ||
    text.includes("\u8A98") ||
    lower.includes("us") ||
    lower.includes("america") ||
    lower.includes("s&p") ||
    lower.includes("nasdaq")
  ) {
    return TEXT.us;
  }

  if (
    text.includes(TEXT.korea) ||
    text.includes("\uC4D2") ||
    lower.includes("korea") ||
    lower.includes("kospi")
  ) {
    return TEXT.korea;
  }

  if (
    text.includes(TEXT.bond) ||
    text.includes("\uF9E2") ||
    lower.includes("bond") ||
    lower.includes("treasury")
  ) {
    return TEXT.bond;
  }

  if (
    text.includes(TEXT.semiconductor) ||
    text.includes("\u8ADB") ||
    lower.includes("semiconductor")
  ) {
    return TEXT.semiconductor;
  }

  return text || "\uBD84\uB958 \uC5C6\uC74C";
}

function getAssetKeys(target) {
  const keys = Object.keys(target || {}).filter(Boolean);
  return keys.length > 0 ? keys : DEFAULT_ASSET_KEYS;
}

function formatAmount(won, value) {
  if (typeof won === "function") {
    return won(value);
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return `0${TEXT.won}`;
  }

  return `${Math.round(number).toLocaleString("ko-KR")}${TEXT.won}`;
}

function defaultPct(value, total) {
  const safeValue = Number(value) || 0;
  const safeTotal = Number(total) || 0;

  if (safeTotal <= 0) {
    return "0%";
  }

  return `${Math.round((safeValue / safeTotal) * 100)}%`;
}

function Bar({ label, value, total, pct }) {
  const safeValue = Number(value) || 0;
  const safeTotal = Number(total) || 0;
  const width = safeTotal ? Math.round((safeValue / safeTotal) * 100) : 0;
  const pctText =
    typeof pct === "function" ? pct(safeValue, safeTotal) : defaultPct(safeValue, safeTotal);

  return (
    <div className="bar-wrap">
      <div className="bar-top">
        <span>{label}</span>
        <b>{pctText}</b>
      </div>
      <div className="bar-bg">
        <div className="bar-fill" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

function getGapStatus(gapPercent, amount) {
  if (Math.abs(gapPercent) < 1 && Math.abs(amount) < 10000) {
    return {
      label: TEXT.normal,
      className: "neutral",
      message: "\uBAA9\uD45C \uBE44\uC911\uACFC \uAC70\uC758 \uB9DE\uC2B5\uB2C8\uB2E4.",
    };
  }

  if (gapPercent > 0 || amount > 0) {
    return {
      label: TEXT.shortage,
      className: "under",
      message:
        "\uC774\uBC88 \uB2EC \uC2E0\uADDC \uD22C\uC790\uAE08\uC744 \uC6B0\uC120 \uBC30\uBD84\uD560 \uD6C4\uBCF4\uC785\uB2C8\uB2E4.",
    };
  }

  return {
    label: TEXT.overweight,
    className: "over",
    message:
      "\uC2E0\uADDC \uB9E4\uC218\uB294 \uC904\uC774\uACE0 \uB2E4\uB978 \uBD80\uC871 \uC790\uC0B0\uC744 \uC6B0\uC120\uD558\uB294 \uD3B8\uC774 \uC88B\uC2B5\uB2C8\uB2E4.",
  };
}

export default function AssetAnalysisCard({
  target = {},
  setTarget = () => {},
  currentWeight = {},
  rebalance = {},
  needAmount = {},
  won,
  summary = {},
  pct,
  etfDb = [],
}) {
  const assetKeys = getAssetKeys(target);
  const safeSummary = summary || {};
  const byRegion = safeSummary.byRegion || {};

  const targetItems = assetKeys.map((asset) => {
    const current = Number(currentWeight[asset]) || 0;
    const targetWeight = Number(target[asset]) || 0;
    const gap = Number(rebalance[asset]) || 0;
    const amount = Number(needAmount[asset]) || 0;
    const status = getGapStatus(gap, amount);
    const label = assetDisplayName(asset);

    return {
      asset,
      label,
      current,
      targetWeight,
      gap,
      amount,
      absGap: Math.abs(gap),
      absAmount: Math.abs(amount),
      status,
    };
  });

  const buyPriorityItems = targetItems
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount);

  const overweightItems = targetItems
    .filter((item) => item.amount < 0)
    .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));

  const getCandidateEtfs = (asset) => {
    const targetLabel = assetDisplayName(asset);

    return (etfDb || [])
      .filter((etf) => {
        const etfRegion = assetDisplayName(etf.region);
        const etfType = assetDisplayName(etf.type);
        const rawType = String(etf.type || "").toLowerCase();

        if (targetLabel === TEXT.bond) {
          return etfType === TEXT.bond || rawType.includes("bond");
        }

        return etfRegion === targetLabel && etfType !== TEXT.bond;
      })
      .slice(0, 3);
  };

  const rebalancePriorityList = buyPriorityItems.map((item) => ({
    id: item.asset,
    category: item.label,
    assetClass: item.label,
    region: item.label,
    name: item.label,
    shortageAmount: item.amount,
    reason: `${item.label} ${TEXT.shortageReason}`,
  }));

  const rebalanceEtfCandidates = buyPriorityItems.flatMap((item) =>
    getCandidateEtfs(item.asset).map((etf) => ({
      ...etf,
      category: item.label,
      assetClass: item.label,
      region: item.label,
      targetCategory: item.label,
      name: etf.name,
      etfName: etf.name,
      code: etf.code || etf.ticker || etf.symbol || "",
    }))
  );

  return (
    <div className="card">
      <h2>{TEXT.targetAnalysis}</h2>

      <div className="target-editor">
        <h3>{TEXT.targetAllocation}</h3>

        {assetKeys.map((asset) => (
          <div className="row" key={asset}>
            <span>{assetDisplayName(asset)}</span>
            <input
              type="number"
              value={target[asset] ?? 0}
              onChange={(e) =>
                setTarget({ ...(target || {}), [asset]: Number(e.target.value) })
              }
            />
          </div>
        ))}
      </div>

      <div className="rebalance-priority-list">
        <h3>{TEXT.buyPriority}</h3>

        {buyPriorityItems.length > 0 ? (
          buyPriorityItems.map((item, index) => (
            <div className="priority-card buy" key={item.asset}>
              <div className="priority-rank">
                {index + 1}
                {TEXT.rank}
              </div>

              <div className="priority-content">
                <strong>{item.label}</strong>
                <p>
                  {formatAmount(won, item.amount)} {TEXT.buyNeeded} / {TEXT.shortage}{" "}
                  {Math.round(item.absGap)}%p
                </p>

                {getCandidateEtfs(item.asset).length > 0 && (
                  <div className="candidate-etfs">
                    <span>{TEXT.candidateEtf}</span>
                    <ul>
                      {getCandidateEtfs(item.asset).map((etf) => (
                        <li key={etf.name}>
                          {etf.name}
                          <small>
                            {assetDisplayName(etf.region)} / {assetDisplayName(etf.type)}
                            {etf.theme ? ` / ${etf.theme}` : ""}
                          </small>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="priority-card neutral">
            <div className="priority-rank">OK</div>

            <div className="priority-content">
              <strong>{TEXT.noBuyPriority}</strong>
              <p>{TEXT.noBuyPriorityMessage}</p>
            </div>
          </div>
        )}

        {overweightItems.length > 0 && (
          <div className="overweight-note">
            <strong>{TEXT.overweightAssets}</strong>
            <p>
              {overweightItems
                .map(
                  (item) =>
                    `${item.label} ${formatAmount(won, item.absAmount)} ${TEXT.overweight}`
                )
                .join(" / ")}
            </p>
          </div>
        )}
      </div>

      <MonthlyBuyAllocationCard
        rebalancePriorityList={rebalancePriorityList}
        rebalanceEtfCandidates={rebalanceEtfCandidates}
      />

      <div className="target-gap-list">
        <h3>{TEXT.gapAnalysis}</h3>

        {targetItems.map((item) => (
          <div
            className={`target-gap-card ${item.status.className}`}
            key={item.asset}
          >
            <div className="target-gap-header">
              <strong>{item.label}</strong>
              <span>{item.status.label}</span>
            </div>

            <div className="target-gap-detail">
              <p>
                {TEXT.current} {Math.round(item.current)}% / {TEXT.target}{" "}
                {item.targetWeight}%
              </p>
              <p>
                {item.gap > 0
                  ? TEXT.shortage
                  : item.gap < 0
                    ? TEXT.overweight
                    : TEXT.gap}{" "}
                {Math.round(item.absGap)}%p / {formatAmount(won, item.absAmount)}
              </p>
            </div>

            <p className="target-gap-message">{item.status.message}</p>
          </div>
        ))}
      </div>

      <div className="target-action-summary">
        <h3>{TEXT.rebalanceProposal}</h3>

        {targetItems.map((item) => (
          <div className="row" key={item.asset}>
            <span>{item.label}</span>
            <b>
              {item.amount > 0
                ? `${formatAmount(won, item.amount)} ${TEXT.buyNeeded}`
                : item.amount < 0
                  ? `${formatAmount(won, item.absAmount)} ${TEXT.overweightAmount}`
                  : TEXT.targetOk}
            </b>
          </div>
        ))}
      </div>

      <div className="asset-weight-bars">
        <h3>{TEXT.currentWeight}</h3>

        {targetItems.map((item) => (
          <Bar
            key={item.asset}
            label={item.label}
            value={
              item.label === TEXT.bond
                ? safeSummary.bond || byRegion[item.asset] || byRegion[item.label] || 0
                : byRegion[item.asset] || byRegion[item.label] || 0
            }
            total={safeSummary.total}
            pct={pct}
          />
        ))}

        {Number(safeSummary.semiconductor || 0) > 0 && (
          <Bar
            label={TEXT.semiconductor}
            value={safeSummary.semiconductor}
            total={safeSummary.total}
            pct={pct}
          />
        )}
      </div>
    </div>
  );
}
