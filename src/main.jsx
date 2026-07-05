import { BarChart3, Home, Plus, Settings, Wallet } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import AccountCard from "./components/AccountCard";
import AiBriefingCard from "./components/AiBriefingCard";
import FireCard from './components/FireCard';
import HoldingsListCard from "./components/HoldingsListCard";
import InvestStyleCard from "./components/InvestStyleCard";
import RecommendedEtfCard from "./components/RecommendedEtfCard";
import RetirementCard from "./components/RetirementCard";
import RetirementGoalCard from "./components/RetirementGoalCard";
import SimulationCard from "./components/SimulationCard";
import TotalAssetCard from "./components/TotalAssetCard";
import './index.css';

const ACCOUNTS = ['개인연금', 'DC퇴직연금', '개인종합계좌', 'ISA'];

const ETF_DB = [
  { name: 'KODEX 200', region: '한국', type: '주식', theme: '시장대표' },
  { name: 'HANARO Fn K-반도체', region: '한국', type: '주식', theme: '반도체' },
  { name: 'SOL 반도체소부장', region: '한국', type: '주식', theme: '반도체' },
  { name: 'KODEX 미국채', region: '미국', type: '채권', theme: '채권' },
  { name: 'KODEX 미국나스닥100', region: '미국', type: '주식', theme: '나스닥' },
  { name: 'KODEX 미국S&P500', region: '미국', type: '주식', theme: 'S&P500' },
  { name: 'TIGER 미국S&P500', region: '미국', type: '주식', theme: 'S&P500' },
  { name: 'TIGER 미국나스닥100', region: '미국', type: '주식', theme: '나스닥' }
];

function won(n) {
  return Number(n || 0).toLocaleString('ko-KR') + '원';
}

function pct(value, total) {
  if (!total) return '0%';
  return Math.round((value / total) * 100) + '%';
}

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

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
  const currentYear = new Date().getFullYear();

  const yearsLeft = Math.max(0, retireYear - currentYear);

  const monthlyGap = Math.max(
    0,
    livingCostManwon - pensionManwon
  );
  
   const futureMonthlyGap = Math.round(
    monthlyGap * Math.pow(1 + inflationRate / 100, yearsLeft)
  );

const neededRetirementAsset = futureMonthlyGap * 12 * 25;
  
  const summary = useMemo(() => {
    const total = holdings.reduce((sum, h) => sum + h.amount, 0);
    const profit = holdings.reduce((sum, h) => sum + (h.avgPrice && h.currentPrice ? Math.round((h.currentPrice - h.avgPrice) * (h.amount / h.avgPrice)) : 0), 0);
    const byAccount = Object.fromEntries(ACCOUNTS.map(a => [a, 0]));
    const byRegion = { 한국: 0, 미국: 0 };
    let bond = 0;
    let semiconductor = 0;

    holdings.forEach(h => {
      byAccount[h.account] = (byAccount[h.account] || 0) + h.amount;
      byRegion[h.region] = (byRegion[h.region] || 0) + h.amount;
      if (h.type === '채권') bond += h.amount;
      if (h.theme === '반도체') semiconductor += h.amount;
    });

    return { total, profit, byAccount, byRegion, bond, semiconductor };
  }, [holdings]);
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
            <div className="card form-card">
              <h2>ETF 추가</h2>
              <label>계좌</label>
              <select value={account} onChange={e => setAccount(e.target.value)}>
                {ACCOUNTS.map(a => <option key={a}>{a}</option>)}
              </select>

              <label>ETF 검색</label>
<input
  value={search}
  onChange={e => setSearch(e.target.value)}
  placeholder="예: KODEX, 미국, 반도체"
  inputMode="text"
/>

<div className="etf-list">
  {filteredEtfs.map(e => (
    <button
      key={e.name}
      className={etfName === e.name ? 'etf-item selected' : 'etf-item'}
      onClick={() => setEtfName(e.name)}
    >
      <b>{e.name}</b>
      <span>{e.region} · {e.type} · {e.theme}</span>
    </button>
  ))}
