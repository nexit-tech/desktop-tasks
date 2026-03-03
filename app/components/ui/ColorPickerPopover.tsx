import { HexColorPicker } from 'react-colorful';
import { Palette, X, RotateCcw } from 'lucide-react';
import SmartPopover from './SmartPopover';

interface ColorPickerPopoverProps {
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

export default function ColorPickerPopover({ color, onChange, onClose }: ColorPickerPopoverProps) {
  const PRESET_COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e',
    '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#ec4899'
  ];

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <SmartPopover onClose={onClose}>
      <div className="w-56 p-3 bg-[#1e1e2e]/95 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-indigo-400">
            <Palette size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">Cor da Tarefa</span>
          </div>
          <div className="flex items-center gap-1">
            {color && (
              <button 
                onClick={handleClear}
                className="p-1 text-white/40 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="Restaurar Padrão"
              >
                <RotateCcw size={14} />
              </button>
            )}
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="p-1 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        <div className="mb-3">
          <HexColorPicker 
            color={color || '#ffffff'} 
            onChange={onChange}
            style={{ width: '100%', height: '140px' }}
          />
        </div>

        <div className="grid grid-cols-5 gap-1.5 pt-3 border-t border-white/5">
          {PRESET_COLORS.map(preset => (
            <button
              key={preset}
              onClick={(e) => { e.stopPropagation(); onChange(preset); }}
              className={`w-full aspect-square rounded-md transition-all hover:scale-110 border ${color === preset ? 'border-white/50 scale-105 shadow-sm' : 'border-transparent shadow-inner'}`}
              style={{ backgroundColor: preset }}
              title={preset}
            />
          ))}
        </div>
      </div>
    </SmartPopover>
  );
}