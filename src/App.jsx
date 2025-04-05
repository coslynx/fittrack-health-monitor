import React from 'react';
import { AppProvider } from './context/AppContext.jsx';
import GoalSetter from './components/GoalSetter.jsx';
import ProgressDisplay from './components/ProgressDisplay.jsx';
import CalorieInput from './components/CalorieInput.jsx';
import LogList from './components/LogList.jsx';
import FoodSuggestions from './components/FoodSuggestions.jsx';

function App() {
  // Access the app title from environment variables, providing a fallback
  const appTitle = import.meta.env.VITE_APP_TITLE || 'Fitness Goal Tracker';

  return (
    // AppProvider wraps the entire application to provide global state context
    <AppProvider>
      <div className="min-h-screen bg-gray-50 font-sans antialiased">
        <div className="container mx-auto p-4 md:p-6 lg:p-8">
          <header className="mb-8">
            <h1 className="text-center text-3xl font-bold text-green-700 md:text-4xl">
              {appTitle}
            </h1>
          </header>

          <main className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Left Column: Goal Setting and Progress */}
            <section className="space-y-6 md:col-span-1">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <GoalSetter />
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <ProgressDisplay />
              </div>
            </section>

            {/* Middle Column: Calorie Input and Log */}
            <section className="space-y-6 md:col-span-1">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <CalorieInput />
              </div>
              <div className="rounded-lg bg-white p-6 shadow-md">
                <LogList />
              </div>
            </section>

            {/* Right Column: Food Suggestions */}
            <section className="md:col-span-1">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <FoodSuggestions />
              </div>
            </section>
          </main>

          <footer className="mt-12 border-t border-gray-200 pt-6 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} {appTitle}. MVP.</p>
          </footer>
        </div>
      </div>
    </AppProvider>
  );
}

export default App;