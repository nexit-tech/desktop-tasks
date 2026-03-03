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

const getContrastYIQ = (hexcolor: string) => {
  const color = hexcolor.replace('#', '');
  const r = parseInt(color.substring(0, 2), 16) || 0;
  const g = parseInt(color.substring(2, 2), 16) || 0;
  const b = parseInt(color.substring(4, 2), 16) || 0;
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? 'light' : 'dark';
};

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

  const theme = getContrastYIQ(config.bgColor);
  const isLight = theme === 'light';
  const textColor = isLight ? '#060607' : '#f2f3f5';
  const mutedColor = isLight ? '#4e5058' : '#b5bac1';
  
  const fixedBorderColor = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)';

  return (
    <main 
      className="flex flex-col h-screen overflow-hidden shadow-2xl relative transition-all duration-300 font-sans"
      style={{ 
        backgroundColor: config.bgColor, 
        color: textColor,
        opacity: config.opacity,
        borderRadius: '12px',
        border: `1px solid ${fixedBorderColor}`
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
            {activeTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center mt-24 gap-4 animate-in fade-in duration-500" style={{ color: mutedColor }}>
                <div className="relative opacity-60">
                  <Sparkles size={24} className="absolute -top-6 -right-6 text-[#f0b232] animate-pulse" />
                  <ListTodo size={56} strokeWidth={1.5} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-center opacity-80">
                  Seu dia está limpo.<br/>
                  <span className="text-[10px] font-medium opacity-70 normal-case tracking-normal">Adicione uma nova tarefa abaixo.</span>
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