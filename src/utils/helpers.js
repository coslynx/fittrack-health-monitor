/**
 * Utility module containing pure, reusable helper functions for the HealthFitGoalTracker MVP.
 * Primarily focused on input validation.
 */

/**
 * Checks if a value is a number strictly greater than 0.
 * Handles non-numeric types, NaN, and Infinity gracefully.
 * @param {*} value - The value to validate.
 * @returns {boolean} True if the value is a number and greater than 0, false otherwise.
 */
export const isValidPositiveNumber = (value) => {
  // Check if the type is number, it's not NaN, it's finite, and it's greater than 0.
  return (
    typeof value === 'number' &&
    !isNaN(value) &&
    isFinite(value) &&
    value > 0
  );
};

/**
 * Checks if a value is a string and contains non-whitespace characters after trimming.
 * Handles non-string types gracefully.
 * @param {*} value - The value to validate.
 * @returns {boolean} True if the value is a non-empty string after trimming, false otherwise.
 */
export const isNonEmptyString = (value) => {
  // Check if the type is string and if its trimmed length is greater than 0.
  return typeof value === 'string' && value.trim().length > 0;
};