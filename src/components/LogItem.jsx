import React from 'react';
import PropTypes from 'prop-types';

/**
 * @component LogItem
 * @description Renders a single entry from the daily food log, displaying the
 *              food item's name and its corresponding calorie count.
 *              Includes basic validation for the item prop.
 * @param {{ item: { id: string, name: string, calories: number } }} props - Component props.
 * @param {object} props.item - The log item object to display.
 * @param {string} props.item.id - Unique identifier for the log item.
 * @param {string} props.item.name - Name of the food item.
 * @param {number} props.item.calories - Calorie count for the food item.
 * @returns {JSX.Element|null} The rendered log item or null if the item prop is invalid.
 */
function LogItem({ item }) {
  // Defensive check for the item prop and its required nested properties
  if (
    !item ||
    typeof item.id !== 'string' ||
    typeof item.name !== 'string' ||
    typeof item.calories !== 'number' ||
    item.calories < 0 // Ensure calories are non-negative as per validation elsewhere
  ) {
    console.warn(
      '[LogItem] Invalid item prop received. Expected object with { id: string, name: string, calories: number (non-negative) }.',
      item // Log the received item for debugging
    );
    return null; // Render nothing if the prop structure is invalid
  }

  return (
    <div
      className="flex items-center justify-between border-b border-gray-100 py-2 last:border-b-0" // Add slight padding and border for separation
      role="listitem" // Add ARIA role for better semantics within the LogList
    >
      {/* Display food name */}
      <span className="truncate text-sm text-gray-700" title={item.name}>
        {item.name}
      </span>

      {/* Display calorie count */}
      <span className="ml-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {item.calories} kcal
      </span>
    </div>
  );
}

// Define prop types for the component for type checking and documentation
LogItem.propTypes = {
  /**
   * The log item object containing details to display.
   */
  item: PropTypes.shape({
    /**
     * Unique identifier for the log item (used for the key in LogList).
     */
    id: PropTypes.string.isRequired,
    /**
     * The name of the logged food item.
     */
    name: PropTypes.string.isRequired,
    /**
     * The calorie count of the logged food item (should be a non-negative number).
     */
    calories: PropTypes.number.isRequired,
  }).isRequired,
};

export default LogItem;