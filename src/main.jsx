import { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import AccountCard from "./components/AccountCard";
import AddHoldingCard from "./components/AddHoldingCard";
import AiBriefingCard from "./components/AiBriefingCard";
import AssetAnalysisCard from "./components/AssetAnalysisCard";
import BottomNav from "./components/BottomNav";
import FireCard from './components/FireCard';
import HoldingsListCard from "./components/HoldingsListCard";
import InvestStyleCard from "./components/InvestStyleCard";
import RecommendedEtfCard from "./components/RecommendedEtfCard";
import RetirementCard from "./components/RetirementCard";
import RetirementGoalCard from "./components/RetirementGoalCard";
import SettingsCard from "./components/SettingsCard";
import SimulationCard from "./components/SimulationCard";
import TotalAssetCard from "./components/TotalAssetCard";
import { ACCOUNTS, ETF_DB } from "./data/etfData";
import useLocalStorage from "./hooks/useLocalStorage";
import './index.css';
import {
  calculatePortfolioSummary,
  calculateRetirementPlan,
} from "./utils/calculations";
import { pct, won } from "./utils/format";






function App() {
  const [tab, setTab] = useState('home');
  const [investStyle, setInvestStyle] = useState("balanced");
  const [holdings, setHoldings] = useLocalStorage('etf-biseo-holdings', []);
  const [account, setAccount] = useState('개인연금');
  const [etfName, setEtfName] = useState(ETF_DB[0].name);
  const [search, setSearch] = useState('');
  const [amountManwon, setAmountManwon] = useState('');
  const [avgPrice, setAvgPrice] = useState('');
  const [currentPrice, setCurrentPrice] = useState('');
  const [retireAge, setRetireAge] = useState(65);
  const [retireYear, setRetireYear] = useState(2036);
  const [pensionManwon, setPensionManwon] = useState(150);
  const [livingCostManwon, setLivingCostManwon] = useState(300);
  const [monthlyInvest, setMonthlyInvest] = useState(150);
  const [expectedReturn, setExpectedReturn] = useState(10);
  const [dividendYield, setDividendYield] = useState(3);
  const [inflationRate, setInflationRate] = useState(2.5);
  
const [target, setTarget] = useState({
  미국: 60,
  한국: 20,
  채권: 20
});

const filteredEtfs = ETF_DB.filter(etf =>
  etf.name.toLowerCase().includes(search.toLowerCase())
);

  const {
    currentYear,
    yearsLeft,
    monthlyGap,
    futureMonthlyGap,
    neededRetirementAsset,
  } = calculateRetirementPlan({
    retireYear,
    livingCostManwon,
    pensionManwon,
    inflationRate,
  });

  const summary = useMemo(
    () =>
      calculatePortfolioSummary({
        holdings,
        accounts: ACCOUNTS,
      }),
    [holdings]
  );
  
  const currentAsset = Math.round(summary.total / 10000);

  const retirementProgress =
    neededRetirementAsset > 0
      ? Math.min(100, Math.round((currentAsset / neededRetirementAsset) * 100))
      : 0;

  const shortageAsset = Math.max(
    0,
    neededRetirementAsset - currentAsset
  );

  const monthlySavingNeed =
    yearsLeft > 0
      ? Math.round(shortageAsset / (yearsLeft * 12))
      : 0;

  const monthlyRate = expectedReturn / 100 / 12;

  const futureAsset =
    monthlyRate > 0
      ? currentAsset * Math.pow(1 + monthlyRate, yearsLeft * 12) +
        monthlyInvest *
          ((Math.pow(1 + monthlyRate, yearsLeft * 12) - 1) / monthlyRate)
      : currentAsset + monthlyInvest * yearsLeft * 12;

  const futureAssetManwon = Math.round(futureAsset);
  
  const yearlyDividend = Math.round(futureAssetManwon * dividendYield / 100);
  const monthlyDividend = Math.round(yearlyDividend / 12);
  const dividendCoverage = livingCostManwon > 0
    ? Math.min(100, Math.round((monthlyDividend / livingCostManwon) * 100))
    : 0;

  const dividendGap = Math.max(0, livingCostManwon - monthlyDividend);
  const asset10Year = Math.round(
    currentAsset * Math.pow(1 + monthlyRate, 10 * 12) +
    monthlyInvest * ((Math.pow(1 + monthlyRate, 10 * 12) - 1) / monthlyRate)
  );

  const asset20Year = Math.round(
    currentAsset * Math.pow(1 + monthlyRate, 20 * 12) +
    monthlyInvest * ((Math.pow(1 + monthlyRate, 20 * 12) - 1) / monthlyRate)
  );

  const asset30Year = Math.round(
    currentAsset * Math.pow(1 + monthlyRate, 30 * 12) +
    monthlyInvest * ((Math.pow(1 + monthlyRate, 30 * 12) - 1) / monthlyRate)
  );

  const growthData = [
  { year: 0, value: currentAsset },
  { year: 10, value: asset10Year },
  { year: 20, value: asset20Year },
  { year: 30, value: asset30Year }
];

  const simulationInvest = [150, 200, 250, 300, 350, 400];

  const simulationResult = simulationInvest.map((invest) => {
    let asset = currentAsset;
    let year = currentYear;

    while (year < retireYear + 50) {
      asset =
        asset * (1 + expectedReturn / 100) +
        invest * 12;

      if (asset >= neededRetirementAsset) break;

      year++;
    }

    return {
      invest,
      year,
    };
  });

  const estimatedRetireYear =
    futureAssetManwon >= neededRetirementAsset
      ? retireYear
      : monthlyInvest > 0
      ? retireYear +
        Math.ceil((neededRetirementAsset - futureAssetManwon) / (monthlyInvest * 12))
      : 9999;

  const fireAsset80 = Math.round(
    futureAssetManwon *
    Math.pow(
      1 + (expectedReturn - inflationRate) / 100,
      Math.max(0, 80 - retireAge)
    )
  );

  const fireAsset90 = Math.round(
    futureAssetManwon *
    Math.pow(
      1 + (expectedReturn - inflationRate) / 100,
      Math.max(0, 90 - retireAge)
    )
  );

  const fireAsset100 = Math.round(
    futureAssetManwon *
    Math.pow(
      1 + (expectedReturn - inflationRate) / 100,
      Math.max(0, 100 - retireAge)
    )
  ); 

  const yearDiff = estimatedRetireYear - retireYear;

  const currentWeight = {
  미국: summary.total ? (summary.byRegion.미국 || 0) / summary.total * 100 : 0,
  한국: summary.total ? (summary.byRegion.한국 || 0) / summary.total * 100 : 0,
  채권: summary.total ? summary.bond / summary.total * 100 : 0
};

const rebalance = {
  미국: target.미국 - currentWeight.미국,
  한국: target.한국 - currentWeight.한국,
  채권: target.채권 - currentWeight.채권
};
const targetAmount = {
  미국: Math.round(summary.total * target.미국 / 100),
  한국: Math.round(summary.total * target.한국 / 100),
  채권: Math.round(summary.total * target.채권 / 100)
};

const currentAmount = {
  미국: summary.byRegion.미국 || 0,
  한국: summary.byRegion.한국 || 0,
  채권: summary.bond
};

const needAmount = {
  미국: targetAmount.미국 - currentAmount.미국,
  한국: targetAmount.한국 - currentAmount.한국,
  채권: targetAmount.채권 - currentAmount.채권
};
  const briefing =
  summary.total === 0
    ? '아직 입력된 ETF가 없습니다. 먼저 ETF를 추가해 주세요.'
    : needAmount.미국 > 0
      ? `미국 ETF를 약 ${won(needAmount.미국)} 추가 매수하면 목표 비중에 가까워집니다.`
      : needAmount.채권 > 0
        ? `채권 ETF를 약 ${won(needAmount.채권)} 추가하면 포트폴리오가 더 안정됩니다.`
        : '현재 목표 자산배분과 거의 일치합니다.';

  const aiAdvice = [];

if (needAmount.미국 > 0)
  aiAdvice.push(`🇺🇸 미국 ETF ${won(needAmount.미국)} 매수 추천`);

if (needAmount.채권 > 0)
  aiAdvice.push(`💵 채권 ETF ${won(needAmount.채권)} 매수 추천`);

if (needAmount.한국 < 0)
  aiAdvice.push(`🇰🇷 한국 비중이 높습니다. 신규 매수는 잠시 보류하세요.`); 
const recommendedEtfGroups = [];

if (needAmount.미국 > 0) {
  if (investStyle === "growth") {
    recommendedEtfGroups.push({
      title: "🚀 성장형 미국 ETF",
      items: ["TIGER 미국나스닥100", "KODEX 미국나스닥100"],
      desc: "성장형은 AI·빅테크·나스닥 비중을 높이는 전략입니다."
    });
  } else if (investStyle === "dividend") {
    recommendedEtfGroups.push({
      title: "💰 배당형 미국 ETF",
      items: ["TIGER 미국배당다우존스", "SOL 미국배당다우존스"],
      desc: "배당형은 현금흐름과 배당 성장에 초점을 둡니다."
    });
  } else if (investStyle === "safe") {
    recommendedEtfGroups.push({
      title: "🛡 안정형 미국 ETF",
      items: ["KODEX 미국S&P500", "TIGER 미국S&P500"],
      desc: "안정형은 대표지수 중심으로 변동성을 낮추는 전략입니다."
    });
  } else {
    recommendedEtfGroups.push({
      title: "🇺🇸 균형형 미국 ETF",
      items: ["KODEX 미국S&P500", "TIGER 미국S&P500", "TIGER 미국나스닥100"],
      desc: "균형형은 대표지수와 성장형 ETF를 함께 활용합니다."
    });
  }
}

if (needAmount.채권 > 0 || investStyle === "safe") {
  recommendedEtfGroups.push({
    title: "💵 채권형",
    items: ["KOSEF 국고채10년", "KODEX 미국채"],
    desc: "채권형은 포트폴리오 변동성을 낮추고 안정성을 보완합니다."
  });
}
  const addHolding = () => {
    const amount = Number(amountManwon) * 10000;
    if (!amount || amount <= 0) return alert('평가금액을 만원 단위로 입력해 주세요. 예: 2500');
    const meta = ETF_DB.find(e => e.name === etfName);
    setHoldings([
      ...holdings,
      {
  id: Date.now(),
  account,
  amount,
  avgPrice: Number(avgPrice || 0),
  currentPrice: Number(currentPrice || 0),
  ...meta
}
    ]);
    setAmountManwon('');
    setAvgPrice('');
    setCurrentPrice('');
    setEtfName(ETF_DB[0].name);
    setAccount('개인연금');
    setTab('home');
    
  };

  const removeHolding = (id) => setHoldings(holdings.filter(h => h.id !== id));

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <h1>ETF비서</h1>
          <p>오늘도 계획대로 투자하세요.</p>
        </div>
      </header>

      <main className="content">
        {tab === 'home' && (
          <section>
            


            <TotalAssetCard
              summary={summary}
              won={won}
            />
            
            <InvestStyleCard
              investStyle={investStyle}
              setInvestStyle={setInvestStyle}
            />
            
            <AiBriefingCard
              briefing={briefing}
              aiAdvice={aiAdvice}
            />
                    
            


            <RecommendedEtfCard
              recommendedEtfGroups={recommendedEtfGroups}
            />
                       
            <RetirementGoalCard
              retireAge={retireAge}
              setRetireAge={setRetireAge}
              retireYear={retireYear}
              setRetireYear={setRetireYear}
              pensionManwon={pensionManwon}
              setPensionManwon={setPensionManwon}
              livingCostManwon={livingCostManwon}
              setLivingCostManwon={setLivingCostManwon}
            /> 

            <RetirementCard
              yearsLeft={yearsLeft}
              monthlyGap={monthlyGap}
              neededRetirementAsset={neededRetirementAsset}
              currentAsset={currentAsset}
              shortageAsset={shortageAsset}
              monthlySavingNeed={monthlySavingNeed}
              retirementProgress={retirementProgress}
              monthlyInvest={monthlyInvest}
              setMonthlyInvest={setMonthlyInvest}
              expectedReturn={expectedReturn}
              setExpectedReturn={setExpectedReturn}
              dividendYield={dividendYield}
              setDividendYield={setDividendYield}
              inflationRate={inflationRate}
              setInflationRate={setInflationRate}
              futureAssetManwon={futureAssetManwon}
              estimatedRetireYear={estimatedRetireYear}
              yearlyDividend={yearlyDividend}
              monthlyDividend={monthlyDividend}
              dividendCoverage={dividendCoverage}
              dividendGap={dividendGap}
              asset10Year={asset10Year}
              asset20Year={asset20Year}
              asset30Year={asset30Year}
              growthData={growthData}
              yearDiff={yearDiff}
            />
                        
            <SimulationCard
              simulationResult={simulationResult}
              futureAssetManwon={futureAssetManwon}
              neededRetirementAsset={neededRetirementAsset}
              retirementProgress={retirementProgress}
            />   

            <FireCard
              fireAsset80={fireAsset80}
              fireAsset90={fireAsset90}
              fireAsset100={fireAsset100}
            />
            
            <AccountCard
              ACCOUNTS={ACCOUNTS}
              summary={summary}
              won={won}
            />
          </section>
        )}

        {tab === 'accounts' && (
          <section>
            <HoldingsListCard
              holdings={holdings}
              summary={summary}
              won={won}
              pct={pct}
              removeHolding={removeHolding}
            />
            
          </section>
        )}

        {tab === 'add' && (
          <section>
            <AddHoldingCard
              ACCOUNTS={ACCOUNTS}
              account={account}
              setAccount={setAccount}
              search={search}
              setSearch={setSearch}
              filteredEtfs={filteredEtfs}
              etfName={etfName}
              setEtfName={setEtfName}
              avgPrice={avgPrice}
              setAvgPrice={setAvgPrice}
              currentPrice={currentPrice}
              setCurrentPrice={setCurrentPrice}
              amountManwon={amountManwon}
              setAmountManwon={setAmountManwon}
              addHolding={addHolding}
            />
            
          </section>
        )}

        {tab === 'analysis' && (
          <section>
            <AssetAnalysisCard
              target={target}
              setTarget={setTarget}
              currentWeight={currentWeight}
              rebalance={rebalance}
              needAmount={needAmount}
              won={won}
              summary={summary}
              pct={pct}
            />                  
            
          </section>
        )}

        {tab === 'settings' && (
          <section>
            <SettingsCard setHoldings={setHoldings} />
            
          </section>
        )}
      </main>

      <BottomNav tab={tab} setTab={setTab} /> 
          
      
    </div>
  );
}



createRoot(document.getElementById('root')).render(<App />);
