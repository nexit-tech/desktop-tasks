'use client';

import { useState, useMemo } from 'react';
import { useTaskSystem } from '@/hooks/useTaskSystem';
import { useWindowState } from '@/hooks/useWindowState';
import Header from './Header';
import Settings from './Settings';
import TaskItem from './TaskItem';
import InputBar from './InputBar';
import ResizeHandle from './ResizeHandle';
import { ListTodo, Sparkles } from 'lucide-react';
import ColorPickerPopover from './ui/ColorPickerPopover';
import DatePickerPopover from './ui/DatePickerPopover';
import { filterActiveTree } from '@/utils/treeHelpers';
import { getContrastColor } from '@/utils/colorHelpers';

export default function TaskApp() {
  useWindowState();
  const { tasks, config, isReady, addTask, updateTaskProp, removeTask, setConfig } = useTaskSystem();

  const [showSettings, setShowSettings] = useState(false);
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);

  const [activePopover, setActivePopover] = useState<{
    type: 'color' | 'date';
    nodeId: string;
    value: string;
  } | null>(null);

  const activeTasks = useMemo(() => filterActiveTree(tasks), [tasks]);

  if (!isReady) return null;

  const actions = {
    update: updateTaskProp,
    removeTask,
    setFocused: setFocusedTaskId
  };

  const handleOpenPopover = (type: 'color' | 'date', nodeId: string, value: string) => {
    setActivePopover({ type, nodeId, value });
  };

  const handleClosePopover = () => setActivePopover(null);

  const textColor = getContrastColor(config.bgColor);
  const isDarkText = textColor === '#111214';

  return (
    <main 
      className="flex flex-col h-screen overflow-hidden shadow-2xl relative transition-colors duration-300"
      style={{ 
        backgroundColor: config.bgColor, 
        color: textColor,
        opacity: config.opacity,
        borderRadius: '8px',
        border: `1px solid ${config.accentColor || 'var(--theme-border)'}`,
        '--theme-hover': isDarkText ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
        '--theme-focus': isDarkText ? 'rgba(0,0,0,0.09)' : 'rgba(255,255,255,0.09)',
        '--theme-border': isDarkText ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.08)',
        '--theme-muted': isDarkText ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)',
        '--theme-subtle': isDarkText ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)'
      } as React.CSSProperties}
    >
      <Header 
        showSettings={showSettings} 
        onToggleSettings={() => setShowSettings(!showSettings)} 
      />

      <div className="flex-1 px-1.5 pt-1.5 pb-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {showSettings ? (
          <Settings 
            config={config} 
            onUpdateConfig={setConfig} 
            onClose={() => setShowSettings(false)} 
          />
        ) : (
          <div className="space-y-[1px]">
            {activeTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center mt-24 opacity-60 gap-3 animate-in fade-in duration-500">
                <div className="relative">
                  <Sparkles size={16} className="absolute -top-4 -right-4 opacity-80 animate-pulse" style={{ color: 'currentColor' }} />
                  <ListTodo size={42} strokeWidth={1.5} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-center mt-2" style={{ color: 'var(--theme-muted)' }}>
                  Nenhuma tarefa pendente<br/><span className="text-[10px] font-normal opacity-70">Adicione algo para começar.</span>
                </span>
              </div>
            )}
            {activeTasks.map(node => (
              <TaskItem 
                key={node.id} 
                node={node} 
                level={0} 
                focusedTaskId={focusedTaskId} 
                actions={actions}
                onOpenPopover={handleOpenPopover}
              />
            ))}
          </div>
        )}
      </div>

      {!showSettings && (
        <InputBar 
          focusedTaskId={focusedTaskId}
          onAdd={(text) => addTask(text, focusedTaskId)}
          onCancelFocus={() => setFocusedTaskId(null)}
        />
      )}

      {activePopover?.type === 'color' && (
        <ColorPickerPopover 
          color={activePopover.value}
          onChange={(newColor) => {
            updateTaskProp(activePopover.nodeId, { color: newColor });
            setActivePopover(prev => prev ? {...prev, value: newColor} : null);
          }}
          onClose={handleClosePopover}
        />
      )}

      {activePopover?.type === 'date' && (
        <DatePickerPopover 
          currentDate={activePopover.value}
          onSelect={(newDate) => {
             updateTaskProp(activePopover.nodeId, { dueDate: newDate });
             handleClosePopover();
          }}
          onClose={handleClosePopover}
        />
      )}

      <ResizeHandle />
    </main>
  );
}