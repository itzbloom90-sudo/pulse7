import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, CartesianGrid } from 'recharts';
import { ArrowDown, ArrowUp, Wallet, CreditCard, TrendingUp, TrendingDown, Star, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MonthSwitcher from '../components/MonthSwitcher';
import { formatMoney } from '../data/currencies';
import { filterByMonth, computeTotals, computeCategoryBreakdown, computeDailyTrend, computeMonthlyComparison } from '../utils/selectors';

export default function Reports() {
  const { transactions, settings, viewYear, viewMonthIdx } = useApp();

  const monthTx = useMemo(() => filterByMonth(transactions, viewYear, viewMonthIdx), [transactions, viewYear, viewMonthIdx]);
  const prevMonthTx = useMemo(() => {
    let y = viewYear, m = viewMonthIdx - 1;
    if (m < 0) { m = 11; y -= 1; }
    return filterByMonth(transactions, y, m);
  }, [transactions, viewYear, viewMonthIdx]);

  const totals = computeTotals(monthTx);
  const prevTotals = computeTotals(prevMonthTx);
  const pctChange = (curr, prev) => prev > 0 ? Math.round(((curr - prev) / prev) * 100) : (curr > 0 ? 100 : 0);

  const expenseBreakdown = computeCategoryBreakdown(monthTx, 'expense');
  const incomeBreakdown = computeCategoryBreakdown(monthTx, 'income');
  const daily = computeDailyTrend(monthTx, viewYear, viewMonthIdx);
  const comparison = computeMonthlyComparison(transactions, viewYear, viewMonthIdx, 4);

  const topCategoryLabel = expenseBreakdown.categories[0]?.label;

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-xl font-bold">Reports</h1>
          <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Track your income, expenses & savings</p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium card">
          <Download size={15} /> Export
        </button>
      </div>

      <div className="mt-4"><MonthSwitcher /></div>

      <div className="grid grid-cols-2 gap-3 my-4">
        <SummaryCard icon={ArrowDown} color="#22C55E" label="Total Income" value={formatMoney(totals.income, settings.currency)}
          change={pctChange(totals.income, prevTotals.income)} />
        <SummaryCard icon={ArrowUp} color="#F0396B" label="Total Expenses" value={formatMoney(totals.expenses, settings.currency)}
          change={pctChange(totals.expenses, prevTotals.expenses)} />
        <SummaryCard icon={Wallet} color="#3B82F6" label="Net Savings" value={formatMoney(totals.savings, settings.currency)}
          change={pctChange(totals.savings, prevTotals.savings)} />
        <SummaryCard icon={CreditCard} color="#A855F7" label="Remaining Balance" value={formatMoney(totals.income - totals.expenses, settings.currency)}
          sub="As of today" />
      </div>

      {/* Spending trend */}
      <div className="card p-4 mb-4">
        <p className="text-sm font-semibold mb-3">Spending Trend</p>
        {daily.every(d => d.expense === 0) ? (
          <EmptyChart text="No spending recorded yet this month" />
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={daily} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F0396B" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#F0396B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} interval={4} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip
                contentStyle={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 10, fontSize: 12 }}
                formatter={(v) => formatMoney(v, settings.currency)}
                labelFormatter={(l) => `Day ${l}`}
              />
              <Area type="monotone" dataKey="expense" stroke="#F0396B" strokeWidth={2.5} fill="url(#trendFill)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Donut charts */}
      <div className="grid grid-cols-1 gap-4 mb-4">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Expenses by Category</p>
          </div>
          <DonutWithLegend data={expenseBreakdown} currency={settings.currency} centerLabel="Total" />
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Income Sources</p>
          </div>
          <DonutWithLegend data={incomeBreakdown} currency={settings.currency} centerLabel="Total" />
        </div>
      </div>

      {/* Top spending categories */}
      <div className="card p-4 mb-4">
        <p className="text-sm font-semibold mb-3">Top Spending Categories</p>
        {expenseBreakdown.categories.length === 0 ? (
          <EmptyChart text="No expenses recorded yet" />
        ) : (
          <div className="flex flex-col gap-3">
            {expenseBreakdown.categories.slice(0, 4).map(c => (
              <div key={c.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${c.color}22` }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />
                  </div>
                  <span className="text-sm font-medium">{c.label}</span>
                </div>
                <span className="text-sm font-semibold" style={{ color: c.color }}>{formatMoney(c.amount, settings.currency)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monthly comparison */}
      <div className="card p-4 mb-4">
        <p className="text-sm font-semibold mb-3">Monthly Comparison</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={comparison} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} width={40} />
            <Tooltip contentStyle={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', borderRadius: 10, fontSize: 12 }}
              formatter={(v) => formatMoney(v, settings.currency)} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="income" name="Income" fill="#22C55E" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Expenses" fill="#F0396B" radius={[4, 4, 0, 0]} />
            <Bar dataKey="savings" name="Savings" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="card p-4">
        <p className="text-sm font-semibold mb-3">Insights</p>
        <div className="grid grid-cols-2 gap-3">
          <InsightCard icon={TrendingUp} color="#F0396B"
            text={topCategoryLabel ? `${topCategoryLabel} is your top spending category` : 'Add expenses to see insights'} />
          <InsightCard icon={TrendingDown} color="#22C55E"
            text={totals.savings >= 0 ? `You saved ${formatMoney(totals.savings, settings.currency)} this month` : `You overspent by ${formatMoney(Math.abs(totals.savings), settings.currency)}`} />
          <InsightCard icon={ArrowDown} color="#3B82F6"
            text={`${monthTx.length} transactions logged this month`} />
          <InsightCard icon={Star} color="#A855F7"
            text={totals.income > 0 ? `You saved ${Math.max(0, Math.round((totals.savings / totals.income) * 100))}% of your income` : 'Add income to track savings rate'} />
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ icon: Icon, color, label, value, change, sub }) {
  return (
    <div className="card p-3.5">
      <div className="w-8 h-8 rounded-full flex items-center justify-center mb-2" style={{ background: `${color}22` }}>
        <Icon size={15} color={color} />
      </div>
      <p className="text-xs" style={{ color: 'var(--color-muted)' }}>{label}</p>
      <p className="text-base font-bold leading-tight mt-0.5">{value}</p>
      {sub ? (
        <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-muted)' }}>{sub}</p>
      ) : (
        <p className="text-[11px] mt-0.5" style={{ color: change >= 0 ? '#22C55E' : '#F0396B' }}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs last month
        </p>
      )}
    </div>
  );
}

function DonutWithLegend({ data, currency, centerLabel }) {
  if (!data.categories.length) return <EmptyChart text="Nothing to show yet" />;
  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <PieChart width={130} height={130}>
          <Pie data={data.categories} dataKey="amount" nameKey="label" innerRadius={40} outerRadius={62} paddingAngle={2} stroke="none">
            {data.categories.map((c, i) => <Cell key={i} fill={c.color} />)}
          </Pie>
        </PieChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[10px]" style={{ color: 'var(--color-muted)' }}>{centerLabel}</span>
          <span className="text-sm font-bold">{formatMoney(data.total, currency)}</span>
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-2">
        {data.categories.map(c => (
          <div key={c.id} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
              {c.label}
            </span>
            <span className="font-medium ml-2 shrink-0">{c.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function InsightCard({ icon: Icon, color, text }) {
  return (
    <div className="rounded-xl p-3" style={{ background: 'var(--color-surface-2)' }}>
      <div className="w-7 h-7 rounded-full flex items-center justify-center mb-2" style={{ background: `${color}22` }}>
        <Icon size={14} color={color} />
      </div>
      <p className="text-xs leading-snug">{text}</p>
    </div>
  );
}

function EmptyChart({ text }) {
  return (
    <div className="py-10 flex items-center justify-center">
      <p className="text-sm text-center" style={{ color: 'var(--color-muted)' }}>{text}</p>
    </div>
  );
}
