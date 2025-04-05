import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '../context/AppContext.jsx';

/**
 * @component ProgressDisplay
 * @description Displays the user's daily calorie intake progress relative to their set goal.
 * Reads the necessary data (`goal` and `log`) from the shared `AppContext`.
 */
function ProgressDisplay() {
  // Consume the application context to access global state
  const { goal, log } = useContext(AppContext);

  // --- Calculations ---

  // Calculate total consumed calories defensively and memoize the result
  // This prevents recalculation on every render unless the log changes.
  const totalConsumedCalories = useMemo(() => {
    // Ensure log is an array before attempting to reduce
    if (!Array.isArray(log)) {
      console.warn('[ProgressDisplay] Log data is not an array:', log);
      return 0;
    }
    return log.reduce((sum, item) => {
      // Safely access calories and convert to number
      const calories = Number(item?.calories);
      // Add only if it's a valid, non-negative number; otherwise, add 0
      return sum + (isNaN(calories) || calories < 0 ? 0 : calories);
    }, 0);
  }, [log]); // Dependency array: only recalculate when 'log' changes

  // Determine if the goal is valid (a positive number)
  const isGoalValid = typeof goal === 'number' && goal > 0;

  // Calculate remaining calories only if the goal is valid
  // Result can be positive, zero, or negative. Use null if goal is invalid.
  const remainingCalories = isGoalValid ? goal - totalConsumedCalories : null;

  // Determine display text and styling for remaining calories
  let remainingDisplay;
  if (isGoalValid && remainingCalories !== null) {
    // Apply different text colors based on whether the user is under/at goal or over
    const remainingClassName = `font-medium ${
      remainingCalories >= 0 ? 'text-green-700' : 'text-red-600'
    }`;
    remainingDisplay = (
      <span className={remainingClassName}>{remainingCalories} calories</span>
    );
  } else {
    // Display indication that remaining calories cannot be calculated without a valid goal
    remainingDisplay = (
      <span className="font-medium text-gray-400">N/A (Goal not set)</span>
    );
  }

  // Determine display text for the goal, consistent with GoalSetter
  const goalDisplay = isGoalValid ? `${goal} calories` : 'Not set';

  // --- Render Logic ---

  return (
    <div>
      {/* Heading consistent with GoalSetter */}
      <h2 className="mb-4 text-xl font-semibold text-gray-700">
        Progress Summary
      </h2>

      {/* Display Consumed Calories */}
      <p className="mb-2 text-sm text-gray-600">
        Consumed:{' '}
        <span className="font-medium">{totalConsumedCalories} calories</span>
      </p>

      {/* Display Remaining Calories (conditionally styled/messaged) */}
      <p className="mb-2 text-sm text-gray-600">
        Remaining: {remainingDisplay}
      </p>

      {/* Display Set Goal */}
      <p className="text-sm text-gray-600">
        Goal: <span className="font-medium">{goalDisplay}</span>
      </p>
    </div>
  );
}

// Define prop types for the component.
// Since ProgressDisplay relies primarily on context for its data,
// it doesn't have specific props requiring validation here.
ProgressDisplay.propTypes = {};

export default ProgressDisplay;