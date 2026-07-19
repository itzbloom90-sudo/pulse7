import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { getDefaultTimezone } from '../data/timezones';
import { nowInZone, monthKey } from '../utils/date';

const STORAGE_KEY = 'pulse7_state_v1';

const defaultSettings = {
  name: 'You',
  currency: 'USD',
  language: 'en',
  theme: 'dark',
  timezone: getDefaultTimezone(),
  pinEnabled: false,
  pin: '',
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        transactions: parsed.transactions || [],
        settings: { ...defaultSettings, ...(parsed.settings || {}) },
        viewMonth: parsed.viewMonth ?? null,
        unlocked: false,
      };
    }
  } catch (e) {
    // ignore corrupt storage, start fresh
  }
  return {
    transactions: [],
    settings: defaultSettings,
    viewMonth: null,
    unlocked: false,
  };
}

function persist(state) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        transactions: state.transactions,
        settings: state.settings,
        viewMonth: state.viewMonth,
      })
    );
  } catch (e) {
    // storage may be unavailable; app still works in-memory for this session
  }
}

function reducer(state, action) {
  let next = state;
  switch (action.type) {
    case 'ADD_TRANSACTION': {
      next = { ...state, transactions: [action.payload, ...state.transactions] };
      break;
    }
    case 'DELETE_TRANSACTION': {
      next = { ...state, transactions: state.transactions.filter(t => t.id !== action.payload) };
      break;
    }
    case 'UPDATE_SETTINGS': {
      next = { ...state, settings: { ...state.settings, ...action.payload } };
      break;
    }
    case 'SET_VIEW_MONTH': {
      next = { ...state, viewMonth: action.payload };
      break;
    }
    case 'UNLOCK': {
      next = { ...state, unlocked: true };
      break;
    }
    case 'RESET_ALL': {
      next = { transactions: [], settings: defaultSettings, viewMonth: null, unlocked: true };
      break;
    }
    default:
      return state;
  }
  persist(next);
  return next;
}

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    document.documentElement.classList.toggle('light', state.settings.theme === 'light');
  }, [state.settings.theme]);

  const now = nowInZone(state.settings.timezone);
  const currentMonthKey = monthKey(now);

  const viewYear = state.viewMonth ? Number(state.viewMonth.split('-')[0]) : now.getFullYear();
  const viewMonthIdx = state.viewMonth ? Number(state.viewMonth.split('-')[1]) - 1 : now.getMonth();
  const isCurrentMonth = monthKey(new Date(viewYear, viewMonthIdx, 1)) === currentMonthKey;

  const actions = useMemo(() => ({
    addTransaction: (tx) => {
      const nowTs = nowInZone(state.settings.timezone);
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: {
          id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          timestamp: nowTs.getTime(),
          ...tx,
        },
      });
    },
    deleteTransaction: (id) => dispatch({ type: 'DELETE_TRANSACTION', payload: id }),
    updateSettings: (patch) => dispatch({ type: 'UPDATE_SETTINGS', payload: patch }),
    setViewMonth: (year, monthIdx) => dispatch({ type: 'SET_VIEW_MONTH', payload: monthKey(new Date(year, monthIdx, 1)) }),
    goToCurrentMonth: () => dispatch({ type: 'SET_VIEW_MONTH', payload: null }),
    unlock: () => dispatch({ type: 'UNLOCK' }),
    resetAll: () => dispatch({ type: 'RESET_ALL' }),
  }), [state.settings.timezone]);

  const value = {
    ...state,
    now,
    currentMonthKey,
    viewYear,
    viewMonthIdx,
    isCurrentMonth,
    ...actions,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
