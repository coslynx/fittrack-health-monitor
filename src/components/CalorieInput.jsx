import React, { useState, useContext } from 'react';
import { nanoid } from 'nanoid';
import { AppContext } from '../context/AppContext.jsx';
import Input from './common/Input.jsx';
import Button from './common/Button.jsx';

/**
 * @component CalorieInput
 * @description Provides a form for users to input a food item name and its calorie count,
 * then add it to the daily log managed in AppContext. Includes input validation.
 */
function CalorieInput() {
  const { addLogItem } = useContext(AppContext);

  // Local state for form inputs
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');

  // Local state for validation errors
  const [nameError, setNameError] = useState('');
  const [caloriesError, setCaloriesError] = useState('');

  // --- Validation Helpers ---

  /**
   * Validates the food name input.
   * @param {string} name - The food name value.
   * @returns {string} - Error message string, or empty string if valid.
   */
  const validateName = (name) => {
    if (!name.trim()) {
      return 'Food name cannot be empty.';
    }
    return ''; // No error
  };

  /**
   * Validates the calories input.
   * @param {string} calValue - The calories value as a string.
   * @returns {string} - Error message string, or empty string if valid.
   */
  const validateCalories = (calValue) => {
    if (!calValue.trim()) {
      return 'Calories cannot be empty.';
    }
    // Check if it's a string containing only digits (non-negative integer)
    if (!/^\d+$/.test(calValue.trim())) {
      return 'Calories must be a whole number (0 or more).';
    }
    // Optional: Check if parsed value exceeds a reasonable limit if needed
    // const numericValue = parseInt(calValue.trim(), 10);
    // if (numericValue > 10000) { // Example limit
    //   return 'Calories seem unreasonably high.';
    // }
    return ''; // No error
  };

  // --- Event Handlers ---

  /**
   * Handles changes in the food name input field.
   * Updates state and performs real-time validation.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handleNameChange = (event) => {
    const newName = event.target.value;
    setFoodName(newName);
    setNameError(validateName(newName)); // Update error state based on validation
  };

  /**
   * Handles changes in the calories input field.
   * Updates state and performs real-time validation.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   */
  const handleCaloriesChange = (event) => {
    const newCalories = event.target.value;
    setCalories(newCalories);
    setCaloriesError(validateCalories(newCalories)); // Update error state
  };

  /**
   * Handles form submission to add a log item.
   * Performs final validation, calls context function, and resets form state.
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    // Perform final validation on current state values before submitting
    const currentNameError = validateName(foodName);
    const currentCaloriesError = validateCalories(calories);

    // Update error states based on final validation
    setNameError(currentNameError);
    setCaloriesError(currentCaloriesError);

    // Check if there are any errors
    if (currentNameError || currentCaloriesError) {
      return; // Stop submission if validation fails
    }

    // If validation passes, prepare and add the log item
    const trimmedName = foodName.trim();
    const parsedCalories = parseInt(calories.trim(), 10); // Already validated as integer

    // Call the context function to add the item
    addLogItem({
      name: trimmedName,
      calories: parsedCalories,
      // ID generation is handled within AppContext's addLogItem function based on its provided implementation
    });

    // Reset form fields and errors after successful submission
    setFoodName('');
    setCalories('');
    setNameError('');
    setCaloriesError('');
  };

  // --- Derived State ---

  // Determine if the submit button should be disabled
  const isSubmitDisabled =
    !foodName.trim() || // Disable if name is empty
    !calories.trim() || // Disable if calories is empty
    !!nameError || // Disable if there's a name error
    !!caloriesError; // Disable if there's a calories error

  // --- Render Logic ---

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold text-gray-700">
        Log Food Item
      </h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* Food Name Input */}
        <label
          htmlFor="food-name-input"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Food Name:
        </label>
        <Input
          type="text"
          id="food-name-input"
          name="foodName"
          placeholder="E.g., Apple"
          value={foodName}
          onChange={handleNameChange}
          required={true}
          className={`mb-1 ${nameError ? 'border-red-500' : ''}`} // Apply error border and spacing
          aria-describedby="name-error"
          aria-invalid={!!nameError}
          autoComplete="off"
        />
        {/* Name Error Message Area */}
        <p id="name-error" className="mb-2 h-4 text-sm text-red-600">
          {nameError || ''}
        </p>

        {/* Calories Input */}
        <label
          htmlFor="calories-input"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          Calories:
        </label>
        <Input
          type="number" // Use 'number' for better mobile UX, but validation handles non-integer inputs
          id="calories-input"
          name="calories"
          placeholder="E.g., 95"
          value={calories}
          onChange={handleCaloriesChange}
          required={true}
          min={0} // HTML5 validation - allow 0
          step={1} // HTML5 validation - allow whole numbers
          className={`mb-1 ${caloriesError ? 'border-red-500' : ''}`} // Apply error border and spacing
          aria-describedby="calories-error"
          aria-invalid={!!caloriesError}
          autoComplete="off"
        />
        {/* Calories Error Message Area */}
        <p id="calories-error" className="mb-4 h-4 text-sm text-red-600">
          {caloriesError || ''}
        </p>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitDisabled}
          className="w-full"
        >
          Add Log Entry
        </Button>
      </form>
    </div>
  );
}

// No external props are expected; relies on context. Consistent with GoalSetter.
CalorieInput.propTypes = {};

export default CalorieInput;