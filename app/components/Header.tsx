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
      className="flex items-center justify-between px-3 py-2 select-none group border-b"
      style={{ borderColor: 'var(--theme-border)', backgroundColor: 'var(--theme-focus)' }}
      data-tauri-drag-region
    >
      <div 
        className="flex-1 h-full flex items-center gap-3 text-[11px] font-bold tracking-[0.15em] transition-colors cursor-default"
        style={{ color: 'var(--theme-muted)' }}
        data-tauri-drag-region
      >
        <span data-tauri-drag-region className="hover:text-[color:inherit] transition-colors opacity-70 hover:opacity-100">TASKS</span>
        <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--theme-border)' }} />
        <span className="font-semibold tracking-normal flex items-center gap-1.5 opacity-80 capitalize">
          <CalendarDays size={12} className="text-emerald-500" />
          {today}
        </span>
      </div>

      <div className="flex items-center gap-1 z-10">
        <button
          onClick={onToggleSettings}
          title="Configurações"
          className="p-1.5 rounded transition-all duration-200"
          style={{ 
            backgroundColor: showSettings ? 'var(--theme-hover)' : 'transparent',
            color: showSettings ? 'inherit' : 'var(--theme-subtle)' 
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--theme-hover)';
            e.currentTarget.style.color = 'inherit';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = showSettings ? 'var(--theme-hover)' : 'transparent';
            e.currentTarget.style.color = showSettings ? 'inherit' : 'var(--theme-subtle)';
          }}
        >
          <Settings2 size={14} strokeWidth={2.5} />
        </button>

        <button
          onClick={() => appWindow.close()}
          title="Fechar"
          className="p-1.5 rounded transition-all duration-200 hover:bg-red-500/20 hover:text-red-500"
          style={{ color: 'var(--theme-subtle)' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--theme-subtle)'}
        >
          <X size={14} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}