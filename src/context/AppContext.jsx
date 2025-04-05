import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { nanoid } from 'nanoid';
// Assuming useLocalStorage hook exists and handles persistence correctly
// Note: The content of useLocalStorage.js was not provided,
// so its implementation details (like error handling within the hook) are assumed.
import { useLocalStorage } from '../hooks/useLocalStorage.js';

/**
 * @typedef {object} LogItem
 * @property {string} id - Unique identifier for the log item.
 * @property {string} name - Name of the food item.
 * @property {number} calories - Calorie count for the food item.
 */

/**
 * @typedef {object} AppContextState
 * @property {number | null} goal - The user's daily calorie goal. Null if not set or invalid initial value.
 * @property {LogItem[]} log - An array of logged food items for the current day/period.
 * @property {(newGoal: number) => void} setGoal - Function to update the daily calorie goal.
 * @property {(item: { name: string, calories: number }) => void} addLogItem - Function to add a new food item to the log.
 * @property {(itemId: string) => void} removeLogItem - Function to remove a food item from the log by its ID.
 */

/**
 * React Context for managing global application state related to fitness tracking.
 * Provides access to the daily calorie goal, the log of consumed items,
 * and functions to modify this state.
 * @type {React.Context<AppContextState>}
 */
export const AppContext = createContext(null);

/**
 * Provides the AppContext to its child components.
 * Manages the application state (calorie goal, food log) and persists it
 * using the `useLocalStorage` hook.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - The child components that will consume the context.
 * @returns {JSX.Element} The provider component wrapping the children.
 */
export function AppProvider({ children }) {
  const [goal, setStoredGoal] = useLocalStorage('fitnessAppGoal', 2000);
  const [log, setStoredLog] = useLocalStorage('fitnessAppLog', []);

  /**
   * Updates the daily calorie goal.
   * Validates the input to ensure it's a positive number before updating.
   * @param {number} newGoal - The desired new calorie goal.
   */
  const handleSetGoal = useCallback(
    (newGoal) => {
      const goalNumber = Number(newGoal);
      if (isNaN(goalNumber) || goalNumber <= 0) {
        console.warn(
          `[AppContext] Invalid goal value: ${newGoal}. Goal must be a positive number.`
        );
        return;
      }
      setStoredGoal(goalNumber);
    },
    [setStoredGoal]
  );

  /**
   * Adds a new food item to the daily log.
   * Validates the input (non-empty name, non-negative calories) before adding.
   * Generates a unique ID for the new item.
   * @param {{ name: string, calories: number }} item - The food item details.
   */
  const handleAddLogItem = useCallback(
    ({ name, calories }) => {
      const trimmedName = name?.trim(); // Use optional chaining for safety
      const calorieNumber = Number(calories);

      if (!trimmedName) {
        console.warn(
          '[AppContext] Invalid log item: Name cannot be empty.'
        );
        return;
      }
      if (isNaN(calorieNumber) || calorieNumber < 0) {
        console.warn(
          `[AppContext] Invalid log item: Calories (${calories}) must be a non-negative number.`
        );
        return;
      }

      const newItem = {
        id: nanoid(),
        name: trimmedName,
        calories: calorieNumber,
      };

      setStoredLog((prevLog) => [...prevLog, newItem]);
    },
    [setStoredLog] // nanoid is stable and doesn't need to be a dependency
  );

  /**
   * Removes a food item from the daily log based on its ID.
   * @param {string} itemId - The unique ID of the log item to remove.
   */
  const handleRemoveLogItem = useCallback(
    (itemId) => {
      if (!itemId) {
         console.warn('[AppContext] Invalid operation: Item ID required for removal.');
         return;
      }
      setStoredLog((prevLog) => prevLog.filter((item) => item.id !== itemId));
    },
    [setStoredLog]
  );

  /**
   * Memoized context value to prevent unnecessary re-renders in consumers
   * when the provider itself re-renders but the context value hasn't changed.
   * @type {AppContextState}
   */
  const contextValue = useMemo(
    () => ({
      goal: goal, // Ensure goal is consistently number or null if useLocalStorage allows nulls
      log: log || [], // Ensure log is always an array
      setGoal: handleSetGoal,
      addLogItem: handleAddLogItem,
      removeLogItem: handleRemoveLogItem,
    }),
    [goal, log, handleSetGoal, handleAddLogItem, handleRemoveLogItem]
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
}

// Define PropTypes for the AppProvider component
AppProvider.propTypes = {
  /**
   * The child components that will have access to the context.
   */
  children: PropTypes.node.isRequired,
};