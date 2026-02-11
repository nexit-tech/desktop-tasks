import { AppConfig } from '@/types';
import { useAutoStart } from '@/hooks/useAutoStart';
import { Monitor, Ghost, ArrowLeft } from 'lucide-react';

interface SettingsProps {
  config: AppConfig;
  onUpdateConfig: (cfg: AppConfig) => void;
  onClose: () => void;
}

const COLORS = ['#191919', '#000000', '#1A1D23', '#2B1C2B', '#121726'];

export default function Settings({ config, onUpdateConfig, onClose }: SettingsProps) {
  const { isEnabled, toggleAutoStart } = useAutoStart();

  return (
    <div className="space-y-6 p-2 animate-in-up">
      
      <div className="bg-white/5 p-4 rounded-xl flex justify-between items-center border border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Monitor size={16} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-gray-200">Auto Início</span>
            <span className="text-[10px] text-gray-500">Abrir com Windows</span>
          </div>
        </div>
        <button 
          onClick={toggleAutoStart} 
          className={`w-10 h-6 rounded-full relative transition-all duration-300 ${isEnabled ? 'bg-blue-500 shadow-lg shadow-blue-500/20' : 'bg-white/10'}`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${isEnabled ? 'left-5' : 'left-1'}`} />
        </button>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-3 text-gray-400 px-1">
          <Ghost size={14} />
          <label className="text-xs font-bold uppercase tracking-wider">Transparência</label>
        </div>
        <input 
          type="range" 
          min="0.2" 
          max="1" 
          step="0.05" 
          value={config.opacity}
          onChange={(e) => onUpdateConfig({ ...config, opacity: parseFloat(e.target.value) })}
          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
        />
      </div>
      
      <div>
        <label className="text-xs font-bold text-gray-500 mb-3 block uppercase tracking-wider px-1">Tema</label>
        <div className="flex gap-3 justify-center">
          {COLORS.map(c => (
            <button 
              key={c} 
              onClick={() => onUpdateConfig({...config, bgColor: c})} 
              className={`w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 ${config.bgColor === c ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-transparent ring-1 ring-white/10'}`} 
              style={{background: c}} 
            />
          ))}
        </div>
      </div>

      <button 
        onClick={onClose} 
        className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-2 group"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
        VOLTAR
      </button>
    </div>
  );
}