import React, { useContext } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppContext, AppProvider } from '../../src/context/AppContext.jsx';
import { nanoid } from 'nanoid';

// Mock the nanoid library to return a predictable ID
const MOCK_NANOID_ID = 'mock-test-id';
vi.mock('nanoid', () => ({
  nanoid: vi.fn(() => MOCK_NANOID_ID),
}));

// Define localStorage keys used by AppContext
const GOAL_STORAGE_KEY = 'fitnessAppGoal';
const LOG_STORAGE_KEY = 'fitnessAppLog';
const DEFAULT_GOAL = 2000; // Default from AppContext.jsx useLocalStorage call

// Helper component to consume and display context values/call functions
let currentContextValue = null; // Variable to capture context value for assertions
const TestConsumer = () => {
  const context = useContext(AppContext);
  currentContextValue = context; // Capture the latest context

  if (!context) {
    return <div>No Context Available</div>;
  }

  return (
    <div>
      <div data-testid="goal-display">
        Goal: {JSON.stringify(context.goal)}
      </div>
      <div data-testid="log-display">
        Log Count: {context.log?.length || 0}
      </div>
      <div data-testid="log-items">
        {/* Render item names for easier assertion */}
        {context.log?.map((item) => (
          <span key={item.id} data-testid={`log-item-${item.id}`}>
            {item.name}:{item.calories}
          </span>
        ))}
      </div>

      {/* Buttons to trigger context actions */}
      <button onClick={() => act(() => context.setGoal(2500))}>Set Goal</button>
      <button
        onClick={() =>
          act(() =>
            context.addLogItem({ name: 'Test Food', calories: 150 })
          )
        }
      >
        Add Item
      </button>
      <button
        onClick={() =>
          act(() =>
            context.addLogItem({ name: 'Another Food', calories: 250 })
          )
        }
      >
        Add Another Item
      </button>
      <button onClick={() => act(() => context.removeLogItem(MOCK_NANOID_ID))}>
        Remove Item {MOCK_NANOID_ID}
      </button>
      <button onClick={() => act(() => context.removeLogItem('non-existent-id'))}>
        Remove Non-Existent Item
      </button>
    </div>
  );
};

// Helper to render the provider with the consumer
const renderProvider = () => {
  return render(
    <AppProvider>
      <TestConsumer />
    </AppProvider>
  );
};

// --- Mock localStorage ---
let mockStorage = {};
const mockLocalStorage = {
  getItem: vi.fn((key) => mockStorage[key] || null),
  setItem: vi.fn((key, value) => {
    mockStorage[key] = value;
  }),
  removeItem: vi.fn((key) => {
    delete mockStorage[key];
  }),
  clear: vi.fn(() => {
    mockStorage = {};
  }),
};

