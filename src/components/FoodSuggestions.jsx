import React from 'react';
import PropTypes from 'prop-types';
// Assuming suggestions data is exported as a named export 'suggestions'
// Adjust the import path if the actual file structure differs slightly, but based
// on the provided structure, this relative path is correct.
import { suggestions } from '../data/suggestions.js';

/**
 * @component FoodSuggestions
 * @description Displays a static list of predefined food suggestions.
 * Fetches data from `src/data/suggestions.js` and handles cases where
 * the data might be missing, invalid, or empty.
 */
function FoodSuggestions() {
  // --- Data Validation and Conditional Rendering ---

  // Check 1: Is the imported 'suggestions' data a valid array?
  if (!Array.isArray(suggestions)) {
    // Log a warning for development visibility
    console.warn(
      '[FoodSuggestions] Suggestions data imported from ../data/suggestions.js is not a valid array:',
      suggestions
    );
    // Render a user-friendly error message, maintaining component structure
    return (
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-700">
          Food Suggestions
        </h2>
        <p className="text-sm text-red-500">Could not load suggestions.</p>
      </div>
    );
  }

  // Check 2: Is the suggestions array empty?
  const isEmpty = suggestions.length === 0;

  // --- Render Logic ---

  return (
    <div>
      {/* Consistent heading style as seen in other components */}
      <h2 className="mb-4 text-xl font-semibold text-gray-700">
        Food Suggestions
      </h2>

      {isEmpty ? (
        // Display message when the suggestions list is empty
        <p className="text-sm text-gray-500">
          No suggestions available currently.
        </p>
      ) : (
        // Render the list of suggestions if the array is valid and not empty
        // Using ul/li for semantic list structure
        <ul className="space-y-2">
          {suggestions.map((suggestion, index) => (
            // Validate that suggestion is a string before rendering
            typeof suggestion === 'string' ? (
              <li
                key={index} // Using index as key is acceptable for a static, non-reordering list
                className="text-sm text-gray-600" // Consistent text style
              >
                {suggestion}
              </li>
            ) : (
              // Handle unexpected data types within the array gracefully
              // Log a warning and skip rendering this specific item
              (() => {
                console.warn(
                  `[FoodSuggestions] Invalid item type found in suggestions array at index ${index}. Expected string, got:`,
                  typeof suggestion
                );
                return null; // Don't render non-string items
              })()
            )
          ))}
        </ul>
      )}
    </div>
  );
}

// Define prop types for consistency, even though none are used directly.
// This adheres to the pattern seen in GoalSetter, LogList, etc.
FoodSuggestions.propTypes = {};

// Export the component for use in App.jsx
export default FoodSuggestions;