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
    <div 
      className="p-3 pt-2 transition-colors duration-300" 
      style={{ backgroundColor: 'transparent' }}
    >
      {focusedTaskId && (
        <div className="text-[11px] mb-1.5 flex justify-between items-center px-1 animate-in slide-in-from-bottom-2 duration-200">
          <span className="flex items-center gap-1.5 font-semibold tracking-wide text-emerald-500 drop-shadow-sm">
            <CornerDownRight size={12} strokeWidth={2.5} />
            Adicionando sub-tarefa...
          </span>
          <button 
            onClick={onCancelFocus} 
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
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>
      )}
      <div className="relative group flex items-center">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={focusedTaskId ? "Digite o nome da sub-tarefa..." : "Conversar em #tarefas"}
          className="w-full text-[13px] font-medium rounded-lg py-2.5 pl-3.5 pr-10 outline-none transition-colors duration-200 placeholder:opacity-50"
          style={{ 
            backgroundColor: 'var(--theme-focus)', 
            color: 'inherit',
          }}
          autoFocus
        />
        <button 
          onClick={() => { if (text.trim()) { onAdd(text); setText(''); } }} 
          className="absolute right-1.5 p-1.5 rounded-md transition-all duration-200 flex items-center justify-center"
          style={{ 
            backgroundColor: text.trim() ? 'var(--theme-hover)' : 'transparent',
            color: text.trim() ? 'inherit' : 'var(--theme-muted)',
            transform: text.trim() ? 'scale(1)' : 'scale(0.95)'
          }}
          onMouseEnter={(e) => {
            if (!text.trim()) {
               e.currentTarget.style.color = 'inherit';
               e.currentTarget.style.backgroundColor = 'var(--theme-hover)';
            }
          }}
          onMouseLeave={(e) => {
             if (!text.trim()) {
               e.currentTarget.style.color = 'var(--theme-muted)';
               e.currentTarget.style.backgroundColor = 'transparent';
             }
          }}
        >
          <Plus size={16} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}