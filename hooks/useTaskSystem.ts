import { useState, useEffect, useRef, useCallback } from 'react';
import { writeTextFile, readTextFile, exists, createDir, BaseDirectory } from '@tauri-apps/api/fs';
import { appWindow } from '@tauri-apps/api/window';
import { TaskNode, AppConfig } from '@/types';
import { generateId, updateTree, deleteFromTree, addToTree } from '@/utils/treeHelpers';

const DATA_FILE = 'tasks_tree.json';
const CONFIG_FILE = 'config.json';
const SAVE_DELAY = 800;

export const useTaskSystem = () => {
  const [tasks, setTasks] = useState<TaskNode[]>([]);
  const [config, setConfig] = useState<AppConfig>({ bgColor: '#191919', opacity: 0.95 });
  const [isReady, setIsReady] = useState(false);
  
  const tasksTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const configTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Refs para acesso síncrono no evento de fechamento
  const tasksRef = useRef(tasks);
  const configRef = useRef(config);

  useEffect(() => { tasksRef.current = tasks; }, [tasks]);
  useEffect(() => { configRef.current = config; }, [config]);

  useEffect(() => {
    const load = async () => {
      try {
        if (await exists(CONFIG_FILE, { dir: BaseDirectory.AppData })) {
          const txt = await readTextFile(CONFIG_FILE, { dir: BaseDirectory.AppData });
          const parsed = JSON.parse(txt);
          setConfig(parsed);
          configRef.current = parsed;
        }
        if (await exists(DATA_FILE, { dir: BaseDirectory.AppData })) {
          const txt = await readTextFile(DATA_FILE, { dir: BaseDirectory.AppData });
          const parsed = JSON.parse(txt);
          setTasks(parsed);
          tasksRef.current = parsed;
        }
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setIsReady(true);
      }
    };
    load();
  }, []);

  const ensureDataDir = async () => {
    try {
      await createDir('', { dir: BaseDirectory.AppData, recursive: true });
    } catch (err) {
      if (typeof err === 'string' && !err.includes('exists')) {
         console.error('Error creating dir:', err);
      }
    }
  };

  const saveTasksToDisk = async (data: TaskNode[]) => {
    try {
      await ensureDataDir();
      await writeTextFile(DATA_FILE, JSON.stringify(data), { dir: BaseDirectory.AppData });
    } catch (err) {
      console.error('Failed to save tasks:', err);
    }
  };

  const saveConfigToDisk = async (data: AppConfig) => {
    try {
      await ensureDataDir();
      await writeTextFile(CONFIG_FILE, JSON.stringify(data), { dir: BaseDirectory.AppData });
    } catch (err) {
      console.error('Failed to save config:', err);
    }
  };

  const persistTasks = useCallback((newTasks: TaskNode[]) => {
    setTasks(newTasks);
    if (tasksTimeoutRef.current) clearTimeout(tasksTimeoutRef.current);
    tasksTimeoutRef.current = setTimeout(() => saveTasksToDisk(newTasks), SAVE_DELAY);
  }, []);

  const persistConfig = useCallback((newConfig: AppConfig) => {
    setConfig(newConfig);
    if (configTimeoutRef.current) clearTimeout(configTimeoutRef.current);
    configTimeoutRef.current = setTimeout(() => saveConfigToDisk(newConfig), SAVE_DELAY);
  }, []);

  useEffect(() => {
    const unlistenPromise = appWindow.onCloseRequested(async () => {
      if (tasksTimeoutRef.current || configTimeoutRef.current) {
        await Promise.all([
            saveTasksToDisk(tasksRef.current),
            saveConfigToDisk(configRef.current)
        ]);
      }
    });
    return () => { unlistenPromise.then(unlisten => unlisten()); };
  }, []);

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

  return { 
    tasks, 
    config, 
    isReady,
    addTask, 
    updateTaskProp, 
    removeTask, 
    setConfig: persistConfig 
  };
};