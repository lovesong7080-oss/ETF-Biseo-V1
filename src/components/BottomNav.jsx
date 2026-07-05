import { BarChart3, Home, Plus, Settings, Wallet } from "lucide-react";

export default function BottomNav({ tab, setTab }) {
  return (
    <nav className="bottom-nav">
      <button
        className={tab === "home" ? "active" : ""}
        onClick={() => setTab("home")}
      >
        <Home size={20} />
        홈
      </button>

      <button
        className={tab === "accounts" ? "active" : ""}
        onClick={() => setTab("accounts")}
      >
        <Wallet size={20} />
        계좌
      </button>

      <button className="add-btn" onClick={() => setTab("add")}>
        <Plus size={24} />
      </button>

      <button
        className={tab === "analysis" ? "active" : ""}
        onClick={() => setTab("analysis")}
      >
        <BarChart3 size={20} />
        분석
      </button>

      <button
        className={tab === "settings" ? "active" : ""}
        onClick={() => setTab("settings")}
      >
        <Settings size={20} />
        설정
      </button>
    </nav>
  );
}