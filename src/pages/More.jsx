import React, { useState } from 'react';
import {
  User, ChevronRight, ChevronLeft, Wallet, Languages, Moon, Sun,
  BarChart3, Lock, Globe, Check, Trash2, ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CURRENCIES_FINAL, formatMoney } from '../data/currencies';
import { getAllTimezones, getTimezoneOffsetLabel } from '../data/timezones';
import { filterByMonth, computeTotals, computeCategoryBreakdown } from '../utils/selectors';
import { monthLabel } from '../utils/date';

const LANGUAGES = [
  { code: 'en', label: 'English' }, { code: 'ur', label: 'Urdu' }, { code: 'ar', label: 'Arabic' },
  { code: 'es', label: 'Spanish' }, { code: 'fr', label: 'French' }, { code: 'de', label: 'German' },
  { code: 'hi', label: 'Hindi' }, { code: 'zh', label: 'Chinese' }, { code: 'pt', label: 'Portuguese' },
  { code: 'ru', label: 'Russian' }, { code: 'tr', label: 'Turkish' }, { code: 'id', label: 'Indonesian' },
];

export default function More() {
  const [view, setView] = useState('root');
  if (view === 'root') return <Root onNavigate={setView} />;
  if (view === 'edit-name') return <EditName onBack={() => setView('root')} />;
  if (view === 'currency') return <CurrencyPicker onBack={() => setView('root')} />;
  if (view === 'language') return <LanguagePicker onBack={() => setView('root')} />;
  if (view === 'theme') return <ThemePicker onBack={() => setView('root')} />;
  if (view === 'weekly') return <PeriodReport period="weekly" onBack={() => setView('root')} />;
  if (view === 'monthly') return <PeriodReport period="monthly" onBack={() => setView('root')} />;
  if (view === 'yearly') return <PeriodReport period="yearly" onBack={() => setView('root')} />;
  if (view === 'pin') return <PinSettings onBack={() => setView('root')} />;
  if (view === 'timezone') return <TimezonePicker onBack={() => setView('root')} />;
  if (view === 'reset') return <ResetData onBack={() => setView('root')} />;
  return null;
}

function SectionHeader({ children }) {
  return <p className="text-xs font-semibold uppercase tracking-wide mb-2 mt-5" style={{ color: 'var(--color-muted)' }}>{children}</p>;
}

function Row({ icon: Icon, label, value, onClick, danger }) {
  return (
    <button onClick={onClick} className="w-full flex items-center justify-between px-4 py-3.5">
      <span className="flex items-center gap-3 text-sm font-medium" style={{ color: danger ? '#F0396B' : 'var(--color-text)' }}>
        <Icon size={18} style={{ color: danger ? '#F0396B' : 'var(--color-muted)' }} />
        {label}
      </span>
      <span className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--color-muted)' }}>
        {value}
        <ChevronRight size={16} />
      </span>
    </button>
  );
}

function SubHeader({ title, onBack }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center card" aria-label="Back">
        <ChevronLeft size={18} />
      </button>
      <h1 className="text-lg font-bold">{title}</h1>
    </div>
  );
}

function Root({ onNavigate }) {
  const { settings } = useApp();
  const currentLang = LANGUAGES.find(l => l.code === settings.language)?.label || 'English';
  return (
    <div className="px-4 pt-5 pb-4">
      <div className="text-center mb-2">
        <div className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center pill-gradient">
          <User size={28} color="white" />
        </div>
        <p className="font-semibold">{settings.name}</p>
        <p className="text-xs" style={{ color: 'var(--color-muted)' }}>Pulse</p>
      </div>

      <SectionHeader>👤 Account</SectionHeader>
      <div className="card divide-y" style={{ borderColor: 'var(--color-border)' }}>
        <Row icon={User} label="Edit Name" value={settings.name} onClick={() => onNavigate('edit-name')} />
        <Row icon={Wallet} label="Currency" value={settings.currency} onClick={() => onNavigate('currency')} />
        <Row icon={Languages} label="Language" value={currentLang} onClick={() => onNavigate('language')} />
        <Row icon={settings.theme === 'dark' ? Moon : Sun} label="Theme" value={settings.theme === 'dark' ? 'Dark' : 'Light'} onClick={() => onNavigate('theme')} />
      </div>

      <SectionHeader>📊 Reports</SectionHeader>
      <div className="card divide-y" style={{ borderColor: 'var(--color-border)' }}>
        <Row icon={BarChart3} label="Weekly Report" value="" onClick={() => onNavigate('weekly')} />
        <Row icon={BarChart3} label="Monthly Report" value="" onClick={() => onNavigate('monthly')} />
        <Row icon={BarChart3} label="Yearly Report" value="" onClick={() => onNavigate('yearly')} />
      </div>

      <SectionHeader>🔒 Security</SectionHeader>
      <div className="card divide-y" style={{ borderColor: 'var(--color-border)' }}>
        <Row icon={Lock} label="PIN Lock" value={settings.pinEnabled ? 'On' : 'Off'} onClick={() => onNavigate('pin')} />
        <Row icon={Globe} label="Adjust Time Zone" value={settings.timezone.split('/').pop().replace('_', ' ')} onClick={() => onNavigate('timezone')} />
      </div>

      <SectionHeader>Danger Zone</SectionHeader>
      <div className="card">
        <Row icon={Trash2} label="Reset All Data" value="" onClick={() => onNavigate('reset')} danger />
      </div>

      <p className="text-center text-xs mt-6" style={{ color: 'var(--color-muted)' }}>Pulse · v1.0</p>
    </div>
  );
}

