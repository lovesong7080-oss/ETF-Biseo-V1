export function calculateRetirementPlan({
  retireYear,
  livingCostManwon,
  pensionManwon,
  inflationRate,
}) {
  const currentYear = new Date().getFullYear();

  const yearsLeft = Math.max(0, Number(retireYear) - currentYear);

  const monthlyGap = Math.max(
    0,
    Number(livingCostManwon) - Number(pensionManwon)
  );

  const futureMonthlyGap = Math.round(
    monthlyGap * Math.pow(1 + Number(inflationRate) / 100, yearsLeft)
  );

  const neededRetirementAsset = futureMonthlyGap * 12 * 25;

  return {
    currentYear,
    yearsLeft,
    monthlyGap,
    futureMonthlyGap,
    neededRetirementAsset,
  };
}

export function calculatePortfolioSummary({ holdings, accounts }) {
  const total = holdings.reduce((sum, h) => sum + h.amount, 0);

  const profit = holdings.reduce(
    (sum, h) =>
      sum +
      (h.avgPrice && h.currentPrice
        ? Math.round((h.currentPrice - h.avgPrice) * (h.amount / h.avgPrice))
        : 0),
    0
  );

  const byAccount = Object.fromEntries(accounts.map(a => [a, 0]));
  const byRegion = { 한국: 0, 미국: 0 };
  let bond = 0;
  let semiconductor = 0;

  holdings.forEach(h => {
    byAccount[h.account] = (byAccount[h.account] || 0) + h.amount;
    byRegion[h.region] = (byRegion[h.region] || 0) + h.amount;

    if (h.type === '채권') bond += h.amount;
    if (h.theme === '반도체') semiconductor += h.amount;
  });

  return {
    total,
    profit,
    byAccount,
    byRegion,
    bond,
    semiconductor,
  };
}