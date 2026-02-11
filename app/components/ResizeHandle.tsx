import { useWindowResize } from '@/hooks/useWindowResize';

export default function ResizeHandle() {
  const { handleResizeMouseDown } = useWindowResize();

  return (
    <div 
      onMouseDown={handleResizeMouseDown}
      className="absolute bottom-0 right-0 w-8 h-8 cursor-nwse-resize z-50 opacity-0"
      title="Arraste para redimensionar"
    />
  );
}