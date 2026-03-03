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
      <div className="w-64 p-3 bg-[#1e1e2e]/95 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <CalendarIcon size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">Prazo</span>
          </div>
          <div className="flex items-center gap-1">
            {currentDate && (
              <button 
                onClick={handleClearDate}
                className="p-1 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                title="Remover Data"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 px-1">
          <button 
            onClick={handlePrevMonth}
            className="p-1 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-xs font-medium text-white/90 capitalize">
            {monthName}
          </span>
          <button 
            onClick={handleNextMonth}
            className="p-1 text-white/50 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
            <div key={i} className="text-[10px] font-bold text-center text-white/30 py-1">
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
                className={`
                  h-7 text-xs rounded-md flex items-center justify-center transition-all duration-200
                  ${selected 
                    ? 'bg-emerald-500 text-white font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)] scale-105' 
                    : today 
                      ? 'bg-white/10 text-emerald-400 font-bold border border-emerald-500/30 hover:bg-white/20' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                {day}
              </button>
            );
          })}
        </div>

        {!currentDate && (
          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-center text-[10px] text-white/30 gap-1.5">
            <Clock size={12} />
            Selecione uma data para o prazo
          </div>
        )}
      </div>
    </SmartPopover>
  );
}