describe('AppContext and AppProvider', () => {
  beforeEach(() => {
    // Reset localStorage mock state and spies before each test
    mockStorage = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
      mockLocalStorage.getItem
    );
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(
      mockLocalStorage.setItem
    );
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(
      mockLocalStorage.removeItem
    );
    vi.spyOn(Storage.prototype, 'clear').mockImplementation(
      mockLocalStorage.clear
    );
    // Clear call history for spies and nanoid mock
    vi.clearAllMocks();
    currentContextValue = null; // Reset context capture
  });

  afterEach(() => {
    // Restore original implementations after each test
    vi.restoreAllMocks();
  });

  describe('Initialization & Defaults', () => {
    it('should initialize goal to default value (2000) when localStorage is empty', () => {
      renderProvider();
      expect(screen.getByTestId('goal-display')).toHaveTextContent(
        `Goal: ${DEFAULT_GOAL}`
      );
      expect(localStorage.getItem).toHaveBeenCalledWith(GOAL_STORAGE_KEY);
      expect(currentContextValue.goal).toBe(DEFAULT_GOAL);
    });

    it('should initialize log to an empty array when localStorage is empty', () => {
      renderProvider();
      expect(screen.getByTestId('log-display')).toHaveTextContent('Log Count: 0');
      expect(localStorage.getItem).toHaveBeenCalledWith(LOG_STORAGE_KEY);
      expect(currentContextValue.log).toEqual([]);
    });

    it('should load and parse goal from localStorage if valid JSON exists', () => {
      mockStorage[GOAL_STORAGE_KEY] = JSON.stringify(2500);
      renderProvider();
      expect(screen.getByTestId('goal-display')).toHaveTextContent('Goal: 2500');
      expect(localStorage.getItem).toHaveBeenCalledWith(GOAL_STORAGE_KEY);
      expect(currentContextValue.goal).toBe(2500);
    });

    it('should load and parse log from localStorage if valid JSON array exists', () => {
      const initialLog = [{ id: 'a', name: 'Test', calories: 100 }];
      mockStorage[LOG_STORAGE_KEY] = JSON.stringify(initialLog);
      renderProvider();
      expect(screen.getByTestId('log-display')).toHaveTextContent('Log Count: 1');
      expect(screen.getByTestId('log-item-a')).toHaveTextContent('Test:100');
      expect(localStorage.getItem).toHaveBeenCalledWith(LOG_STORAGE_KEY);
      expect(currentContextValue.log).toEqual(initialLog);
    });

    it('should fall back to default goal (2000) if localStorage contains invalid JSON for goal', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {}); // Suppress expected error
      mockStorage[GOAL_STORAGE_KEY] = '{invalid_json';
      renderProvider();
      expect(screen.getByTestId('goal-display')).toHaveTextContent(
        `Goal: ${DEFAULT_GOAL}`
      );
      expect(localStorage.getItem).toHaveBeenCalledWith(GOAL_STORAGE_KEY);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('[useLocalStorage] Error parsing'),
        expect.any(Error)
      );
      expect(currentContextValue.goal).toBe(DEFAULT_GOAL);
      console.error.mockRestore();
    });

    it('should fall back to default log ([]) if localStorage contains invalid JSON for log', () => {
      vi.spyOn(console, 'error').mockImplementation(() => {}); // Suppress expected error
      mockStorage[LOG_STORAGE_KEY] = '[{invalid_json';
      renderProvider();
      expect(screen.getByTestId('log-display')).toHaveTextContent('Log Count: 0');
      expect(localStorage.getItem).toHaveBeenCalledWith(LOG_STORAGE_KEY);
      expect(console.error).toHaveBeenCalledWith(
        expect.stringContaining('[useLocalStorage] Error parsing'),
        expect.any(Error)
      );
      expect(currentContextValue.log).toEqual([]);
      console.error.mockRestore();
    });

    it('should call localStorage.getItem for both keys on initial render', () => {
      renderProvider();
      expect(localStorage.getItem).toHaveBeenCalledWith(GOAL_STORAGE_KEY);
      expect(localStorage.getItem).toHaveBeenCalledWith(LOG_STORAGE_KEY);
      expect(localStorage.getItem).toHaveBeenCalledTimes(2); // Or more if useLocalStorage calls multiple times initially
    });
  });

  describe('Goal State Management', () => {
    it('should update goal value via setGoal and persist to localStorage', async () => {
      const user = userEvent.setup();
      renderProvider();

      // Initial state check
      expect(screen.getByTestId('goal-display')).toHaveTextContent(
        `Goal: ${DEFAULT_GOAL}`
      );

      // Act: Click button to call setGoal(2500)
      const setGoalButton = screen.getByRole('button', { name: 'Set Goal' });
      await act(async () => {
        await user.click(setGoalButton);
      });

      // Assert state update in consumer
      expect(screen.getByTestId('goal-display')).toHaveTextContent('Goal: 2500');
      expect(currentContextValue.goal).toBe(2500);

      // Assert localStorage persistence
      expect(localStorage.setItem).toHaveBeenCalledWith(
        GOAL_STORAGE_KEY,
        JSON.stringify(2500)
      );
      // Check it was called at least once after the initial setup potentially triggered by useEffect
      expect(localStorage.setItem).toHaveBeenCalledTimes(
        expect.any(Number) // Exact count depends on useEffect timing in useLocalStorage
      );
      expect(mockLocalStorage.getItem(GOAL_STORAGE_KEY)).toBe(
        JSON.stringify(2500)
      );
    });

     it('should ignore invalid values passed to setGoal', async () => {
        const user = userEvent.setup();
        renderProvider();
        vi.spyOn(console, 'warn').mockImplementation(() => {}); // Suppress expected warning

        // Call setGoal with invalid values directly via captured context
        act(() => currentContextValue.setGoal(-100));
        expect(screen.getByTestId('goal-display')).toHaveTextContent(`Goal: ${DEFAULT_GOAL}`);
        expect(localStorage.setItem).not.toHaveBeenCalledWith(GOAL_STORAGE_KEY, JSON.stringify(-100));

        act(() => currentContextValue.setGoal(0));
        expect(screen.getByTestId('goal-display')).toHaveTextContent(`Goal: ${DEFAULT_GOAL}`);
         expect(localStorage.setItem).not.toHaveBeenCalledWith(GOAL_STORAGE_KEY, JSON.stringify(0));

        act(() => currentContextValue.setGoal(NaN));
        expect(screen.getByTestId('goal-display')).toHaveTextContent(`Goal: ${DEFAULT_GOAL}`);
         expect(localStorage.setItem).not.toHaveBeenCalledWith(GOAL_STORAGE_KEY, JSON.stringify(NaN));

        act(() => currentContextValue.setGoal(null));
        expect(screen.getByTestId('goal-display')).toHaveTextContent(`Goal: ${DEFAULT_GOAL}`);
         expect(localStorage.setItem).not.toHaveBeenCalledWith(GOAL_STORAGE_KEY, JSON.stringify(null));

        expect(console.warn).toHaveBeenCalledTimes(4); // Called for each invalid attempt
        console.warn.mockRestore();
     });
  });

  describe('Log State Management (addLogItem)', () => {
    it('should add a new item to the log via addLogItem', async () => {
      const user = userEvent.setup();
      renderProvider();

      // Initial state
      expect(screen.getByTestId('log-display')).toHaveTextContent('Log Count: 0');

      // Act: Click button to call addLogItem
      const addItemButton = screen.getByRole('button', { name: 'Add Item' });
      await act(async () => {
        await user.click(addItemButton);
      });

      // Assert state update
      expect(screen.getByTestId('log-display')).toHaveTextContent('Log Count: 1');
      const addedItemElement = screen.getByTestId(`log-item-${MOCK_NANOID_ID}`);
      expect(addedItemElement).toBeInTheDocument();
      expect(addedItemElement).toHaveTextContent('Test Food:150');

      // Assert context value structure
      expect(currentContextValue.log).toHaveLength(1);
      expect(currentContextValue.log[0]).toEqual({
        id: MOCK_NANOID_ID,
        name: 'Test Food',
        calories: 150,
      });

      // Assert nanoid mock was used
      expect(nanoid).toHaveBeenCalledTimes(1);
    });

    it('should persist the updated log to localStorage after adding an item', async () => {
      const user = userEvent.setup();
      renderProvider();

      const addItemButton = screen.getByRole('button', { name: 'Add Item' });
      await act(async () => {
        await user.click(addItemButton);
      });

      const expectedLog = [
        { id: MOCK_NANOID_ID, name: 'Test Food', calories: 150 },
      ];

      expect(localStorage.setItem).toHaveBeenCalledWith(
        LOG_STORAGE_KEY,
        JSON.stringify(expectedLog)
      );
      expect(mockLocalStorage.getItem(LOG_STORAGE_KEY)).toBe(
        JSON.stringify(expectedLog)
      );
    });

    it('should add multiple items correctly', async () => {
      const user = userEvent.setup();
      renderProvider();

      const addItemButton = screen.getByRole('button', { name: 'Add Item' });
      const addAnotherItemButton = screen.getByRole('button', {
        name: 'Add Another Item',
      });

      // Add first item
      await act(async () => {
        await user.click(addItemButton);
      });
      // Add second item (nanoid will be called again, mock returns same ID)
      // Let's change mock implementation for second call if needed, or test based on context impl
      // Assuming nanoid is called inside handleAddLogItem each time:
      // We need to update the mock to return different IDs for subsequent calls if necessary
      // For simplicity, assume MOCK_NANOID_ID applies to both additions for this test
      await act(async () => {
        await user.click(addAnotherItemButton);
      });

      expect(screen.getByTestId('log-display')).toHaveTextContent('Log Count: 2');
      // If nanoid mock always returns the same ID, only the last item might "appear" uniquely testable by ID.
      // Let's check the structure based on order.
       expect(currentContextValue.log).toHaveLength(2);
       expect(currentContextValue.log[0]).toEqual(expect.objectContaining({ name: 'Test Food', calories: 150, id: MOCK_NANOID_ID }));
       expect(currentContextValue.log[1]).toEqual(expect.objectContaining({ name: 'Another Food', calories: 250, id: MOCK_NANOID_ID }));

       const expectedLog = [
           { id: MOCK_NANOID_ID, name: 'Test Food', calories: 150 },
           { id: MOCK_NANOID_ID, name: 'Another Food', calories: 250 },
       ];
        expect(localStorage.setItem).toHaveBeenLastCalledWith(
            LOG_STORAGE_KEY,
            JSON.stringify(expectedLog)
        );
    });

     it('should ignore invalid items passed to addLogItem', async () => {
        renderProvider();
        vi.spyOn(console, 'warn').mockImplementation(() => {}); // Suppress expected warning

         // Invalid name
        act(() => currentContextValue.addLogItem({ name: '  ', calories: 100 }));
        expect(currentContextValue.log).toHaveLength(0);
        expect(localStorage.setItem).not.toHaveBeenCalledWith(LOG_STORAGE_KEY, expect.anything());

        // Invalid calories (negative)
        act(() => currentContextValue.addLogItem({ name: 'Bad Cal', calories: -50 }));
        expect(currentContextValue.log).toHaveLength(0);

        // Invalid calories (NaN)
        act(() => currentContextValue.addLogItem({ name: 'Bad Cal 2', calories: NaN }));
         expect(currentContextValue.log).toHaveLength(0);

         expect(console.warn).toHaveBeenCalledTimes(3);
         console.warn.mockRestore();
     });
  });

  describe('Log State Management (removeLogItem)', () => {
    const initialLog = [
      { id: 'other-id', name: 'Keep Me', calories: 200 },
      { id: MOCK_NANOID_ID, name: 'Remove Me', calories: 50 },
    ];

    beforeEach(() => {
      // Pre-populate localStorage for removal tests
      mockStorage[LOG_STORAGE_KEY] = JSON.stringify(initialLog);
    });

    it('should remove an existing item from the log via removeLogItem', async () => {
      const user = userEvent.setup();
      renderProvider(); // Renders with pre-populated log from mockStorage

      // Verify initial state
      expect(screen.getByTestId('log-display')).toHaveTextContent('Log Count: 2');
      expect(
        screen.getByTestId(`log-item-${MOCK_NANOID_ID}`)
      ).toBeInTheDocument();
      expect(screen.getByTestId(`log-item-other-id`)).toBeInTheDocument();
      expect(currentContextValue.log).toEqual(initialLog);

      // Act: Click button to call removeLogItem
      const removeItemButton = screen.getByRole('button', {
        name: `Remove Item ${MOCK_NANOID_ID}`,
      });
      await act(async () => {
        await user.click(removeItemButton);
      });

      // Assert state update
      expect(screen.getByTestId('log-display')).toHaveTextContent('Log Count: 1');
      expect(
        screen.queryByTestId(`log-item-${MOCK_NANOID_ID}`)
      ).not.toBeInTheDocument();
      expect(screen.getByTestId(`log-item-other-id`)).toBeInTheDocument(); // Ensure other item remains
      expect(currentContextValue.log).toHaveLength(1);
      expect(currentContextValue.log[0].id).toBe('other-id');
    });

    it('should persist the updated log to localStorage after removing an item', async () => {
      const user = userEvent.setup();
      renderProvider();

      const removeItemButton = screen.getByRole('button', {
        name: `Remove Item ${MOCK_NANOID_ID}`,
      });
      await act(async () => {
        await user.click(removeItemButton);
      });

      const expectedLog = [{ id: 'other-id', name: 'Keep Me', calories: 200 }];

      expect(localStorage.setItem).toHaveBeenCalledWith(
        LOG_STORAGE_KEY,
        JSON.stringify(expectedLog)
      );
      expect(mockLocalStorage.getItem(LOG_STORAGE_KEY)).toBe(
        JSON.stringify(expectedLog)
      );
    });

    it('should not change log state or persist if removeLogItem is called with a non-existent ID', async () => {
      const user = userEvent.setup();
      renderProvider();

      // Verify initial state
      expect(screen.getByTestId('log-display')).toHaveTextContent('Log Count: 2');
      const initialSetItemCalls = mockLocalStorage.setItem.mock.calls.length;

      // Act: Click button to call removeLogItem with bad ID
      const removeBadItemButton = screen.getByRole('button', {
        name: 'Remove Non-Existent Item',
      });
      await act(async () => {
        await user.click(removeBadItemButton);
      });

      // Assert state hasn't changed
      expect(screen.getByTestId('log-display')).toHaveTextContent('Log Count: 2');
      expect(currentContextValue.log).toEqual(initialLog);

      // Assert localStorage.setItem wasn't called again for this action
      // Check if setItem calls increased only due to initial render/persistence logic, not the bad removal
      // It's tricky as setItem might be called by useEffect. A safer check is that the value in mockStorage hasn't changed unnecessarily.
      // We expect setItem to be called with the *same* value if the log didn't change.
       expect(localStorage.setItem).toHaveBeenLastCalledWith(LOG_STORAGE_KEY, JSON.stringify(initialLog));
    });

      it('should ignore removeLogItem calls with null or undefined ID', async () => {
        renderProvider();
        vi.spyOn(console, 'warn').mockImplementation(() => {}); // Suppress expected warning
        const initialLogState = [...currentContextValue.log]; // Capture initial log

        act(() => currentContextValue.removeLogItem(null));
        expect(currentContextValue.log).toEqual(initialLogState); // State unchanged

        act(() => currentContextValue.removeLogItem(undefined));
        expect(currentContextValue.log).toEqual(initialLogState); // State unchanged

        expect(console.warn).toHaveBeenCalledTimes(2);
        console.warn.mockRestore();
     });
  });

  describe('Persistence', () => {
    it('should re-initialize state correctly from localStorage on subsequent renders', () => {
      // Step 1: Set initial values in mock storage
      const storedGoal = 2200;
      const storedLog = [
        { id: 'persist-1', name: 'Persisted Item', calories: 300 },
      ];
      mockStorage[GOAL_STORAGE_KEY] = JSON.stringify(storedGoal);
      mockStorage[LOG_STORAGE_KEY] = JSON.stringify(storedLog);

      // Step 2: Render the provider - it should read from mock storage
      renderProvider();

      // Step 3: Assert the state reflects the stored values
      expect(screen.getByTestId('goal-display')).toHaveTextContent(
        `Goal: ${storedGoal}`
      );
      expect(screen.getByTestId('log-display')).toHaveTextContent('Log Count: 1');
      expect(screen.getByTestId('log-item-persist-1')).toHaveTextContent(
        'Persisted Item:300'
      );
      expect(currentContextValue.goal).toBe(storedGoal);
      expect(currentContextValue.log).toEqual(storedLog);

      // Verify getItem was called
      expect(localStorage.getItem).toHaveBeenCalledWith(GOAL_STORAGE_KEY);
      expect(localStorage.getItem).toHaveBeenCalledWith(LOG_STORAGE_KEY);
    });

    it('should ensure setItem is called upon state changes', async () => {
         const user = userEvent.setup();
         renderProvider();

         // Initial calls might happen from useEffect in useLocalStorage
         mockLocalStorage.setItem.mockClear();

         // Change goal
         await act(async () => {
            await user.click(screen.getByRole('button', { name: 'Set Goal'}));
         });
         expect(localStorage.setItem).toHaveBeenCalledWith(GOAL_STORAGE_KEY, JSON.stringify(2500));

         // Add item
          mockLocalStorage.setItem.mockClear(); // Clear previous goal call
         await act(async () => {
             await user.click(screen.getByRole('button', { name: 'Add Item'}));
         });
          const expectedLogAfterAdd = [{ id: MOCK_NANOID_ID, name: 'Test Food', calories: 150 }];
         expect(localStorage.setItem).toHaveBeenCalledWith(LOG_STORAGE_KEY, JSON.stringify(expectedLogAfterAdd));

         // Remove item
          mockLocalStorage.setItem.mockClear(); // Clear previous add call
          await act(async () => {
              await user.click(screen.getByRole('button', { name: `Remove Item ${MOCK_NANOID_ID}` }));
          });
          const expectedLogAfterRemove = [];
          expect(localStorage.setItem).toHaveBeenCalledWith(LOG_STORAGE_KEY, JSON.stringify(expectedLogAfterRemove));

    });
  });
});