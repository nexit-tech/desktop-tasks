import { TaskNode } from '@/types';
import { formatDate, isOverdue } from '@/utils/dateHelpers';
import { 
  ChevronRight, ChevronDown, Check, Circle, 
  CornerDownRight, Trash2, Calendar, Palette, Archive
} from 'lucide-react';

interface TaskItemProps {
  node: TaskNode;
  level: number;
  focusedTaskId: string | null;
  actions: {
    update: (id: string, updates: Partial<TaskNode>) => void;
    removeTask: (id: string) => void;
    setFocused: (id: string) => void;
  };
  onOpenPopover: (type: 'color' | 'date', nodeId: string, currentValue: string) => void;
}

export default function TaskItem({ node, level, focusedTaskId, actions, onOpenPopover }: TaskItemProps) {
  const isDone = node.done;
  const isOver = isOverdue(node.dueDate);

  const indentSize = 24;
  const paddingLeft = level * indentSize + 8; 
  const collapseIconPos = level * indentSize;
  
  const taskColor = node.color || undefined;
  const displayColor = isDone ? (taskColor || 'currentColor') : taskColor;

  return (
    <div className="relative">
      <div 
        className={`group relative flex items-start py-1.5 px-2 my-[1px] rounded transition-colors duration-150 border border-transparent cursor-pointer
          ${focusedTaskId === node.id ? 'bg-[var(--theme-focus)]' : 'hover:bg-[var(--theme-hover)]'}
          ${isDone ? 'opacity-60 hover:opacity-100' : 'opacity-100'}
        `}
        style={{ paddingLeft: `${paddingLeft + 24}px` }}
        onClick={(e) => {
             e.stopPropagation();
             actions.setFocused(node.id);
        }}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); actions.update(node.id, { collapsed: !node.collapsed }); }}
          className={`absolute p-0.5 mt-0.5 transition-colors duration-150 z-20 hover:bg-[var(--theme-hover)] rounded
            ${node.children && node.children.length === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          style={{ left: `${collapseIconPos}px`, color: 'var(--theme-muted)' }}
        >
          {node.collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); actions.update(node.id, { done: !node.done }); }} 
          className="mr-3 mt-[3px] transition-transform duration-200 active:scale-75 z-10 shrink-0 relative flex items-center justify-center"
          style={{ color: isDone ? displayColor : (displayColor || 'var(--theme-muted)') }}
        >
          {isDone ? (
            <Check size={18} strokeWidth={3} className="animate-in zoom-in duration-200" />
          ) : (
            <Circle size={18} strokeWidth={2} className="opacity-70 group-hover:opacity-100 transition-opacity" />
          )}
        </button>

        <div className="flex-1 flex flex-col min-w-0 justify-center">
          <div className="flex flex-col gap-0.5 relative">
            <input 
              type="text"
              value={node.text}
              onChange={(e) => actions.update(node.id, { text: e.target.value })}
              className={`text-[13px] font-medium bg-transparent outline-none w-full break-words whitespace-pre-wrap transition-colors duration-200
                ${isDone ? 'line-through' : ''}
              `}
              style={{ 
                color: displayColor || 'inherit',
                textDecorationColor: displayColor || 'inherit'
              }}
            />
            
            {node.dueDate && !isDone && (
              <button 
                onClick={(e) => { e.stopPropagation(); onOpenPopover('date', node.id, node.dueDate || ''); }}
                className={`text-[10px] px-1.5 py-0.5 rounded-sm flex items-center gap-1 font-bold w-fit transition-colors duration-150 mt-0.5
                  ${isOver ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-[var(--theme-hover)] hover:bg-[var(--theme-focus)]'}`}
                style={{ color: isOver ? '' : 'var(--theme-subtle)' }}
              >
                <Calendar size={10} strokeWidth={2.5} />
                {formatDate(node.dueDate)}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-0.5 pl-2 relative opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150 self-start mt-0.5">
          <button 
            onClick={(e) => { e.stopPropagation(); onOpenPopover('color', node.id, node.color || ''); }}
            className="p-1 rounded transition-colors hover:bg-[var(--theme-hover)]"
            style={{ color: taskColor || 'var(--theme-muted)' }}
            title="Cor da Tarefa"
          >
            <Palette size={14} />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onOpenPopover('date', node.id, node.dueDate || ''); }}
            className="p-1 rounded transition-colors hover:bg-[var(--theme-hover)]"
            style={{ color: node.dueDate ? 'inherit' : 'var(--theme-muted)' }}
            title="Definir Data"
          >
            <Calendar size={14} />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); actions.setFocused(node.id); }}
            title="Criar Sub-tarefa"
            className="p-1 rounded transition-colors hover:bg-[var(--theme-hover)]"
            style={{ color: 'var(--theme-muted)' }}
          >
            <CornerDownRight size={14} />
          </button>

          {isDone ? (
            <button 
              onClick={(e) => { e.stopPropagation(); actions.update(node.id, { archived: true }); }}
              title="Arquivar Tarefa Concluída"
              className="p-1 rounded transition-colors hover:bg-emerald-500/20 text-emerald-500"
            >
              <Archive size={14} />
            </button>
          ) : (
            <button 
              onClick={(e) => { e.stopPropagation(); actions.removeTask(node.id); }}
              title="Excluir"
              className="p-1 rounded transition-colors hover:bg-red-500/20 text-red-500"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className={`overflow-hidden transition-all duration-200 ease-in-out ${node.collapsed ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100'}`}>
        {!node.collapsed && node.children && node.children.length > 0 && (
          <div className="relative">
            <div 
                className="absolute top-0 bottom-1 w-[1px]" 
                style={{ 
                  left: `${level * indentSize + 22}px`,
                  backgroundColor: 'var(--theme-border)'
                }} 
            />
            {node.children.map(child => (
              <TaskItem 
                key={child.id} 
                node={child} 
                level={level + 1} 
                focusedTaskId={focusedTaskId} 
                actions={actions}
                onOpenPopover={onOpenPopover}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}