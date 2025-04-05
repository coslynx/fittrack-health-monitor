module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true, // Added node env for config files like this one and vite.config.js
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier', // Must be the last extension to override style rules
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    'react', // References eslint-plugin-react v7.37.5
    'react-hooks', // References eslint-plugin-react-hooks v5.2.0
  ],
  settings: {
    react: {
      version: 'detect', // Automatically detect the React version (19.1.0)
    },
  },
  rules: {
    // Disable the rule that requires React to be in scope (not needed for React 17+ and Vite)
    'react/react-in-jsx-scope': 'off',

    // Keep react/prop-types enabled as per 'plugin:react/recommended'
    // Since prop-types is a dependency, components should use PropTypes validation.
    // 'react/prop-types': 'warn', // Can be set to 'warn' or 'error' for stricter enforcement if needed

    // Add any other project-specific rule overrides here if necessary
    // e.g., 'no-console': 'warn',
  },
  // Enable reporting unused eslint-disable comments as specified in package.json lint script
  reportUnusedDisableDirectives: true,
  // Optional: Define global variables if needed (e.g., for testing environments if not handled by specific env)
  // globals: {},
  // Optional: Ignore specific files or directories
  // ignorePatterns: ['node_modules/', 'dist/', '*.config.js', '*.cjs'], // Already implicitly ignored mostly
};