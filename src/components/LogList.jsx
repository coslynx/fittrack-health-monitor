import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '../context/AppContext.jsx';
import LogItem from './LogItem.jsx'; // Assume LogItem exists and accepts { item: {id, name, calories} }

/**
 * @component LogList
 * @description
 * Displays the list of daily logged food items. It retrieves the `log` array
 * from the shared `AppContext`. Each item in the log is expected to be an object
 * with the shape `{ id: string, name: string, calories: number }`.
 * The component handles cases where the log data is invalid or empty,
 * and renders a `LogItem` component for each valid entry.
 */
function LogList() {
  // Consume the application context to access the shared log state
  const { log } = useContext(AppContext);

  // --- Data Validation and Conditional Rendering ---

  // Check if the log data received from context is a valid array
  if (!Array.isArray(log)) {
    // Log a warning for development purposes if data is malformed
    console.warn('[LogList] Log data received from context is not an array:', log);
    // Render a user-friendly error message
    return (
      <div>
        <h2 className="mb-4 text-xl font-semibold text-gray-700">Daily Log</h2>
        <p className="text-sm text-red-500">Error: Could not load log data.</p>
      </div>
    );
  }

  // --- Render Logic ---

  return (
    <div>
      {/* Consistent heading style */}
      <h2 className="mb-4 text-xl font-semibold text-gray-700">Daily Log</h2>

      {/* Conditional rendering based on log content */}
      {log.length === 0 ? (
        // Display message when the log is empty
        <p className="text-sm text-gray-500">
          No food items logged yet today.
        </p>
      ) : (
        // Render the list of log items if the log is not empty
        <div className="space-y-2">
          {' '}
          {/* Container for list items with vertical spacing */}
          {log.map((item) => {
            // Defensive check: Ensure item and item.id exist before rendering
            // Although AppContext likely ensures this, belt-and-suspenders approach is safer.
            if (!item || typeof item.id === 'undefined' || item.id === null) {
              console.warn('[LogList] Invalid log item found:', item);
              return null; // Skip rendering this invalid item
            }
            // Render the LogItem component for each valid log entry
            // Pass the entire item object and use its id as the unique key
            return <LogItem key={item.id} item={item} />;
          })}
        </div>
      )}
    </div>
  );
}

// Define prop types for the component.
// LogList relies solely on context, so it doesn't accept direct props.
LogList.propTypes = {};

// Export the component for use in other parts of the application
export default LogList;