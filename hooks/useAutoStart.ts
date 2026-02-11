import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';

export const useAutoStart = () => {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      invoke('check_autostart')
        .then((active) => setIsEnabled(active as boolean))
        .catch(console.error);
    }
  }, []);

  const toggleAutoStart = async () => {
    try {
      const newState = !isEnabled;
      await invoke('set_autostart', { enable: newState });
      setIsEnabled(newState);
    } catch (error) {
      console.error(error);
    }
  };

  return { isEnabled, toggleAutoStart };
};