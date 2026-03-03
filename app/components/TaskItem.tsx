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
  const displayColor = isDone ? (taskColor || '#ffffff') : taskColor;

  return (
    <div className="animate-in-up relative">
      <div 
        className={`group relative flex items-start py-2.5 px-3 my-0.5 rounded-lg transition-all duration-300 border border-transparent 
          ${focusedTaskId === node.id ? 'bg-white/10 border-white/5 shadow-sm' : 'hover:bg-white/5'}
          ${isDone ? 'opacity-50 hover:opacity-100' : 'opacity-100'}
        `}
        style={{ paddingLeft: `${paddingLeft + 24}px` }}
        onClick={(e) => {
             e.stopPropagation();
             actions.setFocused(node.id);
        }}
      >
        <button 
          onClick={(e) => { e.stopPropagation(); actions.update(node.id, { collapsed: !node.collapsed }); }}
          className={`absolute p-1 mt-0.5 text-gray-400 hover:text-white transition-colors duration-200 z-20
            ${node.children && node.children.length === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          style={{ left: `${collapseIconPos}px` }}
        >
          {node.collapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); actions.update(node.id, { done: !node.done }); }} 
          className={`mr-3 mt-0.5 transition-all duration-500 transform active:scale-75 z-10 hover:text-white shrink-0 relative`}
          style={{ color: isDone ? displayColor : (displayColor || '#52525b') }}
        >
          <div className={`absolute inset-0 bg-current rounded-full transition-transform duration-500 ease-out ${isDone ? 'scale-100 opacity-20' : 'scale-0 opacity-0'}`} />
          {isDone ? <Check size={20} strokeWidth={3} className="animate-in zoom-in duration-300" /> : <Circle size={20} className="transition-transform hover:scale-110" />}
        </button>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex flex-col gap-1 relative">
            <input 
              type="text"
              value={node.text}
              onChange={(e) => actions.update(node.id, { text: e.target.value })}
              className={`text-sm font-medium bg-transparent outline-none w-full break-words whitespace-pre-wrap transition-all duration-500
                ${isDone ? 'text-white/30' : 'text-gray-200'} 
                ${focusedTaskId === node.id ? 'text-white' : ''}
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
                className={`text-[11px] px-2 py-0.5 rounded flex items-center gap-1.5 font-bold w-fit transition-all duration-200 hover:brightness-110
                  ${isOver ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]' : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-gray-200'}`}
              >
                <Calendar size={11} />
                {formatDate(node.dueDate)}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center transition-all duration-200 gap-1 pl-2 relative opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 self-start">
          
          <button 
            onClick={(e) => { e.stopPropagation(); onOpenPopover('color', node.id, node.color || '#ffffff'); }}
            className="p-1.5 rounded transition-colors text-white/30 hover:text-white hover:bg-white/10"
            style={{ color: taskColor }}
            title="Cor da Tarefa"
          >
            <Palette size={16} />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onOpenPopover('date', node.id, node.dueDate || ''); }}
            className={`p-1.5 rounded transition-colors 
              ${node.dueDate ? 'text-white' : 'text-white/30 hover:text-white hover:bg-white/10'}`}
            title="Definir Data"
          >
            <Calendar size={16} />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); actions.setFocused(node.id); }}
            title="Criar Sub-tarefa"
            className="p-1.5 rounded text-white/30 hover:text-white hover:bg-white/10 transition-colors"
          >
            <CornerDownRight size={16} />
          </button>

          {isDone ? (
            <button 
              onClick={(e) => { e.stopPropagation(); actions.update(node.id, { archived: true }); }}
              title="Arquivar Tarefa Concluída"
              className="p-1.5 rounded text-white/30 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
            >
              <Archive size={16} />
            </button>
          ) : (
            <button 
              onClick={(e) => { e.stopPropagation(); actions.removeTask(node.id); }}
              title="Excluir"
              className="p-1.5 rounded text-white/30 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${node.collapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100'}`}>
        {!node.collapsed && node.children && node.children.length > 0 && (
          <div className="relative">
            <div 
                className="absolute top-0 bottom-2 w-px bg-white/5" 
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