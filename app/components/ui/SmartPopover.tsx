import { useEffect, ReactNode } from 'react';

interface SmartPopoverProps {
  onClose: () => void;
  children: ReactNode;
}

export default function SmartPopover({ onClose, children }: SmartPopoverProps) {
  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center w-screen h-screen">
      
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
      />
      
      <div className="relative z-10 bg-[#1e1f22] border border-white/10 rounded-2xl shadow-2xl animate-in zoom-in-95 fade-in duration-200 overflow-hidden max-w-[95vw] max-h-[90vh] flex flex-col">
        {children}
      </div>
    </div>
  );
}