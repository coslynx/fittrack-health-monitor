import React from 'react';
import PropTypes from 'prop-types';

/**
 * A reusable button component styled with Tailwind CSS.
 *
 * Provides consistent styling for buttons across the application,
 * supporting primary and secondary variants, disabled states, and custom overrides.
 */
const Button = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  variant = 'primary',
  className = '',
  ...rest // Capture any other standard button attributes
}) => {
  // Define base styles applicable to all variants
  const baseClasses =
    'inline-flex items-center justify-center border border-transparent font-medium rounded-md shadow-sm text-sm px-4 py-2 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2';

  // Define styles specific to variants and states
  let variantClasses = '';
  if (variant === 'primary') {
    variantClasses = disabled
      ? 'bg-green-600 text-white' // Base color when disabled
      : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'; // Active state colors + hover/focus
  } else if (variant === 'secondary') {
    variantClasses = disabled
      ? 'bg-gray-200 text-gray-700' // Base color when disabled
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400'; // Active state colors + hover/focus
  }

  // Define styles for the disabled state
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  // Combine all classes, ensuring custom classes are appended
  // Use trim() and replace multiple spaces to ensure clean class string
  const buttonClassName = `${baseClasses} ${variantClasses} ${disabledClasses} ${className}`
    .trim()
    .replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClassName}
      {...rest} // Spread remaining props onto the button element
    >
      {children}
    </button>
  );
};

// Define prop types for the component for type checking and documentation
Button.propTypes = {
  /**
   * The content displayed inside the button (text, icons, etc.).
   */
  children: PropTypes.node.isRequired,
  /**
   * Function to execute when the button is clicked.
   */
  onClick: PropTypes.func.isRequired,
  /**
   * The HTML button type attribute.
   */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  /**
   * If `true`, the button will be visually disabled and non-interactive.
   */
  disabled: PropTypes.bool,
  /**
   * The visual style variant of the button.
   */
  variant: PropTypes.oneOf(['primary', 'secondary']),
  /**
   * Additional Tailwind CSS classes to apply for customization.
   */
  className: PropTypes.string,
};

// Define default prop values
Button.defaultProps = {
  type: 'button',
  disabled: false,
  variant: 'primary',
  className: '',
};

export default Button;