import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';
import AddTransactionSheet from './components/AddTransactionSheet';
import PinLockScreen from './components/PinLockScreen';
import Home from './pages/Home';
import Transactions from './pages/Transactions';
import Reports from './pages/Reports';
import More from './pages/More';

export default function App() {
  const { settings, unlocked } = useApp();
  const [tab, setTab] = useState('home');
  const [sheet, setSheet] = useState(null); // 'expense' | 'income' | null

  const needsPin = settings.pinEnabled && !unlocked;

  return (
    <div className="app-shell">
      {needsPin && <PinLockScreen />}

      <header className="flex items-center justify-between px-4 pt-5 pb-1">
        <div className="text-xl font-bold text-gradient">Pulse</div>
      </header>

      <main className="flex-1 pb-2">
        {tab === 'home' && <Home onOpenAdd={(t) => setSheet(t)} />}
        {tab === 'transactions' && <Transactions />}
        {tab === 'reports' && <Reports />}
        {tab === 'more' && <More />}
      </main>

      <BottomNav active={tab} onChange={setTab} onAdd={() => setSheet('expense')} />

      {sheet && <AddTransactionSheet defaultType={sheet} onClose={() => setSheet(null)} />}
    </div>
  );
}
