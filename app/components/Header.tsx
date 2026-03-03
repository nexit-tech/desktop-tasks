import { X, Settings2, CalendarDays } from 'lucide-react';
import { appWindow } from '@tauri-apps/api/window';
import { useState, useEffect } from 'react';

interface HeaderProps {
  showSettings: boolean;
  onToggleSettings: () => void;
}

export default function Header({ showSettings, onToggleSettings }: HeaderProps) {
  const [today, setToday] = useState('');

  useEffect(() => {
    const date = new Intl.DateTimeFormat('pt-BR', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    }).format(new Date());
    setToday(date.charAt(0).toUpperCase() + date.slice(1));
  }, []);

  return (
    <div 
      className="flex items-center justify-between px-3 py-2.5 select-none group border-b border-white/5 bg-black/10"
      data-tauri-drag-region
    >
      <div 
        className="flex-1 h-full flex items-center gap-3 text-[10px] font-bold tracking-[0.2em] text-white/20 group-hover:text-white/50 transition-colors cursor-default"
        data-tauri-drag-region
      >
        <span>TASKS</span>
        <span className="w-1 h-1 rounded-full bg-white/10" />
        <span className="font-medium tracking-normal flex items-center gap-1.5 opacity-80 capitalize">
          <CalendarDays size={12} className="text-emerald-400/70" />
          {today}
        </span>
      </div>

      <div className="flex items-center gap-1.5 z-10">
        <button
          onClick={onToggleSettings}
          title="Configurações"
          className={`p-1.5 rounded-md transition-all duration-300 
            ${showSettings ? 'bg-white/10 text-white shadow-inner scale-95' : 'text-white/30 hover:text-white hover:bg-white/10 hover:scale-105'}`}
        >
          <Settings2 size={14} strokeWidth={2} />
        </button>

        <button
          onClick={() => appWindow.close()}
          title="Fechar"
          className="p-1.5 rounded-md text-white/30 hover:text-red-400 hover:bg-red-500/20 transition-all duration-300 hover:scale-105"
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}