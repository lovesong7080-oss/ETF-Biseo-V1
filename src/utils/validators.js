export function validateHoldingInput({
  amountManwon,
  avgPrice,
  currentPrice,
}) {
  const amount = Number(amountManwon);

  if (!Number.isFinite(amount) || amount <= 0) {
    return '평가금액을 만원 단위로 입력해 주세요. 예: 2500';
  }

  if (avgPrice !== '' && avgPrice !== null && avgPrice !== undefined) {
    const avg = Number(avgPrice);

    if (!Number.isFinite(avg) || avg <= 0) {
      return '평균매수가는 0보다 큰 숫자로 입력해 주세요.';
    }
  }

  if (currentPrice !== '' && currentPrice !== null && currentPrice !== undefined) {
    const current = Number(currentPrice);

    if (!Number.isFinite(current) || current <= 0) {
      return '현재가는 0보다 큰 숫자로 입력해 주세요.';
    }
  }

  return '';
}