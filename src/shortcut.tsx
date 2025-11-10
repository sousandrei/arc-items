import { type RefObject, useEffect } from 'react';

export function useKey(key: string, ref: RefObject<HTMLInputElement>) {
  useEffect(() => {
    const isMac = navigator.userAgent.includes('Mac');
    const handleShortcut = (event: KeyboardEvent) => {
      if (
        (isMac && event.metaKey && event.key === key) ||
        (event.ctrlKey && event.key === key)
      ) {
        event.preventDefault();
        console.log('search shortcut');
        ref.current.focus();
      }
    };
    document.addEventListener('keydown', handleShortcut);
    return () => {
      document.removeEventListener('keydown', handleShortcut);
    };
  }, [key, ref.current.focus]);
}
