import React, { useState, useEffect } from 'react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, parseISO, isToday 
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Trash2, Calendar as CalendarIcon, X } from 'lucide-react';
import SmartPopover from './SmartPopover';

interface DatePickerPopoverProps {
  currentDate?: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}

export default function DatePickerPopover({ currentDate, onSelect, onClose }: DatePickerPopoverProps) {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (currentDate) {
      const parsed = parseISO(currentDate);
      if (!isNaN(parsed.getTime())) {
        setSelectedDate(parsed);
        setViewDate(parsed);
      }
    }
  }, [currentDate]);

  const onPrevMonth = () => setViewDate(subMonths(viewDate, 1));
  const onNextMonth = () => setViewDate(addMonths(viewDate, 1));

  const handleDayClick = (day: Date) => {
    onSelect(format(day, 'yyyy-MM-dd'));
    onClose();
  };

  const handleClear = () => {
    onSelect('');
    onClose();
  };

  const renderDays = () => {
    const dateFormat = "eeeee";
    const days = [];
    let startDate = startOfWeek(viewDate, { weekStartsOn: 0 });

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-xs text-gray-500 font-medium text-center py-2 uppercase">
          {format(addDays(startDate, i), dateFormat, { locale: ptBR })}
        </div>
      );
    }

    return <div className="grid grid-cols-7 mb-1">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(viewDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, 'd');
        const cloneDay = day;
        const isSelected = selectedDate ? isSameDay(day, selectedDate) : false;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isCurrentDay = isToday(day);

        days.push(
          <div
            key={day.toString()}
            onClick={() => handleDayClick(cloneDay)}
            className={`
              relative p-2 cursor-pointer text-center text-sm rounded-lg transition-all duration-200
              ${!isCurrentMonth ? 'text-gray-700' : 'text-gray-300 hover:bg-white/10 hover:text-white'}
              ${isSelected ? '!bg-white !text-black font-bold shadow-sm' : ''}
              ${isCurrentDay && !isSelected ? 'ring-1 ring-white/20' : ''}
            `}
          >
            <span>{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-y-1">
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <SmartPopover onClose={onClose}>
      <div className="w-[320px] p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
          <div className="flex items-center gap-2 text-gray-200">
            <CalendarIcon size={16} />
            <span className="text-sm font-semibold">Definir Data</span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navegação de Mês */}
        <div className="flex items-center justify-between px-1 mb-2">
           <button 
            onClick={onPrevMonth}
            className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-semibold capitalize text-gray-200">
            {format(viewDate, 'MMMM yyyy', { locale: ptBR })}
          </span>
          <button 
            onClick={onNextMonth}
            className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Calendário */}
        <div className="mb-2">
          {renderDays()}
          {renderCells()}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-white/5 pt-3 mt-2 flex justify-between">
            <button
                onClick={() => handleDayClick(new Date())}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
                <CalendarIcon size={14} />
                Hoje
            </button>
            <button
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
            >
                <Trash2 size={14} />
                Limpar
            </button>
        </div>
      </div>
    </SmartPopover>
  );
}