import { Category } from './types';

export const COLORS = {
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

export const CATEGORY_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308',
  '#84CC16', '#22C55E', '#10B981', '#14B8A6',
  '#06B6D4', '#0EA5E9', '#3B82F6', '#2563EB',
  '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
  '#EC4899', '#F43F5E', '#64748B', '#78716C',
];

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_food', name: 'Comida', type: 'expense', icon: 'UtensilsCrossed', color: '#F97316' },
  { id: 'cat_transport', name: 'Transporte', type: 'expense', icon: 'Car', color: '#3B82F6' },
  { id: 'cat_shopping', name: 'Compras', type: 'expense', icon: 'ShoppingBag', color: '#EC4899' },
  { id: 'cat_bills', name: 'Facturas', type: 'expense', icon: 'ReceiptText', color: '#EF4444' },
  { id: 'cat_entertainment', name: 'Entretenimiento', type: 'expense', icon: 'Clapperboard', color: '#A855F7' },
  { id: 'cat_health', name: 'Salud', type: 'expense', icon: 'HeartPulse', color: '#14B8A6' },
  { id: 'cat_education', name: 'Educación', type: 'expense', icon: 'GraduationCap', color: '#6366F1' },
  { id: 'cat_housing', name: 'Vivienda', type: 'expense', icon: 'Home', color: '#06B6D4' },
  { id: 'cat_salary', name: 'Salario', type: 'income', icon: 'Wallet', color: '#10B981' },
  { id: 'cat_freelance', name: 'Freelance', type: 'income', icon: 'Laptop', color: '#22C55E' },
  { id: 'cat_investment', name: 'Inversión', type: 'income', icon: 'TrendingUp', color: '#84CC16' },
  { id: 'cat_gift', name: 'Regalo', type: 'income', icon: 'Gift', color: '#EAB308' },
];

export const CATEGORY_ICONS = [
  'UtensilsCrossed', 'Car', 'ShoppingBag', 'ReceiptText', 'Clapperboard',
  'HeartPulse', 'GraduationCap', 'Home', 'Wallet', 'Laptop', 'TrendingUp',
  'Gift', 'Coffee', 'Plane', 'Dumbbell', 'Book', 'Music', 'Camera',
  'Smartphone', 'Zap', 'Droplet', 'Wifi', 'Baby', 'Dog', 'Fish',
  'Gamepad2', 'Shirt', 'Wrench', 'PiggyBank', 'CreditCard', 'Banknote',
  'Building2', 'Briefcase', 'Store', 'Bus', 'Bike', 'Fuel',
];
