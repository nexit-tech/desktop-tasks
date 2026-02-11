export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);

  if (date.getTime() === today.getTime()) return 'Hoje';
  if (date.getTime() === tomorrow.getTime()) return 'Amanhã';

  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' }).format(date);
};

export const isOverdue = (dateString?: string): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  date.setHours(23, 59, 59, 999); 
  return date < today;
};