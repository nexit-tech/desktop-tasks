import { appWindow, PhysicalSize } from '@tauri-apps/api/window';
import { MouseEvent as ReactMouseEvent } from 'react';

export const useWindowResize = () => {
  const handleResizeMouseDown = async (e: ReactMouseEvent) => {
    e.preventDefault();
    
    const scaleFactor = await appWindow.scaleFactor();
    const initialSize = await appWindow.innerSize();
    
    const startX = e.clientX;
    const startY = e.clientY;

    let animationFrameId: number;

    const handleMouseMove = (ev: MouseEvent) => {
      const deltaX = (ev.clientX - startX) * scaleFactor;
      const deltaY = (ev.clientY - startY) * scaleFactor;
      
      const newWidth = Math.max(initialSize.width + deltaX, 350 * scaleFactor);
      const newHeight = Math.max(initialSize.height + deltaY, 400 * scaleFactor);

      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      
      animationFrameId = requestAnimationFrame(() => {
        appWindow.setSize(new PhysicalSize(newWidth, newHeight));
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return { handleResizeMouseDown };
};