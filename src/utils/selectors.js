import { daysInMonth } from './date';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../data/categories';

export function filterByMonth(transactions, year, monthIdx, timezone) {
  return transactions.filter(t => {
    const d = new Date(t.timestamp);
    // interpret the stored timestamp (already zone-local wall clock at creation) directly
    return d.getFullYear() === year && d.getMonth() === monthIdx;
  });
}

export function computeTotals(monthTx) {
  const income = monthTx.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = monthTx.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return { income, expenses, savings: income - expenses };
}

export function computeCategoryBreakdown(monthTx, type) {
  const list = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  const filtered = monthTx.filter(t => t.type === type);
  const total = filtered.reduce((s, t) => s + t.amount, 0);
  const byCat = list.map(cat => {
    const amount = filtered.filter(t => t.category === cat.id).reduce((s, t) => s + t.amount, 0);
    return { ...cat, amount, pct: total > 0 ? Math.round((amount / total) * 100) : 0 };
  }).filter(c => c.amount > 0);
  byCat.sort((a, b) => b.amount - a.amount);
  return { total, categories: byCat };
}

export function computeDailyTrend(monthTx, year, monthIdx) {
  const days = daysInMonth(year, monthIdx);
  const perDay = Array.from({ length: days }, (_, i) => ({ day: i + 1, expense: 0, income: 0 }));
  monthTx.forEach(t => {
    const d = new Date(t.timestamp).getDate();
    const bucket = perDay[d - 1];
    if (!bucket) return;
    if (t.type === 'expense') bucket.expense += t.amount;
    else bucket.income += t.amount;
  });
  return perDay;
}

export function computeMonthlyComparison(transactions, year, monthIdx, count = 4) {
  const out = [];
  for (let i = count - 1; i >= 0; i--) {
    let y = year, m = monthIdx - i;
    while (m < 0) { m += 12; y -= 1; }
    const tx = filterByMonth(transactions, y, m);
    const totals = computeTotals(tx);
    out.push({
      label: new Date(y, m, 1).toLocaleDateString(undefined, { month: 'short' }),
      income: totals.income,
      expenses: totals.expenses,
      savings: totals.savings,
    });
  }
  return out;
}
