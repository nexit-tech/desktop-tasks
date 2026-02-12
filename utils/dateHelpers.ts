import { format, isToday, isTomorrow, isYesterday, isBefore, startOfDay, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  
  const date = parseISO(dateString);
  if (!isValid(date)) return '';

  if (isToday(date)) return 'Hoje';
  if (isTomorrow(date)) return 'Amanhã';
  if (isYesterday(date)) return 'Ontem';

  return format(date, "d 'de' MMM", { locale: ptBR });
};

export const isOverdue = (dateString?: string): boolean => {
  if (!dateString) return false;
  
  const date = parseISO(dateString);
  if (!isValid(date)) return false;

  return isBefore(date, startOfDay(new Date()));
};