</div>
              <label>평균매수가 (원)</label>
              <input
                value={avgPrice}
                onChange={e => setAvgPrice(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="예: 25000"
                inputMode="numeric"
                />
                <label>현재가 (원)</label>
                <input
                  value={currentPrice}
                  onChange={e => setCurrentPrice(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="예: 27500"
                  inputMode="numeric"
                  />
              <label>평가금액 (만원 단위)</label>
              <input value={amountManwon} onChange={e => setAmountManwon(e.target.value.replace(/[^0-9]/g, ''))} placeholder="예: 2500 = 2,500만원" inputMode="numeric" />
              <button className="primary" onClick={addHolding}>저장</button>
            </div>
          </section>
        )}

        {tab === 'analysis' && (
          <section>
            <div className="card">
              <h2>자산 비중</h2>
              <div className="card">
  <h2>🎯 목표 자산배분</h2>

  <div className="row">
    <span>미국</span>
    <input
      type="number"
      value={target.미국}
      onChange={e => setTarget({ ...target, 미국: Number(e.target.value) })}
    />
  </div>

  <div className="row">
    <span>한국</span>
    <input
      type="number"
      value={target.한국}
      onChange={e => setTarget({ ...target, 한국: Number(e.target.value) })}
    />
  </div>

  <div className="row">
    <span>채권</span>
    <input
      type="number"
      value={target.채권}
      onChange={e => setTarget({ ...target, 채권: Number(e.target.value) })}
    />
  </div>
  <div className="card">
  <h2>📊 목표 대비 차이</h2>

  {['미국', '한국', '채권'].map(asset => (
    <div className="row" key={asset}>
      <span>{asset}</span>
      <b>
        현재 {Math.round(currentWeight[asset])}% / 목표 {target[asset]}% / 차이 {Math.round(rebalance[asset])}%
      </b>
    </div>
  ))}
</div>
<div className="card">
  <h2>💰 리밸런싱 제안</h2>

  {['미국', '한국', '채권'].map(asset => (
    <div className="row" key={asset}>
      <span>{asset}</span>
      <b>
        {needAmount[asset] > 0
          ? `+${won(needAmount[asset])} 매수`
          : `-${won(Math.abs(needAmount[asset]))} 비중 초과`}
      </b>
    </div>
  ))}
</div>
</div>
              <Bar label="미국" value={summary.byRegion.미국 || 0} total={summary.total} />
              <Bar label="한국" value={summary.byRegion.한국 || 0} total={summary.total} />
              <Bar label="채권" value={summary.bond} total={summary.total} />
              <Bar label="반도체" value={summary.semiconductor} total={summary.total} />
            </div>
          </section>
        )}

        {tab === 'settings' && (
          <section>
            <div className="card">
              <h2>설정</h2>
              <p>자동 저장이 켜져 있습니다.</p>
              <button className="danger" onClick={() => confirm('모든 데이터를 삭제할까요?') && setHoldings([])}>전체 데이터 삭제</button>
            </div>
          </section>
        )}
      </main>

      <nav className="bottom-nav">
        <button className={tab==='home' ? 'active' : ''} onClick={() => setTab('home')}><Home size={20}/>홈</button>
        <button className={tab==='accounts' ? 'active' : ''} onClick={() => setTab('accounts')}><Wallet size={20}/>계좌</button>
        <button className="add-btn" onClick={() => setTab('add')}><Plus size={24}/></button>
        <button className={tab==='analysis' ? 'active' : ''} onClick={() => setTab('analysis')}><BarChart3 size={20}/>분석</button>
        <button className={tab==='settings' ? 'active' : ''} onClick={() => setTab('settings')}><Settings size={20}/>설정</button>
      </nav>
    </div>
  );
}

function Bar({ label, value, total }) {
  const width = total ? Math.round((value / total) * 100) : 0;
  return (
    <div className="bar-wrap">
      <div className="bar-top"><span>{label}</span><b>{pct(value, total)}</b></div>
      <div className="bar-bg"><div className="bar-fill" style={{ width: `${width}%` }} /></div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
