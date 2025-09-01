import { useEffect, useState } from "react";

/**
 * Custom debounce hook
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in ms (default 500ms)
 * @returns {any} - Debounced value
 */

function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    if (delay <= 0) {
      // If delay is invalid, update immediately
      setDebouncedValue(value);
      return;
    }

    const timer = setTimeout(() => setDebouncedValue(value), delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
