import { DayPicker } from 'react-day-picker';
import { ptBR } from 'date-fns/locale';
import { format, addDays, nextMonday } from 'date-fns';
import { Calendar as CalendarIcon, Sun, CalendarDays, XCircle } from 'lucide-react';
import SmartPopover from './SmartPopover';

interface DatePickerPopoverProps {
  selectedDate?: string;
  onChange: (dateStr: string) => void;
  onClose: () => void;
  accentColor?: string; 
}

export default function DatePickerPopover({ selectedDate, onChange, onClose, accentColor }: DatePickerPopoverProps) {
  const parsedDate = selectedDate ? new Date(selectedDate) : undefined;
  const today = new Date();
  
  const activeColor = accentColor || '#a1a1aa'; 
  const activeTextColor = accentColor ? '#000000' : '#ffffff';

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, 'yyyy-MM-dd'));
      onClose();
    }
  };

  const QuickButton = ({ label, icon: Icon, onClick, active }: any) => (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center p-2 rounded-md border transition-all text-xs gap-1.5 w-full font-medium"
      style={{
        backgroundColor: active ? activeColor : 'rgba(255,255,255,0.05)',
        borderColor: active ? activeColor : 'transparent',
        color: active ? activeTextColor : '#9ca3af'
      }}
    >
      <Icon size={14} />
      <span>{label}</span>
    </button>
  );

  return (
    <SmartPopover onClose={onClose}>
      <div className="p-4 w-[320px] max-w-full bg-[#1e1f22]">
        <div className="grid grid-cols-3 gap-2 mb-3">
          <QuickButton 
            label="Hoje" 
            icon={CalendarIcon} 
            active={selectedDate === format(today, 'yyyy-MM-dd')}
            onClick={() => handleSelect(today)} 
          />
          <QuickButton 
            label="Amanhã" 
            icon={Sun} 
            active={selectedDate === format(addDays(today, 1), 'yyyy-MM-dd')}
            onClick={() => handleSelect(addDays(today, 1))} 
          />
          <QuickButton 
            label="Segunda" 
            icon={CalendarDays} 
            onClick={() => handleSelect(nextMonday(today))} 
          />
        </div>

        <div className="border-t border-white/10 my-3" />

        <style jsx global>{`
          .rdp {
            --rdp-cell-size: 40px;
            margin: 0;
            width: 100%;
          }
          .rdp-month {
            width: 100%;
          }
          .rdp-caption {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 8px;
            margin-bottom: 10px;
          }
          .rdp-caption_label {
            font-size: 1rem;
            font-weight: 700;
            text-transform: capitalize;
            color: white;
          }
          .rdp-nav {
            display: flex;
            gap: 5px;
          }
          .rdp-nav_button {
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            background: transparent;
            color: #9ca3af;
            border: none;
            cursor: pointer;
          }
          .rdp-nav_button:hover {
            background-color: rgba(255,255,255,0.1);
            color: white;
          }
          .rdp-table {
            width: 100%;
            border-collapse: collapse;
            display: table !important;
          }
          .rdp-tbody {
            display: table-row-group !important;
          }
          .rdp-row {
            display: table-row !important;
          }
          .rdp-head {
            display: table-header-group !important;
          }
          .rdp-head_row {
            display: table-row !important;
          }
          .rdp-head_cell {
            display: table-cell !important;
            text-align: center;
            vertical-align: middle;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            color: #6b7280;
            height: 30px;
          }
          .rdp-cell {
            display: table-cell !important;
            text-align: center;
            vertical-align: middle;
            padding: 0;
          }
          .rdp-day {
            width: 36px;
            height: 36px;
            margin: 2px auto;
            border-radius: 8px;
            display: flex !important;
            align-items: center;
            justify-content: center;
            font-size: 0.9rem;
            color: #e5e7eb;
            background: transparent;
            border: none;
            cursor: pointer;
            transition: all 0.2s;
          }
          .rdp-day:hover:not(.rdp-day_selected):not([disabled]) {
            background-color: rgba(255,255,255,0.1);
          }
          .rdp-day_selected {
            background-color: ${activeColor} !important;
            color: ${activeTextColor} !important;
            font-weight: bold;
          }
          .rdp-day_today {
            border: 1px solid ${activeColor};
            color: ${activeColor};
            font-weight: bold;
          }
          .rdp-day_outside {
            opacity: 0.25;
          }
          .rdp-vhidden {
            display: none;
          }
        `}</style>

        <DayPicker
          mode="single"
          selected={parsedDate}
          onSelect={handleSelect}
          locale={ptBR}
          showOutsideDays={true}
          fixedWeeks={true}
        />

        {selectedDate && (
          <button 
            onClick={() => { onChange(''); onClose(); }}
            className="flex items-center justify-center gap-2 w-full mt-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-md transition-colors border border-transparent hover:border-red-500/20"
          >
            <XCircle size={14} />
            Remover Data
          </button>
        )}
      </div>
    </SmartPopover>
  );
}