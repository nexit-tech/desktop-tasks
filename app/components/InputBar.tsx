import { useState, KeyboardEvent } from 'react';
import { Plus, CornerDownRight, X } from 'lucide-react';

interface InputBarProps {
  onAdd: (text: string) => void;
  focusedTaskId: string | null;
  onCancelFocus: () => void;
}

export default function InputBar({ onAdd, focusedTaskId, onCancelFocus }: InputBarProps) {
  const [text, setText] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && text.trim()) {
      onAdd(text);
      setText('');
    } else if (e.key === 'Escape') {
      onCancelFocus();
    }
  };

  return (
    <div className="p-3 pt-0 bg-transparent font-sans">
      {focusedTaskId && (
        <div className="text-[10px] text-[#5865F2] mb-1.5 flex justify-between items-center px-1 animate-in slide-in-from-bottom-2 duration-200">
          <span className="flex items-center gap-1 font-bold tracking-wide uppercase">
            <CornerDownRight size={12} strokeWidth={2.5} />
            Adicionando sub-tarefa...
          </span>
          <button 
            onClick={onCancelFocus} 
            className="opacity-50 hover:opacity-100 hover:bg-black/10 p-1 rounded-md transition-all"
            style={{ color: 'inherit' }}
          >
            <X size={12} strokeWidth={2.5} />
          </button>
        </div>
      )}
      <div className="relative group flex items-center">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={focusedTaskId ? "Digite o nome da sub-tarefa..." : "O que precisa ser feito?"}
          className="w-full bg-black/10 hover:bg-black/20 focus:bg-black/20 text-sm font-medium rounded-lg py-2.5 pl-4 pr-10 outline-none transition-all duration-200 border border-black/5 focus:border-[#5865F2]/50 shadow-sm placeholder-current"
          style={{ color: 'inherit' }}
          autoFocus
        />
        <button 
          onClick={() => { if (text.trim()) { onAdd(text); setText(''); } }} 
          className={`absolute right-2 p-1.5 rounded-md transition-all duration-200 flex items-center justify-center
            ${text.trim() ? 'bg-[#5865F2] text-white hover:bg-[#4752C4] shadow-sm scale-100' : 'opacity-30 hover:opacity-60 scale-95'}`}
          style={!text.trim() ? { color: 'inherit' } : {}}
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}