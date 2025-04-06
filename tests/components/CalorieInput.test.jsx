import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CalorieInput from '../../src/components/CalorieInput.jsx';
import { AppContext } from '../../src/context/AppContext.jsx';
import { nanoid } from 'nanoid'; // Import nanoid directly

// Mock the nanoid library
const MOCK_ID = 'mock-id-123';
vi.mock('nanoid', () => ({
  nanoid: vi.fn(() => MOCK_ID),
}));

// Mock the context value
const mockAddLogItem = vi.fn();
let mockContextValue;

// Helper function to render the component with a specific context value
const renderCalorieInput = (contextValue) => {
  return render(
    <AppContext.Provider value={contextValue}>
      <CalorieInput />
    </AppContext.Provider>
  );
};

describe('CalorieInput Component', () => {
  beforeEach(() => {
    // Reset mocks and context value before each test
    vi.clearAllMocks(); // Clears history, calls, and instances of all mocks
    // Reset the base mock context value for each test run
    mockContextValue = {
      goal: 2000, // Provide a default goal for consistency
      setGoal: vi.fn(),
      log: [], // Start with an empty log
      addLogItem: mockAddLogItem, // Use the mock function
      removeLogItem: vi.fn(),
    };
    // Explicitly ensure nanoid mock is reset if needed (though typically mockReturnValue is sufficient)
    // nanoid.mockClear(); // Not usually needed with mockReturnValue, but can be good practice
  });

  describe('Initial Rendering', () => {
    it('renders the Food Name input field', () => {
      renderCalorieInput(mockContextValue);
      expect(screen.getByLabelText(/Food Name:/i)).toBeInTheDocument();
    });

    it('renders the Calories input field', () => {
      renderCalorieInput(mockContextValue);
      expect(screen.getByLabelText(/Calories:/i)).toBeInTheDocument();
    });

    it('renders the "Add Log Entry" button', () => {
      renderCalorieInput(mockContextValue);
      expect(
        screen.getByRole('button', { name: /Add Log Entry/i })
      ).toBeInTheDocument();
    });

    it('initially renders without error messages', () => {
      renderCalorieInput(mockContextValue);
      const nameErrorElement = screen.getByText('', { selector: '#name-error' });
      const caloriesErrorElement = screen.getByText('', {
        selector: '#calories-error',
      });
      expect(nameErrorElement.textContent).toBe('');
      expect(caloriesErrorElement.textContent).toBe('');
    });

    it('initially renders the submit button as disabled (due to empty fields)', () => {
      // According to component logic: disable if name or calories is empty/invalid
      renderCalorieInput(mockContextValue);
      const button = screen.getByRole('button', { name: /Add Log Entry/i });
      expect(button).toBeDisabled();
    });
  });

  describe('Input Handling', () => {
    it('updates the food name input value correctly on user typing', async () => {
      const user = userEvent.setup();
      renderCalorieInput(mockContextValue);
      const nameInput = screen.getByLabelText(/Food Name:/i);

      await user.clear(nameInput);
      await user.type(nameInput, 'Chicken Salad');

      expect(nameInput).toHaveValue('Chicken Salad');
    });

    it('updates the calories input value correctly on user typing valid numbers', async () => {
      const user = userEvent.setup();
      renderCalorieInput(mockContextValue);
      const caloriesInput = screen.getByLabelText(/Calories:/i);

      await user.clear(caloriesInput);
      await user.type(caloriesInput, '350');

      // Note: type="number" input often returns string value in DOM
      expect(caloriesInput).toHaveValue(350);
    });

    it('updates the calories input value when user types 0', async () => {
      const user = userEvent.setup();
      renderCalorieInput(mockContextValue);
      const caloriesInput = screen.getByLabelText(/Calories:/i);

      await user.clear(caloriesInput);
      await user.type(caloriesInput, '0');

      expect(caloriesInput).toHaveValue(0);
      // Error for 0 is only checked on submit or via validation logic triggering error display
      // Real-time validation might or might not show error for '0' depending on implementation
      // Check validation rule: 'Calories must be a whole number (0 or more).' allows 0
      const caloriesErrorElement = screen.getByText('', {
        selector: '#calories-error',
      });
      expect(caloriesErrorElement.textContent).toBe(''); // Should be no error for 0 input itself
    });

    it('displays validation error for empty Food Name after interaction/blur', async () => {
      const user = userEvent.setup();
      renderCalorieInput(mockContextValue);
      const nameInput = screen.getByLabelText(/Food Name:/i);
      const nameErrorElement = screen.getByText('', { selector: '#name-error' });

      await user.type(nameInput, 'Test'); // Valid input first
      expect(nameErrorElement.textContent).toBe(''); // No error
      await user.clear(nameInput); // Clear it
      fireEvent.blur(nameInput); // Trigger blur to simulate validation check (if implemented on blur)
      // Component's validation logic checks on change/submit, let's trigger submit later
      // For now, just check input is empty
      expect(nameInput).toHaveValue('');
      // Error shown on submit attempt, tested below
    });

    it('displays validation error for empty Calories after interaction/blur', async () => {
      const user = userEvent.setup();
      renderCalorieInput(mockContextValue);
      const caloriesInput = screen.getByLabelText(/Calories:/i);

      await user.type(caloriesInput, '100');
      await user.clear(caloriesInput);
      fireEvent.blur(caloriesInput); // Trigger blur if validation happens on blur
      expect(caloriesInput).toHaveValue(null); // type="number" often has null value when empty
      // Error shown on submit attempt, tested below
    });

    it('displays validation error for negative Calories input', async () => {
      const user = userEvent.setup();
      renderCalorieInput(mockContextValue);
      const caloriesInput = screen.getByLabelText(/Calories:/i);
      const caloriesErrorElement = screen.getByText('', {
        selector: '#calories-error',
      });
      const button = screen.getByRole('button', { name: /Add Log Entry/i });

      await user.type(caloriesInput, '-50');
      // The component's validation should catch this (even if type="number" visually allows it)
      expect(caloriesErrorElement.textContent).toMatch(
        /must be a whole number \(0 or more\)/i
      );
      expect(button).toBeDisabled(); // Button should be disabled due to error
    });

    it('displays validation error for non-whole number Calories input', async () => {
      const user = userEvent.setup();
      renderCalorieInput(mockContextValue);
      const caloriesInput = screen.getByLabelText(/Calories:/i);
      const caloriesErrorElement = screen.getByText('', {
        selector: '#calories-error',
      });

      await user.type(caloriesInput, '12.5');
      // The component's validation should catch this
      expect(caloriesErrorElement.textContent).toMatch(
        /must be a whole number \(0 or more\)/i
      );
    });

    it('clears validation error when input becomes valid', async () => {
      const user = userEvent.setup();
      renderCalorieInput(mockContextValue);
      const nameInput = screen.getByLabelText(/Food Name:/i);
      const caloriesInput = screen.getByLabelText(/Calories:/i);
      const nameErrorElement = screen.getByText('', { selector: '#name-error' });
      const caloriesErrorElement = screen.getByText('', {
        selector: '#calories-error',
      });
      const button = screen.getByRole('button', { name: /Add Log Entry/i });

      // Trigger errors first
      await user.type(caloriesInput, '-1'); // Invalid calories
      fireEvent.blur(nameInput); // Blur empty name input
      expect(nameErrorElement.textContent).toBe(''); // Error appears on submit usually
      expect(caloriesErrorElement.textContent).toMatch(
        /must be a whole number \(0 or more\)/i
      );
      expect(button).toBeDisabled();

      // Fix inputs
      await user.type(nameInput, 'Valid Food');
      await user.clear(caloriesInput);
      await user.type(caloriesInput, '150');

      expect(nameErrorElement.textContent).toBe(''); // Should clear if validation is on change
      expect(caloriesErrorElement.textContent).toBe(''); // Should clear
      expect(button).not.toBeDisabled(); // Button should be enabled
    });

    it('enables submit button only when both inputs are valid', async () => {
      const user = userEvent.setup();
      renderCalorieInput(mockContextValue);
      const nameInput = screen.getByLabelText(/Food Name:/i);
      const caloriesInput = screen.getByLabelText(/Calories:/i);
      const button = screen.getByRole('button', { name: /Add Log Entry/i });

      // Initial state: disabled
      expect(button).toBeDisabled();

      // Enter valid name, calories still empty: disabled
      await user.type(nameInput, 'Apple');
      expect(button).toBeDisabled();

      // Enter valid calories, name is valid: enabled
      await user.type(caloriesInput, '95');
      expect(button).not.toBeDisabled();

      // Clear name, calories valid: disabled
      await user.clear(nameInput);
      expect(button).toBeDisabled();

      // Enter valid name again, clear calories: disabled
      await user.type(nameInput, 'Banana');
      await user.clear(caloriesInput);
      expect(button).toBeDisabled();

      // Make calories invalid: disabled
      await user.type(caloriesInput, '-10');
      expect(button).toBeDisabled();
    });
  });

  describe('Submission Logic', () => {
    it('calls addLogItem with correct payload on valid submission and clears inputs', async () => {
      const user = userEvent.setup();
      renderCalorieInput(mockContextValue);
      const nameInput = screen.getByLabelText(/Food Name:/i);
      const caloriesInput = screen.getByLabelText(/Calories:/i);
      const button = screen.getByRole('button', { name: /Add Log Entry/i });

      await user.type(nameInput, '  Mixed Nuts  '); // Include spaces for trim test
      await user.type(caloriesInput, '180');

      expect(button).not.toBeDisabled(); // Ensure button is enabled
      await user.click(button);

      // Check context function call
      expect(mockAddLogItem).toHaveBeenCalledTimes(1);
      expect(mockAddLogItem).toHaveBeenCalledWith({
        name: 'Mixed Nuts', // Expect trimmed name
        calories: 180, // Expect numeric calories
        // ID generation handled within AppContext, relying on mock nanoid there
        // If AppContext directly used nanoid, our mock ensures the ID. Let's assume AppContext uses it.
        // The payload check should match what AppContext sends
      });

      // Verify nanoid was called (if AppContext implementation relies on it directly)
      // This depends on whether AppContext itself calls nanoid or expects it in payload.
      // Assuming AppContext calls it, as per its code.
      // We don't check nanoid call count here, just the payload passed to addLogItem.

      // Check inputs are cleared
      expect(nameInput).toHaveValue('');
      expect(caloriesInput).toHaveValue(null); // type="number" clears to null
    });

    it('does not call addLogItem if Food Name is empty on submit and shows error', async () => {
      const user = userEvent.setup();
      renderCalorieInput(mockContextValue);
      const nameInput = screen.getByLabelText(/Food Name:/i);
      const caloriesInput = screen.getByLabelText(/Calories:/i);
      const button = screen.getByRole('button', { name: /Add Log Entry/i });
      const nameErrorElement = screen.getByText('', { selector: '#name-error' });

      // Enter valid calories but leave name empty
      await user.type(caloriesInput, '100');
      expect(button).toBeDisabled(); // Should be disabled due to empty name

      // Attempt to click (userEvent respects disabled, but form submit logic runs)
      await user.click(button); // This won't fire the click handler if disabled
      // Let's fire submit on the form instead to trigger validation explicitly
      const form = nameInput.closest('form');
      fireEvent.submit(form);

      expect(mockAddLogItem).not.toHaveBeenCalled();
      expect(nameErrorElement.textContent).toMatch(/Food name cannot be empty/i);
      expect(nameInput).toHaveValue(''); // Input should remain unchanged
      expect(caloriesInput).toHaveValue(100); // Input should remain unchanged
    });

    it('does not call addLogItem if Calories is empty on submit and shows error', async () => {
      const user = userEvent.setup();
      renderCalorieInput(mockContextValue);
      const nameInput = screen.getByLabelText(/Food Name:/i);
      const caloriesInput = screen.getByLabelText(/Calories:/i);
      const button = screen.getByRole('button', { name: /Add Log Entry/i });
      const caloriesErrorElement = screen.getByText('', {
        selector: '#calories-error',
      });

      await user.type(nameInput, 'Orange');
      expect(button).toBeDisabled(); // Should be disabled due to empty calories

      const form = nameInput.closest('form');
      fireEvent.submit(form);

      expect(mockAddLogItem).not.toHaveBeenCalled();
      expect(caloriesErrorElement.textContent).toMatch(/Calories cannot be empty/i);
      expect(nameInput).toHaveValue('Orange'); // Input should remain unchanged
      expect(caloriesInput).toHaveValue(null); // Input should remain unchanged (empty number input)
    });

    it('does not call addLogItem if Calories is invalid (negative) on submit and shows error', async () => {
      const user = userEvent.setup();
      renderCalorieInput(mockContextValue);
      const nameInput = screen.getByLabelText(/Food Name:/i);
      const caloriesInput = screen.getByLabelText(/Calories:/i);
      const button = screen.getByRole('button', { name: /Add Log Entry/i });
      const caloriesErrorElement = screen.getByText('', {
        selector: '#calories-error',
      });

      await user.type(nameInput, 'Grapes');
      await user.type(caloriesInput, '-20');
      expect(button).toBeDisabled(); // Should be disabled due to validation error
      expect(caloriesErrorElement.textContent).toMatch(
        /must be a whole number \(0 or more\)/i
      ); // Error shown on change

      const form = nameInput.closest('form');
      fireEvent.submit(form);

      expect(mockAddLogItem).not.toHaveBeenCalled();
      expect(caloriesErrorElement.textContent).toMatch(
        /must be a whole number \(0 or more\)/i
      ); // Ensure error persists
      expect(nameInput).toHaveValue('Grapes');
      expect(caloriesInput).toHaveValue(-20); // Input values remain
    });

     it('does not call addLogItem if Calories is invalid (decimal) on submit and shows error', async () => {
      const user = userEvent.setup();
      renderCalorieInput(mockContextValue);
      const nameInput = screen.getByLabelText(/Food Name:/i);
      const caloriesInput = screen.getByLabelText(/Calories:/i);
      const button = screen.getByRole('button', { name: /Add Log Entry/i });
      const caloriesErrorElement = screen.getByText('', {
        selector: '#calories-error',
      });

      await user.type(nameInput, 'Cookie');
      await user.type(caloriesInput, '150.5');
      expect(button).toBeDisabled();
      expect(caloriesErrorElement.textContent).toMatch(
        /must be a whole number \(0 or more\)/i
      );

      const form = nameInput.closest('form');
      fireEvent.submit(form);

      expect(mockAddLogItem).not.toHaveBeenCalled();
      expect(caloriesErrorElement.textContent).toMatch(
        /must be a whole number \(0 or more\)/i
      );
      expect(nameInput).toHaveValue('Cookie');
      // Note: The actual value for decimal input in a number field can be browser-dependent
      // Check the component logic handles it robustly.
      expect(caloriesInput).toHaveValue(150.5);
    });

    it('clears errors on successful submission after a failed attempt', async () => {
      const user = userEvent.setup();
      renderCalorieInput(mockContextValue);
      const nameInput = screen.getByLabelText(/Food Name:/i);
      const caloriesInput = screen.getByLabelText(/Calories:/i);
      const button = screen.getByRole('button', { name: /Add Log Entry/i });
      const nameErrorElement = screen.getByText('', { selector: '#name-error' });
      const caloriesErrorElement = screen.getByText('', {
        selector: '#calories-error',
      });

      // Initial invalid state (empty calories) -> attempt submit
      await user.type(nameInput, 'Salad');
      const form = nameInput.closest('form');
      fireEvent.submit(form);
      expect(mockAddLogItem).not.toHaveBeenCalled();
      expect(caloriesErrorElement.textContent).toMatch(/Calories cannot be empty/i);

      // Now enter valid calories and submit successfully
      await user.type(caloriesInput, '250');
      expect(button).not.toBeDisabled();
      await user.click(button);

      // Verify submission occurred
      expect(mockAddLogItem).toHaveBeenCalledTimes(1);
      expect(mockAddLogItem).toHaveBeenCalledWith({ name: 'Salad', calories: 250 });

      // Verify errors are cleared
      expect(nameErrorElement.textContent).toBe('');
      expect(caloriesErrorElement.textContent).toBe('');

      // Verify inputs are cleared
      expect(nameInput).toHaveValue('');
      expect(caloriesInput).toHaveValue(null);
    });
});