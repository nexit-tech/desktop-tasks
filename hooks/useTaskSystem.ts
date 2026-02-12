import { useState, useEffect } from 'react';
import { writeTextFile, readTextFile, exists, createDir, BaseDirectory } from '@tauri-apps/api/fs';
import { TaskNode, AppConfig } from '@/types';
import { generateId, updateTree, deleteFromTree, addToTree } from '@/utils/treeHelpers';

const DATA_FILE = 'tasks_tree.json';
const CONFIG_FILE = 'config.json';

export const useTaskSystem = () => {
  const [tasks, setTasks] = useState<TaskNode[]>([]);
  const [config, setConfig] = useState<AppConfig>({ bgColor: '#191919', opacity: 0.95 });

  useEffect(() => {
    const load = async () => {
      try {
        if (await exists(CONFIG_FILE, { dir: BaseDirectory.AppData })) {
          const txt = await readTextFile(CONFIG_FILE, { dir: BaseDirectory.AppData });
          setConfig(JSON.parse(txt));
        }
        if (await exists(DATA_FILE, { dir: BaseDirectory.AppData })) {
          const txt = await readTextFile(DATA_FILE, { dir: BaseDirectory.AppData });
          setTasks(JSON.parse(txt));
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      }
    };
    load();
  }, []);

  const ensureDataDir = async () => {
    try {
      await createDir('', { dir: BaseDirectory.AppData, recursive: true });
    } catch (err) {
      console.error('Error creating dir:', err);
    }
  };

  const persistTasks = async (newTasks: TaskNode[]) => {
    setTasks(newTasks);
    try {
      await ensureDataDir();
      await writeTextFile(DATA_FILE, JSON.stringify(newTasks), { dir: BaseDirectory.AppData });
    } catch (err) {
      console.error('Failed to save tasks:', err);
    }
  };

  const persistConfig = async (newConfig: AppConfig) => {
    setConfig(newConfig);
    try {
      await ensureDataDir();
      await writeTextFile(CONFIG_FILE, JSON.stringify(newConfig), { dir: BaseDirectory.AppData });
    } catch (err) {
      console.error('Failed to save config:', err);
    }
  };

  const addTask = (text: string, parentId: string | null) => {
    if (!text.trim()) return;
    const newNode: TaskNode = { id: generateId(), text, done: false, collapsed: false, children: [] };
    persistTasks(addToTree(tasks, parentId, newNode));
  };

  const updateTaskProp = (id: string, updates: Partial<TaskNode>) => {
    persistTasks(updateTree(tasks, id, node => ({ ...node, ...updates })));
  };

  const removeTask = (id: string) => {
    persistTasks(deleteFromTree(tasks, id));
  };

  return { tasks, config, addTask, updateTaskProp, removeTask, setConfig: persistConfig };
};