function EditName({ onBack }) {
  const { settings, updateSettings } = useApp();
  const [name, setName] = useState(settings.name);
  return (
    <div className="px-4 pt-5 pb-4">
      <SubHeader title="Edit Name" onBack={onBack} />
      <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--color-muted)' }}>Your name</label>
      <input value={name} onChange={e => setName(e.target.value)} className="card w-full px-4 py-3.5 text-sm mb-4"
        style={{ background: 'var(--color-surface-2)' }} autoFocus />
      <button
        onClick={() => { updateSettings({ name: name.trim() || 'You' }); onBack(); }}
        className="pill-gradient w-full py-3.5 rounded-xl font-semibold text-white"
      >
        Save
      </button>
    </div>
  );
}

function CurrencyPicker({ onBack }) {
  const { settings, updateSettings } = useApp();
  const [query, setQuery] = useState('');
  const filtered = CURRENCIES_FINAL.filter(c =>
    c.code.toLowerCase().includes(query.toLowerCase()) || c.name.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div className="px-4 pt-5 pb-4">
      <SubHeader title="Currency" onBack={onBack} />
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search currency"
        className="card w-full px-4 py-3 text-sm mb-3" style={{ background: 'var(--color-surface-2)' }} />
      <div className="card divide-y max-h-[65vh] overflow-y-auto" style={{ borderColor: 'var(--color-border)' }}>
        {filtered.map(c => (
          <button key={c.code} onClick={() => { updateSettings({ currency: c.code }); onBack(); }}
            className="w-full flex items-center justify-between px-4 py-3.5">
            <span className="text-sm">
              <span className="font-semibold">{c.code}</span>
              <span className="ml-2" style={{ color: 'var(--color-muted)' }}>{c.name}</span>
            </span>
            <span className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-muted)' }}>
              {c.symbol}
              {settings.currency === c.code && <Check size={16} color="#F0396B" />}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function LanguagePicker({ onBack }) {
  const { settings, updateSettings } = useApp();
  return (
    <div className="px-4 pt-5 pb-4">
      <SubHeader title="Language" onBack={onBack} />
      <div className="card divide-y" style={{ borderColor: 'var(--color-border)' }}>
        {LANGUAGES.map(l => (
          <button key={l.code} onClick={() => { updateSettings({ language: l.code }); onBack(); }}
            className="w-full flex items-center justify-between px-4 py-3.5">
            <span className="text-sm font-medium">{l.label}</span>
            {settings.language === l.code && <Check size={16} color="#F0396B" />}
          </button>
        ))}
      </div>
    </div>
  );
}

function ThemePicker({ onBack }) {
  const { settings, updateSettings } = useApp();
  return (
    <div className="px-4 pt-5 pb-4">
      <SubHeader title="Theme" onBack={onBack} />
      <div className="card divide-y" style={{ borderColor: 'var(--color-border)' }}>
        <button onClick={() => { updateSettings({ theme: 'dark' }); onBack(); }} className="w-full flex items-center justify-between px-4 py-3.5">
          <span className="flex items-center gap-3 text-sm font-medium"><Moon size={18} /> Dark</span>
          {settings.theme === 'dark' && <Check size={16} color="#F0396B" />}
        </button>
        <button onClick={() => { updateSettings({ theme: 'light' }); onBack(); }} className="w-full flex items-center justify-between px-4 py-3.5">
          <span className="flex items-center gap-3 text-sm font-medium"><Sun size={18} /> Light</span>
          {settings.theme === 'light' && <Check size={16} color="#F0396B" />}
        </button>
      </div>
    </div>
  );
}

function PeriodReport({ period, onBack }) {
  const { transactions, settings, now } = useApp();
  const title = period === 'weekly' ? 'Weekly Report' : period === 'monthly' ? 'Monthly Report' : 'Yearly Report';

  let rangeTx = [];
  let rangeLabel = '';
  if (period === 'weekly') {
    const day = now.getDay();
    const start = new Date(now); start.setDate(now.getDate() - day); start.setHours(0, 0, 0, 0);
    const end = new Date(start); end.setDate(start.getDate() + 7);
    rangeTx = transactions.filter(t => t.timestamp >= start.getTime() && t.timestamp < end.getTime());
    rangeLabel = `${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} – ${new Date(end - 1).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
  } else if (period === 'monthly') {
    rangeTx = filterByMonth(transactions, now.getFullYear(), now.getMonth());
    rangeLabel = monthLabel(now.getFullYear(), now.getMonth());
  } else {
    rangeTx = transactions.filter(t => new Date(t.timestamp).getFullYear() === now.getFullYear());
    rangeLabel = String(now.getFullYear());
  }

  const totals = computeTotals(rangeTx);
  const breakdown = computeCategoryBreakdown(rangeTx, 'expense');

  return (
    <div className="px-4 pt-5 pb-4">
      <SubHeader title={title} onBack={onBack} />
      <p className="text-sm mb-4" style={{ color: 'var(--color-muted)' }}>{rangeLabel}</p>
      <div className="grid grid-cols-3 gap-2 mb-5">
        <div className="card p-3">
          <p className="text-[11px]" style={{ color: 'var(--color-muted)' }}>Income</p>
          <p className="text-sm font-bold" style={{ color: '#22C55E' }}>{formatMoney(totals.income, settings.currency)}</p>
        </div>
        <div className="card p-3">
          <p className="text-[11px]" style={{ color: 'var(--color-muted)' }}>Expenses</p>
          <p className="text-sm font-bold" style={{ color: '#F0396B' }}>{formatMoney(totals.expenses, settings.currency)}</p>
        </div>
        <div className="card p-3">
          <p className="text-[11px]" style={{ color: 'var(--color-muted)' }}>Savings</p>
          <p className="text-sm font-bold" style={{ color: '#3B82F6' }}>{formatMoney(totals.savings, settings.currency)}</p>
        </div>
      </div>
      <p className="text-sm font-semibold mb-3">Breakdown by category</p>
      {breakdown.categories.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>No expenses recorded for this period.</p>
      ) : (
        <div className="card divide-y" style={{ borderColor: 'var(--color-border)' }}>
          {breakdown.categories.map(c => (
            <div key={c.id} className="flex items-center justify-between px-4 py-3">
              <span className="flex items-center gap-2 text-sm"><span className="w-2.5 h-2.5 rounded-full" style={{ background: c.color }} />{c.label}</span>
              <span className="text-sm font-semibold">{formatMoney(c.amount, settings.currency)} · {c.pct}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PinSettings({ onBack }) {
  const { settings, updateSettings } = useApp();
  const [step, setStep] = useState('root'); // root | set
  const [pin, setPin] = useState('');
  const [confirm, setConfirm] = useState('');
  const [stage, setStage] = useState('enter'); // enter | confirm
  const [error, setError] = useState('');

  const toggle = () => {
    if (settings.pinEnabled) {
      updateSettings({ pinEnabled: false, pin: '' });
    } else {
      setStep('set');
    }
  };

  const submitDigit = (d) => {
    setError('');
    if (stage === 'enter') {
      if (pin.length < 4) {
        const next = pin + d;
        setPin(next);
        if (next.length === 4) setStage('confirm');
      }
    } else {
      if (confirm.length < 4) {
        const next = confirm + d;
        setConfirm(next);
        if (next.length === 4) {
          if (next === pin) {
            updateSettings({ pinEnabled: true, pin: next });
            setStep('root');
          } else {
            setError('PINs did not match. Try again.');
            setPin(''); setConfirm(''); setStage('enter');
          }
        }
      }
    }
  };

  if (step === 'set') {
    const value = stage === 'enter' ? pin : confirm;
    return (
      <div className="px-4 pt-5 pb-4">
        <SubHeader title="Set PIN" onBack={() => setStep('root')} />
        <p className="text-sm mb-6 text-center" style={{ color: 'var(--color-muted)' }}>
          {stage === 'enter' ? 'Enter a 4-digit PIN' : 'Confirm your PIN'}
        </p>
        <div className="flex justify-center gap-4 mb-6">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="w-4 h-4 rounded-full" style={{
              background: value.length > i ? '#F0396B' : 'transparent',
              border: `2px solid ${error ? '#F0396B' : 'var(--color-border)'}`,
            }} />
          ))}
        </div>
        {error && <p className="text-xs text-center mb-3" style={{ color: '#F0396B' }}>{error}</p>}
        <div className="grid grid-cols-3 gap-4 justify-items-center">
          {['1','2','3','4','5','6','7','8','9'].map(d => (
            <button key={d} onClick={() => submitDigit(d)}
              className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold card active:scale-95 transition-transform">
              {d}
            </button>
          ))}
          <div />
          <button onClick={() => submitDigit('0')}
            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold card active:scale-95 transition-transform">
            0
          </button>
          <button onClick={() => { stage === 'enter' ? setPin(pin.slice(0, -1)) : setConfirm(confirm.slice(0, -1)); }}
            className="w-16 h-16 rounded-full flex items-center justify-center card active:scale-95 transition-transform text-sm">
            ⌫
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-5 pb-4">
      <SubHeader title="PIN Lock" onBack={onBack} />
      <div className="card px-4 py-4 flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-medium">Require PIN on launch</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>Optional 4-digit code asked every time the app opens.</p>
        </div>
        <button onClick={toggle}
          className="w-12 h-7 rounded-full relative shrink-0 transition-colors"
          style={{ background: settings.pinEnabled ? '#22C55E' : 'var(--color-surface-2)' }}>
          <span className="absolute top-1 w-5 h-5 rounded-full bg-white transition-all" style={{ left: settings.pinEnabled ? 24 : 4 }} />
        </button>
      </div>
      {settings.pinEnabled && (
        <button onClick={() => setStep('set')} className="text-sm font-medium" style={{ color: '#F0396B' }}>
          Change PIN
        </button>
      )}
    </div>
  );
}

function TimezonePicker({ onBack }) {
  const { settings, updateSettings } = useApp();
  const [query, setQuery] = useState('');
  const zones = getAllTimezones().filter(z => z.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="px-4 pt-5 pb-4">
      <SubHeader title="Adjust Time Zone" onBack={onBack} />
      <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search time zone"
        className="card w-full px-4 py-3 text-sm mb-3" style={{ background: 'var(--color-surface-2)' }} />
      <div className="card divide-y max-h-[65vh] overflow-y-auto" style={{ borderColor: 'var(--color-border)' }}>
        {zones.map(z => (
          <button key={z} onClick={() => { updateSettings({ timezone: z }); onBack(); }}
            className="w-full flex items-center justify-between px-4 py-3.5">
            <span className="text-sm">{z.replace('_', ' ')}</span>
            <span className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-muted)' }}>
              {getTimezoneOffsetLabel(z)}
              {settings.timezone === z && <Check size={16} color="#F0396B" />}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ResetData({ onBack }) {
  const { resetAll } = useApp();
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="px-4 pt-5 pb-4">
      <SubHeader title="Reset All Data" onBack={onBack} />
      <div className="card p-4 mb-4 flex items-start gap-3">
        <ShieldAlert size={20} color="#F0396B" className="shrink-0 mt-0.5" />
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          This clears every transaction and resets settings to default. This cannot be undone.
        </p>
      </div>
      {!confirming ? (
        <button onClick={() => setConfirming(true)} className="w-full py-3.5 rounded-xl font-semibold text-white" style={{ background: '#F0396B' }}>
          Reset All Data
        </button>
      ) : (
        <div className="flex gap-2">
          <button onClick={() => setConfirming(false)} className="flex-1 py-3.5 rounded-xl font-semibold card">
            Cancel
          </button>
          <button onClick={() => { resetAll(); onBack(); }} className="flex-1 py-3.5 rounded-xl font-semibold text-white" style={{ background: '#F0396B' }}>
            Confirm Reset
          </button>
        </div>
      )}
    </div>
  );
}
