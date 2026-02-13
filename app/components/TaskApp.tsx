'use client';

import { useState } from 'react';
import { useTaskSystem } from '@/hooks/useTaskSystem';
import { useWindowState } from '@/hooks/useWindowState';
import Header from './Header';
import Settings from './Settings';
import TaskItem from './TaskItem';
import InputBar from './InputBar';
import ResizeHandle from './ResizeHandle';
import { ListTodo } from 'lucide-react';
import ColorPickerPopover from './ui/ColorPickerPopover';
import DatePickerPopover from './ui/DatePickerPopover';

export default function TaskApp() {
  // Hooks de Sistema (Lógica e Persistência)
  useWindowState();
  const { tasks, config, isReady, addTask, updateTaskProp, removeTask, setConfig } = useTaskSystem();

  // Estado Local de UI
  const [showSettings, setShowSettings] = useState(false);
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);

  const [activePopover, setActivePopover] = useState<{
    type: 'color' | 'date';
    nodeId: string;
    value: string;
  } | null>(null);

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

  return (
    <main 
      className="flex flex-col h-screen overflow-hidden text-[#dbdee1] shadow-2xl relative transition-all duration-300"
      style={{ 
        backgroundColor: config.bgColor, 
        opacity: config.opacity,
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.05)'
      }}
    >
      <Header 
        showSettings={showSettings} 
        onToggleSettings={() => setShowSettings(!showSettings)} 
      />

      <div className="flex-1 px-2 pt-2 pb-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {showSettings ? (
          <Settings 
            config={config} 
            onUpdateConfig={setConfig} 
            onClose={() => setShowSettings(false)} 
          />
        ) : (
          <div className="space-y-0.5">
            {tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center mt-20 opacity-20 gap-3">
                <ListTodo size={48} strokeWidth={1.5} />
                <span className="text-xs font-bold uppercase tracking-widest">Organize seu dia</span>
              </div>
            )}
            {tasks.map(node => (
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