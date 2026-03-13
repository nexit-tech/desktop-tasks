import { useState, useEffect, useMemo } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';
import SmartPopover from './SmartPopover';
import { isToday, getStartOfDay } from '@/utils/dateHelpers';

interface DatePickerPopoverProps {
  currentDate: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}

export default function DatePickerPopover({ currentDate, onSelect, onClose }: DatePickerPopoverProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (currentDate) {
      setCurrentMonth(new Date(currentDate));
    } else {
      setCurrentMonth(new Date());
    }
  }, [currentDate]);

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const days = useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [daysInMonth]);

  const blanks = useMemo(() => {
    return Array.from({ length: firstDayOfMonth }, (_, i) => i);
  }, [firstDayOfMonth]);

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleSelectDate = (day: number) => {
    const selected = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    onSelect(getStartOfDay(selected));
  };

  const handleClearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect('');
  };

  const isSelected = (day: number) => {
    if (!currentDate) return false;
    const date = new Date(currentDate);
    return date.getDate() === day && 
           date.getMonth() === currentMonth.getMonth() && 
           date.getFullYear() === currentMonth.getFullYear();
  };

  const isDayToday = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return isToday(date.toISOString());
  };

  const monthName = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(currentMonth);

  return (
    <SmartPopover onClose={onClose}>
      <div 
        className="w-64 p-3 rounded-lg border shadow-2xl animate-in zoom-in-95 duration-200"
        style={{ backgroundColor: 'var(--theme-focus)', borderColor: 'var(--theme-border)', color: 'inherit' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon size={14} style={{ color: '#23a559' }} />
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--theme-muted)' }}>Prazo</span>
          </div>
          <div className="flex items-center gap-1">
            {currentDate && (
              <button 
                onClick={handleClearDate}
                className="p-1 rounded transition-colors hover:bg-red-500/20 hover:text-red-500"
                style={{ color: 'var(--theme-subtle)' }}
                title="Remover Data"
                onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--theme-subtle)'; }}
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 px-1">
          <button 
            onClick={handlePrevMonth}
            className="p-1 rounded transition-colors"
            style={{ color: 'var(--theme-subtle)' }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.backgroundColor = 'var(--theme-hover)'; 
              e.currentTarget.style.color = 'inherit'; 
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.backgroundColor = 'transparent'; 
              e.currentTarget.style.color = 'var(--theme-subtle)'; 
            }}
          >
            <ChevronLeft size={16} strokeWidth={2.5} />
          </button>
          <span className="text-[12px] font-bold capitalize tracking-wide" style={{ color: 'inherit' }}>
            {monthName}
          </span>
          <button 
            onClick={handleNextMonth}
            className="p-1 rounded transition-colors"
            style={{ color: 'var(--theme-subtle)' }}
            onMouseEnter={(e) => { 
              e.currentTarget.style.backgroundColor = 'var(--theme-hover)'; 
              e.currentTarget.style.color = 'inherit'; 
            }}
            onMouseLeave={(e) => { 
              e.currentTarget.style.backgroundColor = 'transparent'; 
              e.currentTarget.style.color = 'var(--theme-subtle)'; 
            }}
          >
            <ChevronRight size={16} strokeWidth={2.5} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
            <div key={i} className="text-[10px] font-bold text-center py-1" style={{ color: 'var(--theme-subtle)' }}>
              {day}
            </div>
          ))}
          
          {blanks.map(blank => (
            <div key={`blank-${blank}`} className="h-7" />
          ))}
          
          {days.map(day => {
            const selected = isSelected(day);
            const today = isDayToday(day);
            
            return (
              <button
                key={day}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectDate(day);
                }}
                className="h-7 text-[12px] rounded flex items-center justify-center transition-all duration-200 border"
                style={{ 
                  backgroundColor: selected ? '#23a559' : today ? 'transparent' : 'transparent',
                  color: selected ? '#ffffff' : today ? '#23a559' : 'inherit',
                  borderColor: selected ? '#23a559' : today ? '#23a559' : 'transparent',
                  fontWeight: selected || today ? 'bold' : '500',
                  transform: selected ? 'scale(1.05)' : 'scale(1)'
                }}
                onMouseEnter={(e) => {
                   if (!selected) {
                      e.currentTarget.style.backgroundColor = 'var(--theme-hover)';
                   }
                }}
                onMouseLeave={(e) => {
                   if (!selected) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                   }
                }}
              >
                {day}
              </button>
            );
          })}
        </div>

        {!currentDate && (
          <div className="mt-3 pt-3 border-t flex items-center justify-center text-[10px] font-medium gap-1.5" style={{ borderColor: 'var(--theme-border)', color: 'var(--theme-subtle)' }}>
            <Clock size={12} />
            Selecione uma data para o prazo
          </div>
        )}
      </div>
    </SmartPopover>
  );
}