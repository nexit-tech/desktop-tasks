import { useWindowResize } from '@/hooks/useWindowResize';

export default function ResizeHandle() {
  const { handleResizeMouseDown } = useWindowResize();

  return (
    <div 
      onMouseDown={handleResizeMouseDown}
      className="absolute bottom-0 right-0 w-5 h-5 cursor-nwse-resize z-50 flex items-end justify-end p-1 text-white/10 hover:text-white/40 transition-colors"
      title="Arraste para redimensionar"
    >
      <svg 
        width="8" 
        height="8" 
        viewBox="0 0 10 10" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M9 5L5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}