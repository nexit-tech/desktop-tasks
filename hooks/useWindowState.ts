import { useEffect, useRef } from 'react';
import { appWindow, LogicalSize, LogicalPosition, currentMonitor } from '@tauri-apps/api/window';
import { writeTextFile, readTextFile, exists, BaseDirectory, createDir } from '@tauri-apps/api/fs';

const STATE_FILE = 'window_state.json';
const SAVE_DELAY = 1000;
const MIN_WIDTH = 400;
const MIN_HEIGHT = 300;

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
        let state: WindowState | null = null;

        if (await exists(STATE_FILE, { dir: BaseDirectory.AppData })) {
          const txt = await readTextFile(STATE_FILE, { dir: BaseDirectory.AppData });
          try {
            state = JSON.parse(txt);
          } catch (e) {}
        }

        const monitor = await currentMonitor();

        if (state && monitor) {
          const scaleFactor = monitor.scaleFactor;
          const monWidth = monitor.size.width / scaleFactor;
          const monHeight = monitor.size.height / scaleFactor;
          const monX = monitor.position.x / scaleFactor;
          const monY = monitor.position.y / scaleFactor;

          const w = Math.max(MIN_WIDTH, Math.min(state.width || MIN_WIDTH, monWidth));
          const h = Math.max(MIN_HEIGHT, Math.min(state.height || MIN_HEIGHT, monHeight));

          const x = Math.max(monX, Math.min(state.x || monX, monX + monWidth - w));
          const y = Math.max(monY, Math.min(state.y || monY, monY + monHeight - h));

          await appWindow.setSize(new LogicalSize(w, h));
          await appWindow.setPosition(new LogicalPosition(x, y));
        } else {
          await appWindow.setSize(new LogicalSize(MIN_WIDTH, MIN_HEIGHT));
          await appWindow.center();
        }

        setTimeout(() => appWindow.show(), 100);

      } catch (err) {
        await appWindow.setSize(new LogicalSize(MIN_WIDTH, MIN_HEIGHT));
        await appWindow.center();
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

            if (logicalSize.width < MIN_WIDTH || logicalSize.height < MIN_HEIGHT) return;

            const state: WindowState = {
              x: logicalPos.x,
              y: logicalPos.y,
              width: logicalSize.width,
              height: logicalSize.height
            };

            await createDir('', { dir: BaseDirectory.AppData, recursive: true });
            await writeTextFile(STATE_FILE, JSON.stringify(state), { dir: BaseDirectory.AppData });
          } catch (e) {}
        }, SAVE_DELAY);

      } catch (err) {}
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