import React, { useState } from 'react';
import { Delete } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PinLockScreen() {
  const { settings, unlock } = useApp();
  const [entry, setEntry] = useState('');
  const [error, setError] = useState(false);

  const press = (digit) => {
    if (entry.length >= 4) return;
    const next = entry + digit;
    setEntry(next);
    setError(false);
    if (next.length === 4) {
      if (next === settings.pin) {
        setTimeout(unlock, 120);
      } else {
        setTimeout(() => { setError(true); setEntry(''); }, 250);
      }
    }
  };
  const backspace = () => setEntry(entry.slice(0, -1));

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-8"
      style={{ background: 'var(--color-bg)' }}>
      <div className="text-gradient text-2xl font-bold mb-1">Pulse</div>
      <p className="text-sm mb-8" style={{ color: 'var(--color-muted)' }}>Enter your PIN to continue</p>

      <div className="flex gap-4 mb-10">
        {[0, 1, 2, 3].map(i => (
          <div key={i}
            className="w-4 h-4 rounded-full transition-colors"
            style={{
              background: entry.length > i ? (error ? '#F0396B' : 'var(--color-text)') : 'transparent',
              border: `2px solid ${error ? '#F0396B' : 'var(--color-border)'}`,
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5">
        {['1','2','3','4','5','6','7','8','9'].map(d => (
          <button key={d} onClick={() => press(d)}
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold card active:scale-95 transition-transform">
            {d}
          </button>
        ))}
        <div />
        <button onClick={() => press('0')}
          className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold card active:scale-95 transition-transform">
          0
        </button>
        <button onClick={backspace}
          className="w-16 h-16 rounded-full flex items-center justify-center card active:scale-95 transition-transform">
          <Delete size={20} />
        </button>
      </div>
    </div>
  );
}
