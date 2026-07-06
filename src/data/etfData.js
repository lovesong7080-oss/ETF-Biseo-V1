export const ACCOUNTS = ["개인연금", "DC퇴직연금", "개인종합계좌", "ISA"];

export const ETF_DB = [
  { name: "KODEX 200", region: "한국", type: "주식", theme: "시장대표" },
  { name: "HANARO Fn K-반도체", region: "한국", type: "주식", theme: "반도체" },
  { name: "SOL 반도체소부장", region: "한국", type: "주식", theme: "반도체" },
  { name: "KODEX 미국채", region: "미국", type: "채권", theme: "채권" },
  { name: "KODEX 미국나스닥100", region: "미국", type: "주식", theme: "나스닥" },
  { name: "KODEX 미국S&P500", region: "미국", type: "주식", theme: "S&P500" },
  { name: "TIGER 미국S&P500", region: "미국", type: "주식", theme: "S&P500" },
  { name: "TIGER 미국나스닥100", region: "미국", type: "주식", theme: "나스닥" },
];
export const DEFAULT_TARGET = {
  미국: 60,
  한국: 20,
  채권: 20,
};
export const DEFAULT_ACCOUNT = '개인연금';

export const DEFAULT_ETF_NAME = ETF_DB[0].name;

export const DEFAULT_TAB = 'home';

export const HOLDINGS_STORAGE_KEY = 'etf-biseo-holdings';

export const DEFAULT_HOLDING_INPUTS = {
  amountManwon: '',
  avgPrice: '',
  currentPrice: '',
};

export const DEFAULT_INVEST_STYLE = 'balanced';

export const DEFAULT_RETIREMENT_INPUTS = {
  retireAge: 65,
  retireYear: 2036,
  pensionManwon: 150,
  livingCostManwon: 300,
};

export const DEFAULT_SIMULATION_INPUTS = {
  monthlyInvest: 150,
  expectedReturn: 10,
  dividendYield: 3,
  inflationRate: 2.5,
};