import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GoalSetter from '../../src/components/GoalSetter.jsx';
import { AppContext } from '../../src/context/AppContext.jsx';

// Mock the context value
const mockSetGoal = vi.fn();
let mockContextValue;

// Helper function to render the component with a specific context value
const renderGoalSetter = (contextValue) => {
  return render(
    <AppContext.Provider value={contextValue}>
      <GoalSetter />
    </AppContext.Provider>
  );
};

describe('GoalSetter Component', () => {
  beforeEach(() => {
    // Reset mocks and context value before each test
    vi.clearAllMocks(); // Clears history, calls, and instances of all mocks
    // Reset the base mock context value for each test run
    mockContextValue = {
      goal: null, // Default to null for initial state tests
      setGoal: mockSetGoal,
      log: [], // Provide defaults for other context values even if not directly used
      addLogItem: vi.fn(),
      removeLogItem: vi.fn(),
    };
  });

  describe('Initial Rendering', () => {
    it('renders the input field and save button', () => {
      renderGoalSetter(mockContextValue);
      expect(
        screen.getByLabelText(/New Goal \(calories\):/i)
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /Set Goal/i })
      ).toBeInTheDocument();
    });

    it('displays the current goal when provided via context', () => {
      mockContextValue.goal = 2000;
      renderGoalSetter(mockContextValue);
      expect(
        screen.getByText(/Current Goal: 2000 calories/i)
      ).toBeInTheDocument();
    });

    it('displays "Not set" when the goal is null in context', () => {
      mockContextValue.goal = null;
      renderGoalSetter(mockContextValue);
      expect(screen.getByText(/Current Goal: Not set/i)).toBeInTheDocument();
    });

    it('displays "Not set" when the goal is 0 or invalid in context (based on component logic)', () => {
      mockContextValue.goal = 0; // Or potentially an invalid value if context could hold it
      renderGoalSetter(mockContextValue);
      // Based on GoalSetter logic: goal > 0 ? `${goal} calories` : 'Not set'
      expect(screen.getByText(/Current Goal: Not set/i)).toBeInTheDocument();
    });

    it('initially renders without an error message', () => {
      renderGoalSetter(mockContextValue);
      const errorElement = screen.getByText('', { selector: '#goal-error' }); // Get the error p tag
      expect(errorElement).toBeInTheDocument();
      expect(errorElement.textContent).toBe('');
    });

    it('initially renders the submit button as disabled if input is empty', () => {
      renderGoalSetter(mockContextValue);
      const button = screen.getByRole('button', { name: /Set Goal/i });
      expect(button).toBeDisabled();
    });
  });

  describe('Input Handling', () => {
    it('updates the input field value correctly on user typing', async () => {
      const user = userEvent.setup();
      renderGoalSetter(mockContextValue);
      const input = screen.getByLabelText(/New Goal \(calories\):/i);

      await user.clear(input);
      await user.type(input, '2500');

      expect(input).toHaveValue(2500);
    });

    it('displays validation error for non-positive numbers', async () => {
      const user = userEvent.setup();
      renderGoalSetter(mockContextValue);
      const input = screen.getByLabelText(/New Goal \(calories\):/i);
      const errorElement = screen.getByText('', { selector: '#goal-error' });

      await user.clear(input);
      await user.type(input, '0');
      expect(input).toHaveValue(0);
      expect(errorElement.textContent).toMatch(
        /must be a positive whole number/i
      );
      expect(
        screen.getByRole('button', { name: /Set Goal/i })
      ).toBeDisabled(); // Button should be disabled due to error

      await user.clear(input);
      await user.type(input, '-100');
      expect(input).toHaveValue(-100);
      expect(errorElement.textContent).toMatch(
        /must be a positive whole number/i
      );
      expect(
        screen.getByRole('button', { name: /Set Goal/i })
      ).toBeDisabled();
    });

    it('displays validation error for empty input after interaction', async () => {
      const user = userEvent.setup();
      renderGoalSetter(mockContextValue);
      const input = screen.getByLabelText(/New Goal \(calories\):/i);
      const errorElement = screen.getByText('', { selector: '#goal-error' });

      await user.type(input, '1'); // Type something valid first
      expect(errorElement.textContent).toBe(''); // Error clears
      await user.clear(input); // Then clear it
      expect(input).toHaveValue(null); // Or potentially '' depending on browser with type=number
      expect(errorElement.textContent).toMatch(/Goal cannot be empty/i);
      expect(
        screen.getByRole('button', { name: /Set Goal/i })
      ).toBeDisabled();
    });

    it('clears validation error when input becomes valid', async () => {
      const user = userEvent.setup();
      renderGoalSetter(mockContextValue);
      const input = screen.getByLabelText(/New Goal \(calories\):/i);
      const errorElement = screen.getByText('', { selector: '#goal-error' });

      await user.type(input, '0'); // Invalid input, shows error
      expect(errorElement.textContent).toMatch(
        /must be a positive whole number/i
      );

      await user.clear(input);
      await user.type(input, '2100'); // Valid input
      expect(input).toHaveValue(2100);
      expect(errorElement.textContent).toBe(''); // Error clears
      expect(
        screen.getByRole('button', { name: /Set Goal/i })
      ).not.toBeDisabled(); // Button should be enabled
    });

    it('disables the submit button if the input value matches the current goal', async () => {
        const user = userEvent.setup();
        mockContextValue.goal = 2000;
        renderGoalSetter(mockContextValue);
        const input = screen.getByLabelText(/New Goal \(calories\):/i);
        const button = screen.getByRole('button', { name: /Set Goal/i });

        await user.clear(input);
        await user.type(input, '2000'); // Type the same value as the current goal
        expect(input).toHaveValue(2000);
        expect(button).toBeDisabled(); // Should be disabled because value hasn't changed

        await user.type(input, '1'); // Change the value slightly
        expect(input).toHaveValue(20001); // Note: typing '1' appends
        await user.clear(input);         // Let's clear and re-type for clarity
        await user.type(input, '2001');
        expect(input).toHaveValue(2001);
        expect(button).not.toBeDisabled(); // Should be enabled now
    });

  });

  describe('Goal Submission', () => {
    it('calls setGoal context function with the correct numeric value on valid submission', async () => {
      const user = userEvent.setup();
      renderGoalSetter(mockContextValue);
      const input = screen.getByLabelText(/New Goal \(calories\):/i);
      const button = screen.getByRole('button', { name: /Set Goal/i });

      await user.clear(input);
      await user.type(input, '2500');
      expect(button).not.toBeDisabled(); // Ensure button is enabled before click

      await user.click(button);

      expect(mockSetGoal).toHaveBeenCalledTimes(1);
      expect(mockSetGoal).toHaveBeenCalledWith(2500);
    });

    it('does not call setGoal if the input is empty on submit attempt', async () => {
      const user = userEvent.setup();
      renderGoalSetter(mockContextValue);
      const input = screen.getByLabelText(/New Goal \(calories\):/i);
      const button = screen.getByRole('button', { name: /Set Goal/i });
      const errorElement = screen.getByText('', { selector: '#goal-error' });

      await user.clear(input); // Ensure input is empty
      expect(button).toBeDisabled(); // Should already be disabled

      // Attempt to click even if disabled (userEvent might allow, good to check mock)
      // Or submit the form directly if easier
      // await user.click(button); // This might not fire if truly disabled

      // Instead, let's simulate form submission directly
      const form = input.closest('form');
      expect(form).toBeInTheDocument();
      if (form) {
        form.submit(); // Note: This might not trigger React event handlers perfectly. userEvent.click is preferred.
        // Let's stick to clicking the button, assuming userEvent respects disabled state generally,
        // but we check the mock call count which is the ultimate source of truth for the action.
        // If we ensure the button IS disabled via expect(button).toBeDisabled(), we can infer it wasn't clicked effectively.
      }


      expect(mockSetGoal).not.toHaveBeenCalled();
      // Check if error is displayed upon attempted submit if empty
      // The onSubmit handler sets error if empty
      // Note: Simulating direct form.submit() doesn't run React onSubmit, so clicking button is better test
       await user.click(button); // Re-attempt click - userEvent handles disabled state correctly. It won't fire the event.
      // We rely on the fact the button IS disabled and mock hasn't been called
      expect(mockSetGoal).not.toHaveBeenCalled();
       expect(errorElement.textContent).toMatch(/Goal cannot be empty/i); // Verify error is shown


    });

    it('does not call setGoal if the input is invalid (e.g., 0) on submit', async () => {
      const user = userEvent.setup();
      renderGoalSetter(mockContextValue);
      const input = screen.getByLabelText(/New Goal \(calories\):/i);
      const button = screen.getByRole('button', { name: /Set Goal/i });
      const errorElement = screen.getByText('', { selector: '#goal-error' });

      await user.clear(input);
      await user.type(input, '0');
      expect(button).toBeDisabled(); // Button disabled due to validation error
       expect(errorElement.textContent).toMatch(/must be a positive whole number/i);

      await user.click(button); // Attempt click

      expect(mockSetGoal).not.toHaveBeenCalled();
    });

    it('does not call setGoal if the input value equals the current goal on submit', async () => {
        const user = userEvent.setup();
        mockContextValue.goal = 1800;
        renderGoalSetter(mockContextValue);
        const input = screen.getByLabelText(/New Goal \(calories\):/i);
        const button = screen.getByRole('button', { name: /Set Goal/i });

        await user.clear(input);
        await user.type(input, '1800');
        expect(button).toBeDisabled(); // Disabled because value matches current goal

        await user.click(button); // Attempt click

        expect(mockSetGoal).not.toHaveBeenCalled();
    });

     it('clears the error message on successful submission', async () => {
        const user = userEvent.setup();
        renderGoalSetter(mockContextValue);
        const input = screen.getByLabelText(/New Goal \(calories\):/i);
        const button = screen.getByRole('button', { name: /Set Goal/i });
        const errorElement = screen.getByText('', { selector: '#goal-error' });

        // Create an error state first
        await user.type(input, '-5');
        expect(errorElement.textContent).toMatch(/must be a positive whole number/i);

        // Now correct it and submit
        await user.clear(input);
        await user.type(input, '2200');
        expect(errorElement.textContent).toBe(''); // Error cleared on valid input
        expect(button).not.toBeDisabled();

        await user.click(button);

        expect(mockSetGoal).toHaveBeenCalledWith(2200);
        expect(errorElement.textContent).toBe(''); // Ensure error is still clear after submit
     });

});