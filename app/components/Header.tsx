import { appWindow } from '@tauri-apps/api/window';
import { Settings, X, GripHorizontal } from 'lucide-react';

interface HeaderProps {
  onToggleSettings: () => void;
  showSettings: boolean;
}

export default function Header({ onToggleSettings, showSettings }: HeaderProps) {
  return (
    <div 
      data-tauri-drag-region 
      className="h-10 flex items-center justify-between px-4 cursor-move hover:bg-white/5 transition-colors rounded-t-2xl select-none"
    >
      <div className="flex items-center gap-2 text-white/20 pointer-events-none">
        <GripHorizontal size={14} />
        <span className="text-[10px] font-bold tracking-widest uppercase opacity-50">Tasks</span>
      </div>
      
      <div className="flex gap-1">
        <button 
          onClick={onToggleSettings} 
          className={`p-1.5 rounded-md transition-all duration-300 ${showSettings ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
        >
          <Settings size={14} />
        </button>
        <button 
          onClick={() => appWindow.close()} 
          className="p-1.5 rounded-md text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}