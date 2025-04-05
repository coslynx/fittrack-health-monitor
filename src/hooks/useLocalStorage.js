import { useState, useEffect } from 'react';

/**
 * A custom React hook that persists state in localStorage.
 * Mimics the useState API but synchronizes with localStorage.
 * Handles potential errors during storage access and JSON operations gracefully.
 * Ensures safety during server-side rendering (SSR) by avoiding direct window/localStorage access.
 *
 * @template T The type of the state value being stored.
 * @param {string} key The key under which the value is stored in localStorage.
 * @param {T} initialValue The initial value to use if no value is found in localStorage,
 *                         if localStorage is unavailable (e.g., SSR, security restrictions),
 *                         or if the stored value is invalid JSON.
 * @returns {[T, (value: T | ((prevState: T) => T)) => void]} A tuple containing the current state
 *                                                            value and a function to update it,
 *                                                            similar to React.useState.
 */
function useLocalStorage(key, initialValue) {
  // State initialization using the lazy initializer function form of useState.
  // This ensures localStorage access happens only once on mount, not on every render.
  const [storedValue, setStoredValue] = useState(() => {
    // Check if running in a browser environment where window is defined.
    if (typeof window === 'undefined') {
      // During SSR or in environments without window, return the initial value.
      return initialValue;
    }

    try {
      // Attempt to retrieve the item from localStorage using the provided key.
      const item = window.localStorage.getItem(key);

      // If an item exists, try to parse it as JSON.
      if (item !== null) {
        try {
          return JSON.parse(item);
        } catch (parseError) {
          // If parsing fails (invalid JSON), log an error and return the initial value.
          console.error(
            `[useLocalStorage] Error parsing localStorage key "${key}":`,
            parseError
          );
          return initialValue;
        }
      } else {
        // If the item does not exist in localStorage, return the initial value.
        return initialValue;
      }
    } catch (storageError) {
      // If accessing localStorage itself fails (e.g., due to security settings),
      // log the error and return the initial value.
      console.error(
        `[useLocalStorage] Error reading localStorage key "${key}":`,
        storageError
      );
      return initialValue;
    }
  });

  // Effect to persist state changes back to localStorage.
  // Runs after the initial render and whenever the key or the storedValue changes.
  useEffect(() => {
    // Check if running in a browser environment.
    if (typeof window === 'undefined') {
      // Do nothing during SSR or in environments without window.
      return;
    }

    try {
      // Serialize the current state value to a JSON string.
      const serializedValue = JSON.stringify(storedValue);
      // Attempt to save the serialized value to localStorage under the given key.
      window.localStorage.setItem(key, serializedValue);
    } catch (error) {
      // If serialization or saving to localStorage fails (e.g., quota exceeded),
      // log the error. The component state remains unchanged.
      console.error(
        `[useLocalStorage] Error setting localStorage key "${key}":`,
        error
      );
    }
  }, [key, storedValue]); // Dependencies: Re-run effect if key or value changes.

  // Return the current state value and the setter function, mirroring the useState API.
  return [storedValue, setStoredValue];
}

export default useLocalStorage;