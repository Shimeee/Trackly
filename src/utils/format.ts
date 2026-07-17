import i18n from '../i18n';

export function formatMoney(amount: number, currency = 'EGP'): string {
  const rounded = Math.round(amount * 100) / 100;
  const formatted = rounded.toLocaleString('en-US', { maximumFractionDigits: rounded % 1 === 0 ? 0 : 2 });
  return `${currency} ${formatted}`;
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  const months = i18n.t('calendar.months', { returnObjects: true }) as string[];
  return `${d.getDate()} ${months[d.getMonth()].slice(0, 3)}`;
}

export function formatLongDate(iso: string): string {
  const d = new Date(iso);
  const months = i18n.t('calendar.months', { returnObjects: true }) as string[];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return i18n.t('common.justNow');
  if (mins < 60) return i18n.t('common.minutesAgo', { count: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return i18n.t('common.hoursAgo', { count: hours });
  const days = Math.floor(hours / 24);
  return i18n.t('common.daysAgo', { count: days });
}
