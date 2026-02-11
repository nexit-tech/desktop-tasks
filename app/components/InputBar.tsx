import { useState, KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';

interface InputBarProps {
  onAdd: (text: string) => void;
  focusedTaskId: string | null;
  onCancelFocus: () => void;
}

export default function InputBar({ onAdd, focusedTaskId, onCancelFocus }: InputBarProps) {
  const [text, setText] = useState('');

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && text.trim()) {
      onAdd(text);
      setText('');
    }
  };

  return (
    <div className="p-3 pt-0 bg-gradient-to-t from-black/40 to-transparent">
      {focusedTaskId && (
        <div className="text-[10px] text-blue-400 mb-1 flex justify-between animate-in slide-in-from-bottom-2">
          <span>↳ Adicionando sub-tarefa...</span>
          <button onClick={onCancelFocus} className="hover:text-white">Cancelar</button>
        </div>
      )}
      <div className="relative group">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={focusedTaskId ? "Nova sub-tarefa..." : "Nova tarefa..."}
          className="w-full bg-white/5 hover:bg-white/10 focus:bg-white/10 text-sm rounded-lg py-2 pl-3 pr-8 outline-none text-white placeholder-white/20 transition-all border border-transparent focus:border-white/10"
          autoFocus
        />
        <button 
          onClick={() => { if (text.trim()) { onAdd(text); setText(''); } }} 
          className="absolute right-2 top-2 text-gray-500 hover:text-blue-400"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}