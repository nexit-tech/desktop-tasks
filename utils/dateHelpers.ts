import { format, isBefore, startOfDay, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  
  const date = parseISO(dateString);
  if (!isValid(date)) return '';

  return format(date, 'dd MMM', { locale: ptBR }).toUpperCase();
};

export const isOverdue = (dateString?: string): boolean => {
  if (!dateString) return false;
  
  const date = parseISO(dateString);
  if (!isValid(date)) return false;

  return isBefore(date, startOfDay(new Date()));
};

export const getDisplayDate = (dateString?: string): string => {
  if (!dateString) return 'Sem data';
  const date = parseISO(dateString);
  if (!isValid(date)) return 'Data inválida';
  return format(date, "dd 'de' MMMM", { locale: ptBR });
};