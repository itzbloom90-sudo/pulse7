import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { ArrowDownRight, ArrowUpRight, Repeat, Camera, ChevronDown, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatMoney, getCurrency } from '../data/currencies';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/categories';
import { filterByMonth, computeTotals, computeCategoryBreakdown } from '../utils/selectors';
import { relativeDay, formatTimeOnly } from '../utils/date';

export default function Home({ onOpenAdd }) {
  const { transactions, settings, viewYear, viewMonthIdx, currentMonthKey, deleteTransaction, addTransaction, now } = useApp();
  const [quickType, setQuickType] = useState('expense');
  const [quickAmount, setQuickAmount] = useState('');
  const [quickNote, setQuickNote] = useState('');
  const [quickCat, setQuickCat] = useState('food');

  const monthTx = useMemo(() => filterByMonth(transactions, viewYear, viewMonthIdx), [transactions, viewYear, viewMonthIdx]);
  const totals = computeTotals(monthTx);
  const balance = useMemo(() => computeTotals(transactions).savings, [transactions]);
  const savedPct = totals.income > 0 ? Math.round((totals.savings / totals.income) * 100) : 0;

  const expenseBreakdown = computeCategoryBreakdown(monthTx, 'expense');
  const recent = [...monthTx].sort((a, b) => b.timestamp - a.timestamp).slice(0, 3);

  const categories = quickType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const currency = getCurrency(settings.currency);

  const quickSubmit = () => {
    const value = parseFloat(quickAmount);
    if (!value || value <= 0) return;
    addTransaction({ type: quickType, amount: value, category: quickCat, note: quickNote.trim() });
    setQuickAmount('');
    setQuickNote('');
  };

  const pieData = expenseBreakdown.categories.length
    ? expenseBreakdown.categories.map(c => ({ name: c.label, value: c.amount, color: c.color }))
    : [{ name: 'None', value: 1, color: '#232838' }];

  return (
    <div className="px-4 pt-5 pb-4">
      {/* Balance card */}
      <div className="card p-5 mb-4" style={{ background: 'linear-gradient(160deg, var(--color-surface) 60%, rgba(240,57,107,0.06))' }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>Total Balance</p>
            <p className="text-3xl font-bold mt-1">{formatMoney(balance, settings.currency)}</p>
            <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: 'var(--color-muted)' }}>
              First month tracked
            </p>
          </div>
          <MiniRing pct={Math.max(0, Math.min(100, savedPct))} />
        </div>

        <div className="flex gap-2 mt-4">
          <button onClick={() => onOpenAdd('expense')} className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5"
            style={{ background: 'rgba(240,57,107,0.15)', color: '#F0396B' }}>
            <ArrowDownRight size={16} /> Add Expense
          </button>
          <button onClick={() => onOpenAdd('income')} className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-1.5"
            style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E' }}>
            <ArrowUpRight size={16} /> Add Income
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <Stat icon={ArrowUpRight} color="#22C55E" label="Income" value={formatMoney(totals.income, settings.currency)} sub="This month" />
          <Stat icon={ArrowDownRight} color="#F0396B" label="Expenses" value={formatMoney(totals.expenses, settings.currency)} sub="This month" />
          <Stat icon={Repeat} color="#3B82F6" label="Savings" value={formatMoney(totals.savings, settings.currency)} sub="Total saved" />
        </div>
      </div>

      {/* Quick add */}
      <div className="card p-4 mb-4">
        <p className="text-sm font-semibold mb-3">Quick Add</p>
        <div className="flex rounded-xl p-1 mb-3" style={{ background: 'var(--color-surface-2)' }}>
          <button onClick={() => { setQuickType('expense'); setQuickCat('food'); }}
            className="flex-1 py-2 rounded-lg text-sm font-semibold"
            style={quickType === 'expense' ? { background: 'rgba(240,57,107,0.15)', color: '#F0396B', border: '1px solid #F0396B' } : { color: 'var(--color-muted)' }}>
            Expense
          </button>
          <button onClick={() => { setQuickType('income'); setQuickCat('salary'); }}
            className="flex-1 py-2 rounded-lg text-sm font-semibold"
            style={quickType === 'income' ? { background: 'rgba(34,197,94,0.15)', color: '#22C55E', border: '1px solid #22C55E' } : { color: 'var(--color-muted)' }}>
            Income
          </button>
        </div>

        <div className="flex items-center gap-2 rounded-xl px-3.5 py-3 mb-3" style={{ background: 'var(--color-surface-2)' }}>
          <input
            type="text"
            placeholder="What was it for? (optional)"
            value={quickNote}
            onChange={e => setQuickNote(e.target.value)}
            className="bg-transparent text-sm flex-1"
          />
          <Camera size={18} style={{ color: 'var(--color-muted)' }} />
        </div>

        <div className="flex gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 rounded-xl px-3.5 py-3" style={{ background: 'var(--color-surface-2)' }}>
            <span className="text-sm font-semibold" style={{ color: 'var(--color-muted)' }}>{currency.symbol}</span>
            <input
              type="number" inputMode="decimal" placeholder="0.00"
              value={quickAmount} onChange={e => setQuickAmount(e.target.value)}
              className="bg-transparent text-sm font-semibold w-full"
            />
          </div>
          <div className="relative flex-1">
            <select
              value={quickCat}
              onChange={e => setQuickCat(e.target.value)}
              className="appearance-none w-full h-full rounded-xl px-3.5 py-3 text-sm font-medium"
              style={{ background: 'var(--color-surface-2)' }}
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-muted)' }} />
          </div>
        </div>

        <button
          onClick={quickSubmit}
          disabled={!quickAmount || parseFloat(quickAmount) <= 0}
          className="w-full py-3 rounded-xl font-semibold text-white disabled:opacity-40"
          style={{ background: quickType === 'expense' ? '#F0396B' : '#22C55E' }}
        >
          + Add {quickType === 'income' ? 'Income' : 'Expense'}
        </button>
      </div>

      {/* Recent activity + spending by category */}
      <div className="card p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold">Recent Activity</p>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm py-4 text-center" style={{ color: 'var(--color-muted)' }}>No transactions yet this month.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {recent.map(tx => {
              const meta = (tx.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES).find(c => c.id === tx.category);
              return (
                <div key={tx.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: `${meta.color}22` }}>
                      {tx.type === 'income' ? <ArrowUpRight size={16} color={meta.color} /> : <ArrowDownRight size={16} color={meta.color} />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{tx.note || meta.label}</p>
                      <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{relativeDay(tx.timestamp, settings.timezone)} · {formatTimeOnly(tx.timestamp, settings.timezone)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold" style={{ color: tx.type === 'income' ? '#22C55E' : '#F0396B' }}>
                      {tx.type === 'income' ? '+' : '-'}{formatMoney(tx.amount, settings.currency)}
                    </span>
                    <button onClick={() => deleteTransaction(tx.id)} aria-label="Delete transaction"
                      className="w-6 h-6 rounded-full flex items-center justify-center opacity-70 hover:opacity-100"
                      style={{ background: 'var(--color-surface-2)' }}>
                      <X size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="card p-4">
        <p className="text-sm font-semibold mb-3">Spending by Category</p>
        <div className="flex items-center gap-4">
          <PieChart width={110} height={110}>
            <Pie data={pieData} dataKey="value" innerRadius={34} outerRadius={52} paddingAngle={pieData.length > 1 ? 3 : 0} stroke="none">
              {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
            </Pie>
          </PieChart>
          <div className="flex-1 flex flex-col gap-2">
            {expenseBreakdown.categories.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--color-muted)' }}>No expenses yet</p>
            ) : expenseBreakdown.categories.slice(0, 4).map(c => (
              <div key={c.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                  {c.label}
                </span>
                <span className="font-medium">{formatMoney(c.amount, settings.currency)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniRing({ pct }) {
  const data = [{ value: pct }, { value: 100 - pct }];
  return (
    <div className="relative w-16 h-16">
      <PieChart width={64} height={64}>
        <Pie data={data} dataKey="value" innerRadius={22} outerRadius={30} startAngle={90} endAngle={-270} stroke="none">
          <Cell fill="url(#ringGrad)" />
          <Cell fill="var(--color-surface-2)" />
        </Pie>
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F0396B" />
            <stop offset="100%" stopColor="#C026D3" />
          </linearGradient>
        </defs>
      </PieChart>
      <div className="absolute inset-0 flex items-center justify-center text-[11px] font-bold">{pct}%</div>
    </div>
  );
}

function Stat({ icon: Icon, color, label, value, sub }) {
  return (
    <div>
      <div className="w-7 h-7 rounded-full flex items-center justify-center mb-1.5" style={{ background: `${color}22` }}>
        <Icon size={14} color={color} />
      </div>
      <p className="text-[11px]" style={{ color: 'var(--color-muted)' }}>{label}</p>
      <p className="text-sm font-semibold leading-tight">{value}</p>
    </div>
  );
}
