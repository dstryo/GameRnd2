import { useRef, useEffect } from 'react';

export default function useKeyboard() {
  const keyMap = useRef({});

  useEffect(() => {
    const onDocumentKey = (e) => {
      keyMap.current[e.key] = e.type === 'keydown';
    };

    // Attach event listeners to handle keydown and keyup events
    const keyDownListener = (event) => onDocumentKey(event);
    const keyUpListener = (event) => onDocumentKey(event);

    // Add event listeners for keydown and keyup
    window.addEventListener('keydown', keyDownListener);
    window.addEventListener('keyup', keyUpListener);

    // Clean up by removing event listeners
    return () => {
      window.removeEventListener('keydown', keyDownListener);
      window.removeEventListener('keyup', keyUpListener);
    };
  }, []);

  return keyMap.current;
}
