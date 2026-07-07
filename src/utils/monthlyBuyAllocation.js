export function normalizeNumber(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return 0;
  }

  return number;
}

export function roundDownToUnit(amount, unit = 1000) {
  const safeAmount = Math.max(0, normalizeNumber(amount));
  const safeUnit = Math.max(1, normalizeNumber(unit));

  return Math.floor(safeAmount / safeUnit) * safeUnit;
}

export function calculateMonthlyBuyAllocation({
  monthlyInvestAmount,
  rebalancePriorityList = [],
  rebalanceEtfCandidates = [],
  minAllocationUnit = 1000,
} = {}) {
  const totalBudget = roundDownToUnit(monthlyInvestAmount, minAllocationUnit);

  if (totalBudget <= 0) {
    return {
      totalBudget: 0,
      allocatedAmount: 0,
      remainingAmount: 0,
      items: [],
      message: "이번 달 투자금이 입력되지 않았습니다.",
    };
  }

  const shortageItems = rebalancePriorityList
    .map((item) => {
      const shortageAmount =
        normalizeNumber(item.shortageAmount) ||
        normalizeNumber(item.gapAmount) ||
        normalizeNumber(item.needAmount) ||
        normalizeNumber(item.buyAmount) ||
        0;

      return {
        ...item,
        shortageAmount: Math.max(0, shortageAmount),
      };
    })
    .filter((item) => item.shortageAmount > 0)
    .sort((a, b) => b.shortageAmount - a.shortageAmount);

  if (shortageItems.length === 0) {
    return {
      totalBudget,
      allocatedAmount: 0,
      remainingAmount: totalBudget,
      items: [],
      message: "목표 비중보다 부족한 항목이 없습니다.",
    };
  }

  let remainingAmount = totalBudget;
  const allocations = [];

  for (const priorityItem of shortageItems) {
    if (remainingAmount < minAllocationUnit) {
      break;
    }

    const matchedCandidates = findMatchedEtfCandidates(
      priorityItem,
      rebalanceEtfCandidates
    );

    if (matchedCandidates.length === 0) {
      continue;
    }

    const targetAmount = Math.min(priorityItem.shortageAmount, remainingAmount);
    const roundedAmount = roundDownToUnit(targetAmount, minAllocationUnit);

    if (roundedAmount <= 0) {
      continue;
    }

    const mainCandidate = matchedCandidates[0];

    allocations.push({
      id: `${priorityItem.id || priorityItem.name || priorityItem.category}-${
        mainCandidate.code || mainCandidate.ticker || mainCandidate.name
      }`,
      category:
        priorityItem.category ||
        priorityItem.assetClass ||
        priorityItem.region ||
        priorityItem.name ||
        "분류 없음",
      etfName:
        mainCandidate.name ||
        mainCandidate.etfName ||
        mainCandidate.title ||
        "ETF 이름 없음",
      etfCode:
        mainCandidate.code ||
        mainCandidate.ticker ||
        mainCandidate.symbol ||
        "",
      amount: roundedAmount,
      shortageAmount: priorityItem.shortageAmount,
      reason:
        priorityItem.reason ||
        `${priorityItem.category || priorityItem.name || "해당 항목"} 비중 부족`,
      candidates: matchedCandidates,
    });

    remainingAmount -= roundedAmount;
  }

  const allocatedAmount = allocations.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  return {
    totalBudget,
    allocatedAmount,
    remainingAmount: totalBudget - allocatedAmount,
    items: allocations,
    message:
      allocations.length > 0
        ? "이번 달 투자금 기준 자동 매수 배분이 계산되었습니다."
        : "매수 후보 ETF가 없어 자동 배분하지 못했습니다.",
  };
}

function findMatchedEtfCandidates(priorityItem, rebalanceEtfCandidates) {
  const priorityKeys = [
    priorityItem.category,
    priorityItem.assetClass,
    priorityItem.region,
    priorityItem.name,
    priorityItem.label,
  ]
    .filter(Boolean)
    .map((value) => String(value).trim());

  if (priorityKeys.length === 0) {
    return [];
  }

  return rebalanceEtfCandidates.filter((candidate) => {
    const candidateKeys = [
      candidate.category,
      candidate.assetClass,
      candidate.region,
      candidate.targetCategory,
      candidate.group,
      candidate.name,
      candidate.etfName,
    ]
      .filter(Boolean)
      .map((value) => String(value).trim());

    return priorityKeys.some((priorityKey) =>
      candidateKeys.some(
        (candidateKey) =>
          candidateKey.includes(priorityKey) ||
          priorityKey.includes(candidateKey)
      )
    );
  });
}
