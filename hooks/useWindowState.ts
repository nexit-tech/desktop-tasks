import { useEffect, useRef } from 'react';
import { appWindow, LogicalSize, LogicalPosition } from '@tauri-apps/api/window';
import { writeTextFile, readTextFile, exists, BaseDirectory } from '@tauri-apps/api/fs';

const STATE_FILE = 'window_state.json';
const SAVE_DELAY = 1000;

interface WindowState {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const useWindowState = () => {
  const saveTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        if (await exists(STATE_FILE, { dir: BaseDirectory.AppData })) {
          const content = await readTextFile(STATE_FILE, { dir: BaseDirectory.AppData });
          const state: WindowState = JSON.parse(content);

          await appWindow.setSize(new LogicalSize(state.width, state.height));
          await appWindow.setPosition(new LogicalPosition(state.x, state.y));
        }
        
        setTimeout(() => {
           appWindow.show(); 
        }, 100);
        
      } catch (err) {
        console.error('Failed to restore window state:', err);
        appWindow.show();
      }
    };

    init();
  }, []);

  useEffect(() => {
    const saveState = async () => {
      try {
        const factor = await appWindow.scaleFactor();
        const size = await appWindow.innerSize();
        const pos = await appWindow.innerPosition();

        const logicalSize = size.toLogical(factor);
        const logicalPos = pos.toLogical(factor);

        const state: WindowState = {
          x: logicalPos.x,
          y: logicalPos.y,
          width: logicalSize.width,
          height: logicalSize.height
        };

        await writeTextFile(STATE_FILE, JSON.stringify(state), { dir: BaseDirectory.AppData });
      } catch (err) {
        console.error('Failed to save window state:', err);
      }
    };

    const handleUpdate = () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(saveState, SAVE_DELAY);
    };

    const unlistenMove = appWindow.onMoved(handleUpdate);
    const unlistenResize = appWindow.onResized(handleUpdate);

    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      unlistenMove.then(f => f());
      unlistenResize.then(f => f());
    };
  }, []);
};