#!/usr/bin/env bash
#
# startup.sh
#
# Convenience script to start the Vite development server for the
# health-fit-goal-tracker React application.
#
# Assumes execution from the project root directory where package.json resides.
# Requires Node.js and npm to be installed and available in the PATH.

# Exit immediately if a command exits with a non-zero status.
# Exit immediately if a pipeline fails.
# Exit immediately if an unset variable is used.
set -euo pipefail

# Execute the 'dev' script defined in package.json using npm.
# This command will start the Vite development server.
# All output from the 'npm run dev' command will be shown in the console.
npm run dev