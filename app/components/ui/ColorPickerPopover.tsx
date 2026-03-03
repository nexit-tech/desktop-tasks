import { HexColorPicker } from 'react-colorful';
import { Palette, X, RotateCcw } from 'lucide-react';
import SmartPopover from './SmartPopover';
import { useTaskSystem } from '@/hooks/useTaskSystem';

interface ColorPickerPopoverProps {
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

export default function ColorPickerPopover({ color, onChange, onClose }: ColorPickerPopoverProps) {
  const { config } = useTaskSystem();
  const accentColor = config?.accentColor || '#5865F2';

  const PRESET_COLORS = [
    '#da373c', '#f0b232', '#23a559', '#00a8fc', '#5865F2',
    '#eb459e', '#9b59b6', '#e67e22', '#2ecc71', '#95a5a6'
  ];

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <SmartPopover onClose={onClose}>
      <div className="w-56 p-3 bg-[#2b2d31] rounded-lg border border-[#1e1f22] shadow-2xl animate-in zoom-in-95 duration-200 font-sans">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2" style={{ color: accentColor }}>
            <Palette size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">Cor da Tarefa</span>
          </div>
          <div className="flex items-center gap-1">
            {color && (
              <button 
                onClick={handleClear}
                className="p-1 text-[#b5bac1] hover:text-[#f2f3f5] hover:bg-white/5 rounded transition-colors"
                title="Restaurar Padrão"
              >
                <RotateCcw size={14} />
              </button>
            )}
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="p-1 text-[#b5bac1] hover:text-[#da373c] hover:bg-[#da373c]/10 rounded transition-colors"
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
              className={`w-full aspect-square rounded-md transition-all hover:scale-110 border ${color === preset ? 'scale-105 shadow-sm' : 'border-transparent shadow-inner'}`}
              style={{ 
                backgroundColor: preset,
                borderColor: color === preset ? '#fff' : 'transparent'
              }}
              title={preset}
            />
          ))}
        </div>
      </div>
    </SmartPopover>
  );
}