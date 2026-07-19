import React from 'react';
import { Home, List, Plus, PieChart, MoreHorizontal } from 'lucide-react';

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'transactions', label: 'Transactions', icon: List },
  { id: 'add', label: '', icon: Plus },
  { id: 'reports', label: 'Reports', icon: PieChart },
  { id: 'more', label: 'More', icon: MoreHorizontal },
];

export default function BottomNav({ active, onChange, onAdd }) {
  return (
    <nav className="sticky bottom-0 left-0 right-0 border-t backdrop-blur-md z-30"
      style={{ background: 'color-mix(in srgb, var(--color-bg) 92%, transparent)', borderColor: 'var(--color-border)' }}>
      <div className="flex items-center justify-between px-3 py-2">
        {TABS.map(tab => {
          const Icon = tab.icon;
          if (tab.id === 'add') {
            return (
              <button
                key={tab.id}
                onClick={onAdd}
                aria-label="Add transaction"
                className="pill-gradient w-14 h-14 rounded-full flex items-center justify-center -mt-6 shadow-lg shadow-pink-500/20 active:scale-95 transition-transform"
              >
                <Icon size={26} color="white" strokeWidth={2.5} />
              </button>
            );
          }
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="flex flex-col items-center gap-1 px-3 py-1.5 flex-1"
            >
              <Icon size={22} strokeWidth={2} color={isActive ? '#F0396B' : 'var(--color-muted)'} />
              <span className="text-[11px] font-medium" style={{ color: isActive ? '#F0396B' : 'var(--color-muted)' }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
