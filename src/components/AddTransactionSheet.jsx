import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/categories';
import { getCurrency } from '../data/currencies';
import { formatTimestamp } from '../utils/date';

export default function AddTransactionSheet({ onClose, defaultType = 'expense' }) {
  const { addTransaction, settings, now } = useApp();
  const [type, setType] = useState(defaultType);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState(type === 'income' ? 'salary' : 'food');

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const currency = getCurrency(settings.currency);

  const switchType = (t) => {
    setType(t);
    setCategory(t === 'income' ? 'salary' : 'food');
  };

  const submit = () => {
    const value = parseFloat(amount);
    if (!value || value <= 0) return;
    addTransaction({
      type,
      amount: value,
      category,
      note: note.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 fade-in" onClick={onClose} />
      <div className="relative w-full max-w-[480px] card sheet-enter rounded-t-3xl rounded-b-none p-5 pb-8"
        style={{ borderBottom: 'none' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Add {type === 'income' ? 'Income' : 'Expense'}</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: 'var(--color-surface-2)' }} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="flex rounded-xl p-1 mb-4" style={{ background: 'var(--color-surface-2)' }}>
          <button
            onClick={() => switchType('expense')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors`}
            style={type === 'expense' ? { background: 'rgba(240,57,107,0.15)', color: '#F0396B', border: '1px solid #F0396B' } : { color: 'var(--color-muted)' }}
          >
            Expense
          </button>
          <button
            onClick={() => switchType('income')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors`}
            style={type === 'income' ? { background: 'rgba(34,197,94,0.15)', color: '#22C55E', border: '1px solid #22C55E' } : { color: 'var(--color-muted)' }}
          >
            Income
          </button>
        </div>

        <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-muted)' }}>Amount</label>
        <div className="card flex items-center gap-2 px-4 py-3.5 mb-4" style={{ background: 'var(--color-surface-2)' }}>
          <span className="text-lg font-semibold" style={{ color: 'var(--color-muted)' }}>{currency.symbol}</span>
          <input
            type="number"
            inputMode="decimal"
            placeholder="0.00"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="bg-transparent text-2xl font-bold w-full"
            autoFocus
          />
        </div>

        <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-muted)' }}>What was it for? (optional)</label>
        <input
          type="text"
          placeholder="e.g. Grocery run"
          value={note}
          onChange={e => setNote(e.target.value)}
          className="card w-full px-4 py-3 mb-4 text-sm"
          style={{ background: 'var(--color-surface-2)' }}
        />

        <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-muted)' }}>Category</label>
        <div className="flex flex-wrap gap-2 mb-5">
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className="px-3.5 py-2 rounded-full text-sm font-medium transition-colors"
              style={category === c.id
                ? { background: c.color, color: '#0A0D14' }
                : { background: 'var(--color-surface-2)', color: 'var(--color-text)' }}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="text-xs mb-4" style={{ color: 'var(--color-muted)' }}>
          Recorded automatically at {formatTimestamp(now.getTime(), settings.timezone)}
        </div>

        <button
          onClick={submit}
          disabled={!amount || parseFloat(amount) <= 0}
          className="pill-gradient w-full py-3.5 rounded-xl font-semibold text-white disabled:opacity-40"
        >
          Add {type === 'income' ? 'Income' : 'Expense'}
        </button>
      </div>
    </div>
  );
}
