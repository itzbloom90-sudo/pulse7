import React, { useMemo, useState } from 'react';
import { ArrowUpRight, ArrowDownRight, X, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MonthSwitcher from '../components/MonthSwitcher';
import { formatMoney } from '../data/currencies';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/categories';
import { filterByMonth, computeTotals } from '../utils/selectors';
import { formatTimeOnly, relativeDay } from '../utils/date';

const FILTERS = ['all', 'income', 'expense'];

export default function Transactions() {
  const { transactions, settings, viewYear, viewMonthIdx, deleteTransaction } = useApp();
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');

  const monthTx = useMemo(() => filterByMonth(transactions, viewYear, viewMonthIdx), [transactions, viewYear, viewMonthIdx]);
  const totals = computeTotals(monthTx);

  const filtered = monthTx
    .filter(t => filter === 'all' || t.type === filter)
    .filter(t => {
      if (!query.trim()) return true;
      const meta = (t.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).find(c => c.id === t.category);
      const hay = `${t.note} ${meta?.label || ''}`.toLowerCase();
      return hay.includes(query.trim().toLowerCase());
    })
    .sort((a, b) => b.timestamp - a.timestamp);

  // group by day label
  const groups = [];
  filtered.forEach(t => {
    const label = relativeDay(t.timestamp, settings.timezone);
    let g = groups.find(g => g.label === label);
    if (!g) { g = { label, items: [] }; groups.push(g); }
    g.items.push(t);
  });

  return (
    <div className="px-4 pt-5 pb-4">
      <h1 className="text-xl font-bold mb-3">Transactions</h1>
      <MonthSwitcher />

      <div className="grid grid-cols-2 gap-3 my-4">
        <div className="card p-3.5">
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Income</p>
          <p className="text-lg font-bold" style={{ color: '#22C55E' }}>{formatMoney(totals.income, settings.currency)}</p>
        </div>
        <div className="card p-3.5">
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Expenses</p>
          <p className="text-lg font-bold" style={{ color: '#F0396B' }}>{formatMoney(totals.expenses, settings.currency)}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 mb-3" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
        <Search size={16} style={{ color: 'var(--color-muted)' }} />
        <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search transactions"
          className="bg-transparent text-sm flex-1" />
      </div>

      <div className="flex gap-2 mb-4">
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-sm font-medium capitalize"
            style={filter === f ? { background: '#F0396B', color: 'white' } : { background: 'var(--color-surface-2)', color: 'var(--color-muted)' }}>
            {f}
          </button>
        ))}
      </div>

      {groups.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-sm" style={{ color: 'var(--color-muted)' }}>No transactions to show. Add one from the + button.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {groups.map(g => (
            <div key={g.label}>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-muted)' }}>{g.label}</p>
              <div className="card divide-y" style={{ borderColor: 'var(--color-border)' }}>
                {g.items.map(tx => {
                  const meta = (tx.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).find(c => c.id === tx.category);
                  return (
                    <div key={tx.id} className="flex items-center justify-between px-4 py-3.5" style={{ borderColor: 'var(--color-border)' }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${meta.color}22` }}>
                          {tx.type === 'income' ? <ArrowUpRight size={17} color={meta.color} /> : <ArrowDownRight size={17} color={meta.color} />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{tx.note || meta.label}</p>
                          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{meta.label} · {formatTimeOnly(tx.timestamp, settings.timezone)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-semibold" style={{ color: tx.type === 'income' ? '#22C55E' : '#F0396B' }}>
                          {tx.type === 'income' ? '+' : '-'}{formatMoney(tx.amount, settings.currency)}
                        </span>
                        <button onClick={() => deleteTransaction(tx.id)} aria-label="Delete transaction"
                          className="w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ background: 'var(--color-surface-2)' }}>
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
