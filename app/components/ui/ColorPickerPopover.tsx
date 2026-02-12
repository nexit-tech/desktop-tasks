import React from 'react';
import { Check, X, Palette } from 'lucide-react';
import SmartPopover from './SmartPopover';

interface ColorPickerPopoverProps {
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

const PRESET_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#71717a', // Zinc
  '#ffffff', // White
];

export default function ColorPickerPopover({ color, onChange, onClose }: ColorPickerPopoverProps) {
  return (
    <SmartPopover onClose={onClose}>
      <div className="w-[280px] p-4">
        <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
          <div className="flex items-center gap-2 text-gray-200">
            <Palette size={16} />
            <span className="text-sm font-semibold">Cor da Tarefa</span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset}
              onClick={() => onChange(preset)}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 ring-2 ring-offset-2 ring-offset-[#191919]
                ${color === preset ? 'ring-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'ring-transparent hover:ring-white/20'}
              `}
              style={{ backgroundColor: preset }}
            >
              {color === preset && (
                <Check size={16} className={preset === '#ffffff' ? 'text-black' : 'text-white'} strokeWidth={3} />
              )}
            </button>
          ))}
        </div>
      </div>
    </SmartPopover>
  );
}