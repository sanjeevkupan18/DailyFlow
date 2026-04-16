import { format, isToday, isYesterday, parseISO, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

export const formatDate = (date, fmt = 'yyyy-MM-dd') => format(new Date(date), fmt);

export const formatDisplay = (date) => {
  const d = new Date(date);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d, yyyy');
};

export const getWeekDays = (date = new Date()) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end }).map((d) => ({
    date: format(d, 'yyyy-MM-dd'),
    label: format(d, 'EEE'),
    dayNum: format(d, 'd'),
    isToday: isToday(d),
  }));
};

export const getMonthLabel = (dateStr) => format(parseISO(dateStr + '-01'), 'MMMM yyyy');

export const getDayLabel = (dateStr) => format(parseISO(dateStr), 'EEE, MMM d');

export const currentMonth = () => format(new Date(), 'yyyy-MM');

export const currentYear = () => new Date().getFullYear();

export const greetingByHour = (name = '') => {
  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  return name ? `${greeting}, ${name.split(' ')[0]} 👋` : greeting;
};
