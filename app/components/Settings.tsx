import { AppConfig } from '@/types';
import { X, Check } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

interface SettingsProps {
  config: AppConfig;
  onUpdateConfig: (newConfig: AppConfig) => void;
  onClose: () => void;
}

export default function Settings({ config, onUpdateConfig, onClose }: SettingsProps) {
  const PRESET_COLORS = [
    '#191919', '#1e1e2e', '#0f172a', '#171717', 
    '#27272a', '#2e1065', '#450a0a', '#052e16'
  ];

  return (
    <div className="flex flex-col h-full animate-in fade-in">
      <div className="flex items-center justify-between mb-6 pl-1">
        <h2 className="text-xs font-bold tracking-[0.15em] text-white/40 uppercase">
          Aparência
        </h2>
        <button 
          onClick={onClose}
          className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-md transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-300 font-medium">Opacidade da Janela</span>
            <span className="text-white/40 font-mono text-xs">
              {Math.round(config.opacity * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.4"
            max="1"
            step="0.01"
            value={config.opacity}
            onChange={(e) => onUpdateConfig({ ...config, opacity: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white hover:accent-gray-200 transition-all"
          />
        </div>

        <div className="space-y-3">
          <span className="text-sm text-gray-300 font-medium block">Cor de Fundo</span>
          
          <div className="grid grid-cols-4 gap-2 mb-3">
            {PRESET_COLORS.map((color) => (
              <button
                key={color}
                onClick={() => onUpdateConfig({ ...config, bgColor: color })}
                className={`h-8 rounded-md transition-all duration-200 border flex items-center justify-center
                  ${config.bgColor === color ? 'border-white/50 scale-95 shadow-sm' : 'border-transparent hover:scale-105'}`}
                style={{ backgroundColor: color }}
              >
                {config.bgColor === color && <Check size={12} className="text-white drop-shadow-md" />}
              </button>
            ))}
          </div>

          <div className="p-3 bg-white/5 rounded-xl border border-white/5">
            <HexColorPicker 
              color={config.bgColor} 
              onChange={(color) => onUpdateConfig({ ...config, bgColor: color })} 
              style={{ width: '100%', height: '120px' }}
            />
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
              <div 
                className="w-6 h-6 rounded border border-white/10 shadow-inner"
                style={{ backgroundColor: config.bgColor }}
              />
              <input 
                type="text" 
                value={config.bgColor.toUpperCase()}
                onChange={(e) => onUpdateConfig({ ...config, bgColor: e.target.value })}
                className="flex-1 bg-transparent text-xs font-mono text-white/60 focus:text-white outline-none"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-4 border-t border-white/5 text-[10px] text-white/20 text-center">
        v0.1.0 • Nexit Tech
      </div>
    </div>
  );
}