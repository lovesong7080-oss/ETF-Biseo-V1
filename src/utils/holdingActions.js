export function calculateHoldingAmount(amountManwon) {
  return Number(amountManwon) * 10000;
}

export function createHolding({
  etfName,
  etfDb,
  account,
  amountManwon,
  avgPrice,
  currentPrice,
}) {
  const amount = calculateHoldingAmount(amountManwon);
  const meta = etfDb.find(e => e.name === etfName);

  return {
    id: Date.now(),
    account,
    amount,
    avgPrice: Number(avgPrice || 0),
    currentPrice: Number(currentPrice || 0),
    ...meta,
  };
}

export function removeHoldingById(holdings, id) {
  return holdings.filter(h => h.id !== id);
}