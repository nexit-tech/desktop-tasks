import { useState, useEffect, useRef, useCallback } from 'react';
import { writeTextFile, readTextFile, exists, createDir, BaseDirectory } from '@tauri-apps/api/fs';
import { appWindow } from '@tauri-apps/api/window';
import { TaskNode, AppConfig } from '@/types';
import { generateId, updateTree, deleteFromTree, addToTree } from '@/utils/treeHelpers';
import { supabase } from '@/lib/supabase';

const DATA_FILE = 'tasks_tree.json';
const CONFIG_FILE = 'config.json';
const SAVE_DELAY = 800;

export const useTaskSystem = () => {
  const [tasks, setTasks] = useState<TaskNode[]>([]);
  const [config, setConfig] = useState<AppConfig>({ 
    bgColor: '#191919', 
    opacity: 0.95,
    accentColor: 'rgba(255,255,255,0.05)'
  });
  const [isReady, setIsReady] = useState(false);
  
  const tasksTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const configTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const tasksRef = useRef(tasks);
  const configRef = useRef(config);

  useEffect(() => { tasksRef.current = tasks; }, [tasks]);
  useEffect(() => { configRef.current = config; }, [config]);

  useEffect(() => {
    const load = async () => {
      try {
        let localConfig = { bgColor: '#191919', opacity: 0.95, accentColor: 'rgba(255,255,255,0.05)' };
        let localTasks: TaskNode[] = [];

        if (await exists(CONFIG_FILE, { dir: BaseDirectory.AppData })) {
          const txt = await readTextFile(CONFIG_FILE, { dir: BaseDirectory.AppData });
          localConfig = { ...localConfig, ...JSON.parse(txt) };
        }
        if (await exists(DATA_FILE, { dir: BaseDirectory.AppData })) {
          const txt = await readTextFile(DATA_FILE, { dir: BaseDirectory.AppData });
          localTasks = JSON.parse(txt);
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data: remoteData, error } = await supabase
            .from('app_data')
            .select('tasks, config')
            .eq('user_id', session.user.id)
            .single();

          if (!error && remoteData) {
            localTasks = remoteData.tasks || localTasks;
            localConfig = { ...localConfig, ...(remoteData.config || {}) };
            
            await ensureDataDir();
            await writeTextFile(DATA_FILE, JSON.stringify(localTasks), { dir: BaseDirectory.AppData });
            await writeTextFile(CONFIG_FILE, JSON.stringify(localConfig), { dir: BaseDirectory.AppData });
          }
        }

        setConfig(localConfig);
        configRef.current = localConfig;
        setTasks(localTasks);
        tasksRef.current = localTasks;

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

  const syncWithSupabase = async (tasksData: TaskNode[], configData: AppConfig) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      await supabase.from('app_data').upsert({
        user_id: session.user.id,
        tasks: tasksData,
        config: configData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });
    } catch (err) {
      console.error('Failed to sync with Supabase:', err);
    }
  };

  const saveTasksToDisk = async (data: TaskNode[]) => {
    try {
      await ensureDataDir();
      await writeTextFile(DATA_FILE, JSON.stringify(data), { dir: BaseDirectory.AppData });
      await syncWithSupabase(data, configRef.current);
    } catch (err) {
      console.error('Failed to save tasks:', err);
    }
  };

  const saveConfigToDisk = async (data: AppConfig) => {
    try {
      await ensureDataDir();
      await writeTextFile(CONFIG_FILE, JSON.stringify(data), { dir: BaseDirectory.AppData });
      await syncWithSupabase(tasksRef.current, data);
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
    const newNode: TaskNode = { 
      id: generateId(), 
      text, 
      done: false, 
      collapsed: false, 
      children: [],
      createdAt: new Date().toISOString()
    };
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