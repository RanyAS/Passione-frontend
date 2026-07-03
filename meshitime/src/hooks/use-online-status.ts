import { useEffect, useState } from 'react';

export function useOnlineStatus() {
  const [isConnected, setIsConnected] = useState(() =>
    typeof window === 'undefined' ? true : window.navigator.onLine,
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const updateStatus = () => {
      setIsConnected(window.navigator.onLine);
    };

    updateStatus();
    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);

    return () => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
    };
  }, []);

  return isConnected;
}
