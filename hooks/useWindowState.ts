import { useEffect, useRef } from 'react';
import { appWindow, LogicalSize, LogicalPosition } from '@tauri-apps/api/window';
import { writeTextFile, readTextFile, exists, BaseDirectory, createDir } from '@tauri-apps/api/fs';

const STATE_FILE = 'window_state.json';
const SAVE_DELAY = 1000;

interface WindowState {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const useWindowState = () => {
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let unlistenMove: () => void;
    let unlistenResize: () => void;

    const init = async () => {
      try {
        if (await exists(STATE_FILE, { dir: BaseDirectory.AppData })) {
          const txt = await readTextFile(STATE_FILE, { dir: BaseDirectory.AppData });
          const state: WindowState = JSON.parse(txt);
          
          await appWindow.setSize(new LogicalSize(state.width, state.height));
          await appWindow.setPosition(new LogicalPosition(state.x, state.y));
        } else {
          // Defaults iniciais caso não exista config
          await appWindow.center();
        }

        // Garante que a janela apareça apenas após posicionar (evita flicker)
        setTimeout(() => appWindow.show(), 100);

      } catch (err) {
        console.error('Failed to load window state:', err);
        appWindow.show();
      }
    };

    const saveState = async () => {
      try {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

        saveTimeoutRef.current = setTimeout(async () => {
          try {
            const position = await appWindow.innerPosition();
            const size = await appWindow.innerSize();
            const factor = await appWindow.scaleFactor();
            const logicalPos = position.toLogical(factor);
            const logicalSize = size.toLogical(factor);

            const state: WindowState = {
              x: logicalPos.x,
              y: logicalPos.y,
              width: logicalSize.width,
              height: logicalSize.height
            };

            await createDir('', { dir: BaseDirectory.AppData, recursive: true });
            await writeTextFile(STATE_FILE, JSON.stringify(state), { dir: BaseDirectory.AppData });
          } catch (e) {
            console.error('Error saving window state:', e);
          }
        }, SAVE_DELAY);

      } catch (err) {
        console.error('Error getting window info:', err);
      }
    };

    const setupListeners = async () => {
      unlistenMove = await appWindow.onMoved(saveState);
      unlistenResize = await appWindow.onResized(saveState);
    };

    init();
    setupListeners();

    return () => {
      if (unlistenMove) unlistenMove();
      if (unlistenResize) unlistenResize();
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);
};