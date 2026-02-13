import { X, Settings2 } from 'lucide-react';
import { appWindow } from '@tauri-apps/api/window';

interface HeaderProps {
  showSettings: boolean;
  onToggleSettings: () => void;
}

export default function Header({ showSettings, onToggleSettings }: HeaderProps) {
  return (
    <div 
      className="flex items-center justify-between px-3 py-2 select-none group"
      data-tauri-drag-region
    >
      <div 
        className="flex-1 h-full flex items-center text-[10px] font-bold tracking-[0.2em] text-white/10 group-hover:text-white/30 transition-colors cursor-default"
        data-tauri-drag-region
      >
        TASKS
      </div>

      <div className="flex items-center gap-1.5 z-10">
        <button
          onClick={onToggleSettings}
          title="Configurações"
          className={`p-1.5 rounded-md transition-all duration-200 
            ${showSettings ? 'bg-white/10 text-white shadow-inner' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
        >
          <Settings2 size={14} strokeWidth={2} />
        </button>

        <button
          onClick={() => appWindow.close()}
          title="Fechar"
          className="p-1.5 rounded-md text-white/30 hover:text-red-300 hover:bg-red-500/20 transition-all duration-200"
        >
          <X size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}