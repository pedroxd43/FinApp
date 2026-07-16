import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  income: string;
  incomeLight: string;
  incomeDark: string;
  expense: string;
  expenseLight: string;
  expenseDark: string;
  warning: string;
  warningLight: string;
  warningDark: string;
  bg: string;
  card: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  shadow: string;
  overlay: string;
  tabInactive: string;
}

const LIGHT: ThemeColors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#DBEAFE',
  income: '#10B981',
  incomeLight: '#D1FAE5',
  incomeDark: '#059669',
  expense: '#EF4444',
  expenseLight: '#FEE2E2',
  expenseDark: '#DC2626',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  warningDark: '#D97706',
  bg: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  shadow: '#0F172A',
  overlay: 'rgba(15, 23, 42, 0.5)',
  tabInactive: '#94A3B8',
};

const DARK: ThemeColors = {
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  primaryLight: '#1E3A5F',
  income: '#10B981',
  incomeLight: '#0F3326',
  incomeDark: '#34D399',
  expense: '#EF4444',
  expenseLight: '#3B1414',
  expenseDark: '#F87171',
  warning: '#F59E0B',
  warningLight: '#3D2E0E',
  warningDark: '#FBBF24',
  bg: '#0F172A',
  card: '#1E293B',
  border: '#334155',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.6)',
  tabInactive: '#64748B',
};

const THEME_KEY = 'finapp:theme';

interface ThemeContextValue {
  mode: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (m: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') {
      setMode(saved);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  }, []);

  const setTheme = useCallback((m: ThemeMode) => {
    setMode(m);
    localStorage.setItem(THEME_KEY, m);
  }, []);

  const colors = mode === 'dark' ? DARK : LIGHT;

  return (
    <ThemeContext.Provider value={{ mode, colors, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
