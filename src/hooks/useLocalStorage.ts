import { useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
) {
  const [value, setValue] = useState<T>(() => {
    try {
      const savedValue = window.localStorage.getItem(key);

      if (savedValue !== null) {
        return JSON.parse(savedValue) as T;
      }

      return initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(
        key,
        JSON.stringify(value),
      );
    } catch {
      // Ignore storage errors.
    }
  }, [key, value]);

  return [value, setValue] as const;
}