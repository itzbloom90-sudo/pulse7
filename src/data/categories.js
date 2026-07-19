export const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Food', color: '#EC4370', icon: 'UtensilsCrossed' },
  { id: 'transport', label: 'Transport', color: '#3B82F6', icon: 'Car' },
  { id: 'shopping', label: 'Shopping', color: '#F5A623', icon: 'ShoppingBag' },
  { id: 'entertainment', label: 'Entertainment', color: '#A855F7', icon: 'Drama' },
  { id: 'bills', label: 'Bills', color: '#22C55E', icon: 'Receipt' },
  { id: 'health', label: 'Health', color: '#14B8A6', icon: 'HeartPulse' },
  { id: 'education', label: 'Education', color: '#6366F1', icon: 'GraduationCap' },
  { id: 'other', label: 'Other', color: '#94A3B8', icon: 'MoreHorizontal' },
];

export const INCOME_CATEGORIES = [
  { id: 'salary', label: 'Salary', color: '#22C55E', icon: 'Wallet' },
  { id: 'allowance', label: 'Allowance', color: '#3B82F6', icon: 'HandCoins' },
  { id: 'freelance', label: 'Freelance', color: '#F5A623', icon: 'Laptop' },
  { id: 'gift', label: 'Gift', color: '#EC4370', icon: 'Gift' },
  { id: 'other', label: 'Other', color: '#94A3B8', icon: 'MoreHorizontal' },
];

export function getCategoryMeta(type, id) {
  const list = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  return list.find(c => c.id === id) || list[list.length - 1];
}
