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
      className="flex items-center justify-between px-3 py-2 select-none group border-b border-black/10 bg-black/10 backdrop-blur-md"
      data-tauri-drag-region
    >
      <div 
        className="flex-1 h-full flex items-center gap-3 text-xs font-bold tracking-widest text-white/40 group-hover:text-white/70 transition-colors cursor-default"
        data-tauri-drag-region
      >
        <span data-tauri-drag-region>TASKS</span>
        <span className="w-1 h-1 rounded-full bg-white/20" data-tauri-drag-region />
        <span 
          className="font-medium tracking-normal flex items-center gap-1.5 opacity-90 capitalize text-white/60"
          data-tauri-drag-region
        >
          <CalendarDays size={14} className="text-[#5865F2]" />
          {today}
        </span>
      </div>

      <div className="flex items-center gap-2 z-10">
        <button
          onClick={onToggleSettings}
          title="Configurações"
          className={`p-1.5 rounded transition-all duration-200 
            ${showSettings 
              ? 'bg-black/30 text-white shadow-sm' 
              : 'text-white/50 hover:text-white hover:bg-black/20'}`}
        >
          <Settings2 size={16} strokeWidth={2} />
        </button>

        <button
          onClick={() => appWindow.close()}
          title="Fechar"
          className="p-1.5 rounded text-white/50 hover:text-white hover:bg-[#da373c] transition-all duration-200"
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}