export default function AddHoldingCard({
  ACCOUNTS,
  account,
  setAccount,
  search,
  setSearch,
  filteredEtfs,
  etfName,
  setEtfName,
  avgPrice,
  setAvgPrice,
  currentPrice,
  setCurrentPrice,
  amountManwon,
  setAmountManwon,
  addHolding,
}) {
  return (
    <div className="card form-card">
      <h2>ETF 추가</h2>

      <label>계좌</label>
      <select value={account} onChange={(e) => setAccount(e.target.value)}>
        {ACCOUNTS.map((a) => (
          <option key={a}>{a}</option>
        ))}
      </select>

      <label>ETF 검색</label>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="예: KODEX, 미국, 반도체"
        inputMode="text"
      />

      <div className="etf-list">
        {filteredEtfs.map((e) => (
          <button
            key={e.name}
            className={etfName === e.name ? "etf-item selected" : "etf-item"}
            onClick={() => setEtfName(e.name)}
          >
            <b>{e.name}</b>
            <span>
              {e.region} · {e.type} · {e.theme}
            </span>
          </button>
        ))}
      </div>

      <label>평균매수가 (원)</label>
      <input
        value={avgPrice}
        onChange={(e) => setAvgPrice(e.target.value.replace(/[^0-9]/g, ""))}
        placeholder="예: 25000"
        inputMode="numeric"
      />

      <label>현재가 (원)</label>
      <input
        value={currentPrice}
        onChange={(e) => setCurrentPrice(e.target.value.replace(/[^0-9]/g, ""))}
        placeholder="예: 27500"
        inputMode="numeric"
      />

      <label>평가금액 (만원 단위)</label>
      <input
        value={amountManwon}
        onChange={(e) => setAmountManwon(e.target.value.replace(/[^0-9]/g, ""))}
        placeholder="예: 2500 = 2,500만원"
        inputMode="numeric"
      />

      <button className="primary" onClick={addHolding}>
        저장
      </button>
    </div>
  );
}