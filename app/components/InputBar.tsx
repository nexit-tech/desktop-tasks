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
    <div className="p-3 pt-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
      {focusedTaskId && (
        <div className="text-[10px] text-emerald-400 mb-1.5 flex justify-between items-center px-1 animate-in slide-in-from-bottom-2 duration-300">
          <span className="flex items-center gap-1 font-medium tracking-wide">
            <CornerDownRight size={10} />
            Adicionando sub-tarefa...
          </span>
          <button 
            onClick={onCancelFocus} 
            className="hover:text-white hover:bg-white/10 p-0.5 rounded transition-colors"
          >
            <X size={12} />
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
          className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/10 text-sm rounded-xl py-2.5 pl-4 pr-10 outline-none text-white placeholder-white/30 transition-all duration-300 border border-white/5 focus:border-white/20 shadow-inner focus:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          autoFocus
        />
        <button 
          onClick={() => { if (text.trim()) { onAdd(text); setText(''); } }} 
          className={`absolute right-2 p-1.5 rounded-lg transition-all duration-300 flex items-center justify-center
            ${text.trim() ? 'bg-white/10 text-white hover:bg-white/20 hover:scale-105' : 'text-white/20 hover:text-white/40'}`}
        >
          <Plus size={16} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}