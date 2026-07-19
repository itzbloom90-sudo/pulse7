import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { monthLabel } from '../utils/date';

export default function MonthSwitcher() {
  const { viewYear, viewMonthIdx, isCurrentMonth, setViewMonth } = useApp();

  const goPrev = () => {
    let y = viewYear, m = viewMonthIdx - 1;
    if (m < 0) { m = 11; y -= 1; }
    setViewMonth(y, m);
  };
  const goNext = () => {
    if (isCurrentMonth) return; // cannot go beyond the current real month
    let y = viewYear, m = viewMonthIdx + 1;
    if (m > 11) { m = 0; y += 1; }
    setViewMonth(y, m);
  };

  return (
    <div className="flex items-center justify-between px-1 py-1">
      <button onClick={goPrev} className="w-8 h-8 rounded-full flex items-center justify-center card" aria-label="Previous month">
        <ChevronLeft size={18} />
      </button>
      <div className="flex flex-col items-center">
        <span className="text-sm font-semibold">{monthLabel(viewYear, viewMonthIdx)}</span>
        {!isCurrentMonth && <span className="text-[11px]" style={{ color: 'var(--color-muted)' }}>Viewing past month</span>}
      </div>
      <button
        onClick={goNext}
        disabled={isCurrentMonth}
        className="w-8 h-8 rounded-full flex items-center justify-center card disabled:opacity-30"
        aria-label="Next month"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
