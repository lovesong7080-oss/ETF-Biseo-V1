import { useState } from "react";

export default function CollapsibleCard({
  title,
  children,
  defaultOpen = true,
}) {
  const storageKey = `etf-biseo-collapsible-${title}`;

  const [isOpen, setIsOpen] = useState(() => {
    const savedValue = localStorage.getItem(storageKey);

    if (savedValue === "open") return true;
    if (savedValue === "closed") return false;

    return defaultOpen;
  });

  const toggleOpen = () => {
    const nextIsOpen = !isOpen;

    setIsOpen(nextIsOpen);
    localStorage.setItem(storageKey, nextIsOpen ? "open" : "closed");
  };

  return (
    <div className="card collapsible-card">
      <button
        type="button"
        className="collapsible-header"
        onClick={toggleOpen}
        aria-expanded={isOpen}
      >
        <span className="collapsible-title">{title}</span>
        <span className="collapsible-action">
          {isOpen ? "접기 ▲" : "펼치기 ▼"}
        </span>
      </button>

      {isOpen && (
        <div className="collapsible-content">
          {children}
        </div>
      )}
    </div>
  );
}