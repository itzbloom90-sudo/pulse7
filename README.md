# pulse7

A clean, fast expense tracker built with React, Vite, Tailwind CSS v4, and Recharts.

## Features

- **Home** — balance overview, quick add for income/expense, recent activity, spending-by-category donut.
- **Transactions** — full searchable, filterable list grouped by day, with a one-tap remove (X) on every entry.
- **Reports** — spending trend, expense/income donuts, top categories, monthly comparison, and auto-generated insights. Month switcher auto-detects the current month and lets you browse past months (you can't jump into the future).
- **More**
  - Account: edit name, currency, language, theme (dark/light)
  - Reports: weekly / monthly / yearly summaries
  - Security: optional 4-digit PIN lock on launch, adjustable time zone (every IANA time zone)
  - Reset all data
- All amounts support 150+ world currencies.
- Every transaction is timestamped automatically using your selected time zone. There's no manual date entry, and new transactions always post to the real current month.
- Everything persists locally (currency, transactions, theme, PIN, etc. survive closing and reopening the app).

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (defaults to http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Tech stack

- React 19 + Vite
- Tailwind CSS v4
- Recharts for charts
- lucide-react for icons
- Browser localStorage for persistence (no backend required)

## Project structure

```
src/
  components/   Reusable UI (bottom nav, month switcher, add-transaction sheet, PIN screen)
  context/      Global app state (transactions, settings) with localStorage sync
  data/         Currency list, time zone helpers, category definitions
  pages/        Home, Transactions, Reports, More
  utils/        Date/time-zone helpers and data selectors
```
