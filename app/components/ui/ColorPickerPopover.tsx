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
    '#06b6d4', '#3b82f6', '#5865F2', '#a855f7', '#ec4899'
  ];

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <SmartPopover onClose={onClose}>
      <div 
        className="w-56 p-3 rounded-lg border shadow-2xl animate-in zoom-in-95 duration-200"
        style={{ backgroundColor: 'var(--theme-focus)', borderColor: 'var(--theme-border)', color: 'inherit' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Palette size={14} style={{ color: '#5865F2' }} />
            <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--theme-muted)' }}>Cor da Tarefa</span>
          </div>
          <div className="flex items-center gap-1">
            {color && (
              <button 
                onClick={handleClear}
                className="p-1 rounded transition-colors"
                style={{ color: 'var(--theme-subtle)' }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.backgroundColor = 'var(--theme-hover)'; 
                  e.currentTarget.style.color = 'inherit'; 
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.backgroundColor = 'transparent'; 
                  e.currentTarget.style.color = 'var(--theme-subtle)'; 
                }}
                title="Restaurar Padrão"
              >
                <RotateCcw size={14} strokeWidth={2.5} />
              </button>
            )}
            <button 
              onClick={(e) => { e.stopPropagation(); onClose(); }}
              className="p-1 rounded transition-colors hover:bg-red-500/20 hover:text-red-500"
              style={{ color: 'var(--theme-subtle)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--theme-subtle)'; }}
            >
              <X size={14} strokeWidth={2.5} />
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

        <div className="grid grid-cols-5 gap-1.5 pt-3 border-t" style={{ borderColor: 'var(--theme-border)' }}>
          {PRESET_COLORS.map(preset => (
            <button
              key={preset}
              onClick={(e) => { e.stopPropagation(); onChange(preset); }}
              className={`w-full aspect-square rounded transition-all hover:scale-110 border ${color === preset ? 'scale-105 shadow-sm' : 'border-transparent shadow-inner'}`}
              style={{ 
                backgroundColor: preset,
                borderColor: color === preset ? 'inherit' : 'transparent'
              }}
              title={preset}
            />
          ))}
        </div>
      </div>
    </SmartPopover>
  );
}