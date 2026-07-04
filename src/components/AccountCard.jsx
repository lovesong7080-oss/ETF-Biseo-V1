export default function AccountCard({
  ACCOUNTS,
  summary,
  won,
}) {
  return (
    <div className="card">
      <h2>🏢 내 계좌</h2>

      {ACCOUNTS.map((a) => (
        <div className="row" key={a}>
          <span>{a}</span>
          <b>{won(summary.byAccount[a])}</b>
        </div>
      ))}
    </div>
  );
}