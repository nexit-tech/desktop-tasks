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
  const paddingLeft = level * indentSize + 12; 
  const collapseIconPos = level * indentSize + 2;
  
  const taskColor = node.color || undefined;
  const displayColor = isDone ? (taskColor || 'inherit') : taskColor;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200 relative font-sans">
      <div 
        className={`group relative flex items-start py-2.5 px-3 my-0.5 rounded-lg transition-all duration-200 border border-transparent
          ${focusedTaskId === node.id 
            ? 'bg-black/20 border-black/10 shadow-sm backdrop-blur-sm' 
            : 'hover:bg-black/10'}
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
          className={`absolute p-1 mt-0.5 opacity-40 hover:opacity-100 transition-opacity duration-200 z-20
            ${node.children && node.children.length === 0 ? 'hidden' : 'block'}`}
          style={{ left: `${collapseIconPos}px` }}
        >
          {node.collapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); actions.update(node.id, { done: !node.done }); }} 
          className="mr-3 mt-0.5 transition-all duration-300 transform active:scale-75 z-10 opacity-70 hover:opacity-100 shrink-0 relative"
          style={{ color: displayColor }}
        >
          <div className={`absolute inset-0 bg-current rounded-full transition-transform duration-300 ease-out ${isDone ? 'scale-100 opacity-20' : 'scale-0 opacity-0'}`} />
          {isDone ? <Check size={18} strokeWidth={3} className="animate-in zoom-in duration-200" /> : <Circle size={18} className="transition-transform hover:scale-110" />}
        </button>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex flex-col gap-1.5 relative">
            <input 
              type="text"
              value={node.text}
              onChange={(e) => actions.update(node.id, { text: e.target.value })}
              className={`text-sm font-medium bg-transparent outline-none w-full break-words whitespace-pre-wrap transition-all duration-300
                ${isDone ? 'opacity-50' : 'opacity-90'} 
                ${focusedTaskId === node.id ? 'opacity-100' : ''}
              `}
              style={{ 
                color: displayColor,
                textDecoration: isDone ? 'line-through' : 'none',
                textDecorationColor: 'currentColor'
              }}
            />
            
            {node.dueDate && !isDone && (
              <button 
                onClick={(e) => { e.stopPropagation(); onOpenPopover('date', node.id, node.dueDate || ''); }}
                className={`text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1.5 font-bold w-fit transition-all duration-200 uppercase tracking-wider
                  ${isOver 
                    ? 'bg-[#da373c]/20 text-[#da373c] hover:bg-[#da373c]/30 border border-[#da373c]/30' 
                    : 'bg-black/20 opacity-70 hover:opacity-100 border border-black/10'}`}
              >
                <Calendar size={10} />
                {formatDate(node.dueDate)}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center transition-all duration-200 gap-1 pl-2 relative opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 self-start">
          
          <button 
            onClick={(e) => { e.stopPropagation(); onOpenPopover('color', node.id, node.color || '#ffffff'); }}
            className="p-1.5 rounded-md transition-colors opacity-50 hover:opacity-100 hover:bg-black/20"
            style={{ color: taskColor }}
            title="Cor da Tarefa"
          >
            <Palette size={14} />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onOpenPopover('date', node.id, node.dueDate || ''); }}
            className={`p-1.5 rounded-md transition-colors hover:bg-black/20
              ${node.dueDate ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`}
            title="Definir Data"
          >
            <Calendar size={14} />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); actions.setFocused(node.id); }}
            title="Criar Sub-tarefa"
            className="p-1.5 rounded-md opacity-50 hover:opacity-100 hover:bg-black/20 transition-colors"
          >
            <CornerDownRight size={14} />
          </button>

          {isDone ? (
            <button 
              onClick={(e) => { e.stopPropagation(); actions.update(node.id, { archived: true }); }}
              title="Arquivar Tarefa Concluída"
              className="p-1.5 rounded-md opacity-50 hover:opacity-100 hover:text-[#23a559] hover:bg-[#23a559]/10 transition-colors"
            >
              <Archive size={14} />
            </button>
          ) : (
            <button 
              onClick={(e) => { e.stopPropagation(); actions.removeTask(node.id); }}
              title="Excluir"
              className="p-1.5 rounded-md opacity-50 hover:opacity-100 hover:text-[#da373c] hover:bg-[#da373c]/10 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${node.collapsed ? 'max-h-0 opacity-0' : 'max-h-[2000px] opacity-100'}`}>
        {!node.collapsed && node.children && node.children.length > 0 && (
          <div className="relative">
            <div 
                className="absolute top-0 bottom-2 w-px bg-black/10" 
                style={{ left: `${level * indentSize + 34}px` }} 
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