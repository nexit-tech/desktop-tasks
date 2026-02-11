import { HexColorPicker } from 'react-colorful';
import SmartPopover from './SmartPopover';

interface ColorPickerPopoverProps {
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

export default function ColorPickerPopover({ color, onChange, onClose }: ColorPickerPopoverProps) {
  return (
    <SmartPopover onClose={onClose}>
      <div className="p-4 flex flex-col items-center justify-center bg-[#1e1f22]">
        <style jsx global>{`
          .react-colorful { width: 100% !important; min-width: 240px; height: 200px !important; }
          .react-colorful__saturation { border-radius: 8px 8px 0 0; }
          .react-colorful__hue { height: 24px; border-radius: 0 0 8px 8px; margin-top: 8px; }
          .react-colorful__pointer { width: 20px; height: 20px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); }
        `}</style>
        
        <HexColorPicker color={color} onChange={onChange} />
        
        <div className="mt-4 flex items-center gap-2 bg-black/40 p-2 rounded-lg border border-white/5 w-full">
          <div 
            className="w-8 h-8 rounded border border-white/10 shadow-sm" 
            style={{ backgroundColor: color }}
          />
          <div className="flex flex-col flex-1">
             <input 
                type="text" 
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="bg-transparent text-sm text-white font-mono w-full outline-none uppercase"
            />
          </div>
        </div>
      </div>
    </SmartPopover>
  );
}