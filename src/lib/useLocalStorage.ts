import { useState, useEffect, SetStateAction } from "react";
// https://blog.logrocket.com/using-localstorage-react-hooks/

function getStorageValue<T>(key: string, defaultValue: T): T {
  // getting stored value
  if (typeof window === "undefined") return defaultValue; // for nextjs serverside render
  const saved = localStorage.getItem(key);
  if (!saved) return defaultValue;
  const initial = JSON.parse(saved);
  return initial ?? defaultValue;
}

export default function useLocalStorage<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    return getStorageValue(key, defaultValue);
  });

  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
