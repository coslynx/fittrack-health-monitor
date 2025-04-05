import React from 'react';
import PropTypes from 'prop-types';

/**
 * A reusable input component styled with Tailwind CSS.
 *
 * Provides a consistent input field style for the application,
 * supporting various input types, disabled states, validation attributes,
 * accessibility features, and custom overrides. Designed as a controlled component.
 */
const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  name,
  id,
  disabled = false,
  required = false,
  min,
  max,
  step,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedby,
  className = '',
  ...rest // Capture any other standard input attributes (e.g., autoComplete, pattern)
}) => {
  // Define base styles applicable to all inputs
  const baseClasses =
    'block w-full rounded-md border border-gray-300 py-2 px-3 text-sm shadow-sm transition duration-150 ease-in-out focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500';

  // Define styles for the disabled state using Tailwind's disabled: variant
  const disabledClasses =
    'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 disabled:opacity-75';

  // Combine all classes, applying disabled styles conditionally and appending custom classes.
  // Ensure clean class string like in Button.jsx
  const inputClassName = `${baseClasses} ${
    disabled ? disabledClasses : ''
  } ${className}`
    .trim()
    .replace(/\s+/g, ' ');

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      name={name}
      id={id}
      disabled={disabled}
      required={required}
      min={min}
      max={max}
      step={step}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      className={inputClassName}
      {...rest} // Spread remaining props onto the input element
    />
  );
};

// Define prop types for the component for type checking and documentation
Input.propTypes = {
  /**
   * The HTML input type attribute (e.g., 'text', 'number', 'email').
   */
  type: PropTypes.string,
  /**
   * The current value of the input field (controlled component).
   */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  /**
   * Function called when the input value changes. Receives the event object.
   */
  onChange: PropTypes.func.isRequired,
  /**
   * Placeholder text displayed when the input is empty.
   */
  placeholder: PropTypes.string,
  /**
   * The name attribute for the input element, used for form submission.
   */
  name: PropTypes.string,
  /**
   * The id attribute for the input element, useful for associating labels.
   */
  id: PropTypes.string,
  /**
   * If `true`, the input field will be visually disabled and non-interactive.
   */
  disabled: PropTypes.bool,
  /**
   * If `true`, sets the HTML required attribute for form validation.
   */
  required: PropTypes.bool,
  /**
   * The minimum acceptable value (for type='number').
   */
  min: PropTypes.number,
  /**
   * The maximum acceptable value (for type='number').
   */
  max: PropTypes.number,
  /**
   * The stepping interval (for type='number').
   */
  step: PropTypes.number,
  /**
   * Defines a string value that labels the current element for accessibility.
   */
  'aria-label': PropTypes.string,
  /**
   * Identifies the element(s) that describe the object for accessibility.
   */
  'aria-describedby': PropTypes.string,
  /**
   * Additional Tailwind CSS classes to apply for customization.
   */
  className: PropTypes.string,
};

// Define default prop values
Input.defaultProps = {
  type: 'text',
  placeholder: undefined,
  name: undefined,
  id: undefined,
  disabled: false,
  required: false,
  min: undefined,
  max: undefined,
  step: undefined,
  'aria-label': undefined,
  'aria-describedby': undefined,
  className: '',
};

export default Input;