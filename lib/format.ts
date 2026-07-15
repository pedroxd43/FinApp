export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
  return `${amount < 0 ? '-' : ''}$${formatted}`;
}

export function formatCurrencySigned(amount: number, type: 'income' | 'expense'): string {
  const sign = type === 'income' ? '+' : '-';
  return `${sign}$${new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.abs(amount))}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

export function getMonthName(date: Date): string {
  return date.toLocaleDateString('es-CO', { month: 'long' });
}

export function getWeekRange(date: Date): { start: Date; end: Date } {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  const start = new Date(d.getFullYear(), d.getMonth(), diff);
  const end = new Date(d.getFullYear(), d.getMonth(), diff + 6, 23, 59, 59);
  return { start, end };
}

export function getMonthRange(date: Date): { start: Date; end: Date } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
  return { start, end };
}

export function getYearRange(date: Date): { start: Date; end: Date } {
  const start = new Date(date.getFullYear(), 0, 1);
  const end = new Date(date.getFullYear(), 11, 31, 23, 59, 59);
  return { start, end };
}

export function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isDateInRange(date: string | Date, start: Date, end: Date): boolean {
  const d = new Date(date);
  return d >= start && d <= end;
}

export function getDayLabel(date: Date): string {
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
}

export function getWeekdayLabel(date: Date): string {
  return date.toLocaleDateString('es-CO', { weekday: 'short' });
}

export function getMonthLabel(date: Date): string {
  return date.toLocaleDateString('es-CO', { month: 'short' });
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}
