import { appWindow, LogicalSize } from '@tauri-apps/api/window';
import { MouseEvent } from 'react';

export const useWindowResize = () => {
  const handleResizeMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;

    const handleMouseMove = async (ev: globalThis.MouseEvent) => {
      const deltaX = ev.clientX - startX;
      const deltaY = ev.clientY - startY;
      const size = await appWindow.innerSize();
      await appWindow.setSize(new LogicalSize(size.width + deltaX, size.height + deltaY));
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return { handleResizeMouseDown };
};