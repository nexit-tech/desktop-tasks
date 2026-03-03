export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === today.toDateString()) return 'Hoje';
  if (date.toDateString() === tomorrow.toDateString()) return 'Amanhã';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short'
  }).format(date).replace('.', '');
};

export const isOverdue = (dateString?: string): boolean => {
  if (!dateString) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(dateString);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < today;
};

export const isToday = (dateString?: string): boolean => {
  if (!dateString) return false;
  const today = new Date();
  const date = new Date(dateString);
  return date.toDateString() === today.toDateString();
};

export const getStartOfDay = (date: Date = new Date()): string => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate.toISOString();
};