import { appWindow, LogicalSize } from '@tauri-apps/api/window';
import { MouseEvent } from 'react';

export const useWindowResize = () => {
  const handleResizeMouseDown = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const startX = e.screenX;
    const startY = e.screenY;
    
    const factor = await appWindow.scaleFactor();
    const physicalSize = await appWindow.innerSize();
    const startWidth = physicalSize.width / factor;
    const startHeight = physicalSize.height / factor;

    let animationFrameId: number;

    const handleMouseMove = (ev: globalThis.MouseEvent) => {
      ev.preventDefault();
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(async () => {
        const deltaX = ev.screenX - startX;
        const deltaY = ev.screenY - startY;

        await appWindow.setSize(
          new LogicalSize(
            Math.max(400, startWidth + deltaX),
            Math.max(300, startHeight + deltaY)
          )
        );
      });
    };

    const handleMouseUp = () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'nwse-resize';
  };

  return { handleResizeMouseDown };
};