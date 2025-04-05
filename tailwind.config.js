/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}', // Scan JS, JSX, TS, and TSX files in src
  ],
  theme: {
    extend: {}, // No theme extensions needed for the MVP
  },
  plugins: [
    // No core plugins needed here for Tailwind v4 typically.
    // Add third-party plugins if necessary in the future.
  ],
};