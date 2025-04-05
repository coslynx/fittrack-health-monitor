import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { AppContext } from '../context/AppContext.jsx';
import Input from './common/Input.jsx';
import Button from './common/Button.jsx';

/**
 * @component GoalSetter
 * @description
 * This component provides an interface for users to view their current daily calorie goal
 * and set a new goal. It reads the current goal from `AppContext` and uses the
 * `setGoal` function from the context to update it. Includes input validation.
 */
function GoalSetter() {
  // Consume the application context to access global state and actions
  const { goal, setGoal } = useContext(AppContext);

  // Local state for the input field's value (controlled component)
  // Stored as a string to handle empty input and user typing
  const [inputValue, setInputValue] = useState('');

  // Local state for storing validation error messages for the input field
  const [error, setError] = useState('');

  // --- Event Handlers ---

  /**
   * Handles changes in the goal input field.
   * Updates the local input value state and performs real-time validation.
   * Sets or clears the error message based on validation results.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event object.
   */
  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    // Real-time validation
    if (!value) {
      setError('Goal cannot be empty.');
    } else {
      const numericValue = parseInt(value, 10);
      if (isNaN(numericValue) || numericValue <= 0) {
        setError('Goal must be a positive whole number (e.g., 1 or more).');
      } else {
        setError(''); // Clear error if valid
      }
    }
  };

  /**
   * Handles the form submission to set a new goal.
   * Prevents default form submission, performs final validation,
   * parses the input value, calls the `setGoal` context function,
   * and handles UI feedback (clearing errors).
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event object.
   */
  const handleGoalSubmit = (event) => {
    event.preventDefault(); // Prevent standard form submission/page reload

    // Final validation check before submission (redundant but safe)
    if (error || !inputValue) {
      // Ensure error is set if input is suddenly empty on submit attempt
      if (!inputValue) setError('Goal cannot be empty.');
      return; // Don't submit if there's an error or input is empty
    }

    const parsedValue = parseInt(inputValue, 10);

    // Double-check parsed value validity
    if (isNaN(parsedValue) || parsedValue <= 0) {
        setError('Goal must be a positive whole number.');
        return;
    }

    // Call the context function to update the global goal state
    setGoal(parsedValue);

    // Clear any previous errors on successful submission
    setError('');

    // Optional: Clear input field after successful submission.
    // Keeping the value provides immediate feedback that the goal was set to this number.
    // setInputValue('');
  };

  // --- Derived State for Button Disablement ---

  // Determine if the button should be disabled based on input state and context
  const isSubmitDisabled =
    !inputValue || // Disable if input is empty
    !!error || // Disable if there is a validation error
    (goal !== null && parseInt(inputValue, 10) === goal); // Disable if value hasn't changed from current goal

  // --- Render Logic ---

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-gray-700">
        Set Your Daily Goal
      </h2>
      <p className="mb-4 text-sm text-gray-600">
        Current Goal:{' '}
        <span className="font-medium">
          {goal && typeof goal === 'number' && goal > 0
            ? `${goal} calories`
            : 'Not set'}
        </span>
      </p>

      <form onSubmit={handleGoalSubmit} noValidate>
        {' '}
        {/* Use noValidate to rely on custom validation */}
        <label
          htmlFor="calorie-goal-input"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          New Goal (calories):
        </label>
        <Input
          type="number" // Use number type for semantic meaning and potential browser UI hints
          id="calorie-goal-input"
          name="calorieGoal" // Useful if the form were part of a larger standard form submission
          placeholder="E.g., 2000"
          value={inputValue}
          onChange={handleInputChange}
          required={true} // HTML5 validation attribute (though custom handles logic)
          min={1} // HTML5 validation attribute
          step={1} // HTML5 validation attribute (allow only whole numbers)
          className={`mb-2 ${error ? 'border-red-500' : ''}`} // Highlight input on error
          aria-describedby="goal-error" // Link input to its error message area
          aria-invalid={!!error} // Indicate invalid state for accessibility
          autoComplete="off" // Typically goals aren't something to autocomplete
        />
        {/* Error Message Area - Fixed height prevents layout shift */}
        <p id="goal-error" className="mb-2 h-4 text-sm text-red-600">
          {error || ''} {/* Display error or empty string */}
        </p>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitDisabled}
          className="w-full" // Make button full width within its container
        >
          Set Goal
        </Button>
      </form>
    </div>
  );
}

// Define prop types for the component.
// Since GoalSetter doesn't receive props directly but relies on context,
// the propTypes object is empty. Validation for context values happens
// within the AppContext provider or via component logic.
GoalSetter.propTypes = {};

export default GoalSetter;