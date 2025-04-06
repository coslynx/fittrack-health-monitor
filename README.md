<div class="hero-icon" align="center">
  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" />
</div>

<h1 align="center">
health-fit-goal-tracker
</h1>
<h4 align="center">A simple web tool for tracking daily calorie intake, setting goals, and viewing food suggestions, using local browser storage.</h4>
<h4 align="center">Developed with the software and tools below.</h4>
<div class="badges" align="center">
  <img src="https://img.shields.io/badge/Framework-React_19-61DAFB?logo=react" alt="React">
  <img src="https://img.shields.io/badge/Language-JavaScript-F7DF1E?logo=javascript" alt="JavaScript">
  <img src="https://img.shields.io/badge/Styling-Tailwind_CSS_4-38B2AC?logo=tailwind-css" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Build_Tool-Vite_6-646CFF?logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/State_Management-React_Context_+_localStorage-orange" alt="State Management">
  <img src="https://img.shields.io/badge/Testing-Vitest_+_Testing_Library-99425B?logo=vitest" alt="Testing">
</div>
<div class="badges" align="center">
  <img src="https://img.shields.io/github/last-commit/coslynx/health-fit-goal-tracker?style=flat-square&color=5D6D7E" alt="git-last-commit" />
  <img src="https://img.shields.io/github/commit-activity/m/coslynx/health-fit-goal-tracker?style=flat-square&color=5D6D7E" alt="GitHub commit activity" />
  <img src="https://img.shields.io/github/languages/top/coslynx/health-fit-goal-tracker?style=flat-square&color=5D6D7E" alt="GitHub top language" />
</div>

## 📑 Table of Contents
- 📍 Overview
- 📦 Features
- 📂 Structure
- 💻 Installation
- 🏗️ Usage
- 🌐 Hosting
- 📄 License
- 👏 Authors

## 📍 Overview
The `health-fit-goal-tracker` is a lightweight, client-side Minimum Viable Product (MVP) designed for straightforward fitness tracking. It allows users to set a daily calorie goal, log food items with their calorie counts, monitor their progress throughout the day, and view simple food suggestions. All data (goals and daily logs) is stored locally in the user's browser using `localStorage`, making it a self-contained application without requiring backend infrastructure or user accounts for the MVP phase. Built with React, Vite, and Tailwind CSS for a modern, responsive user experience.

## 📦 Features
|    | Feature                     | Description                                                                                                                               |
|----|-----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------|
| 🎯 | **Goal Management**         | Users can set and view their daily calorie goal. The goal persists across browser sessions using `localStorage`.                              |
| 🍎 | **Calorie Logging**         | Allows manual entry of food items and their calorie counts. Each entry is added to a daily log.                                               |
| 📊 | **Progress Calculation**    | Automatically calculates total calories consumed from the log and displays progress towards the daily goal (consumed/remaining).            |
| 🍲 | **Food Suggestions**        | Displays a static list of basic food suggestions loaded from a predefined data file.                                                        |
| 💾 | **Client-Side Persistence** | Utilizes the browser's `localStorage` API via a custom hook (`useLocalStorage`) to store the user's goal and daily log data persistently. |
| ✨ | **UI/UX**                   | Clean, responsive user interface built with React components and styled using Tailwind CSS utility classes.                                   |
| ⚙️ | **Architecture**            | Simple, component-based frontend architecture powered by Vite. State managed globally using React Context API (`AppContext`).                 |
| 🧪 | **Testing**                 | Includes unit tests for core components (`GoalSetter`, `CalorieInput`) and context (`AppContext`) using Vitest and React Testing Library. |
| ⚡️ | **Performance**             | Lightweight client-side application optimized for fast loading and interaction, leveraging Vite's efficient build process.                 |
| 📦 | **Dependencies**            | Core dependencies include React, `nanoid` for unique ID generation. Dev dependencies cover build tools, styling, linting, and testing.    |

## 📂 Structure
```text
health-fit-goal-tracker/
├── .env
├── .eslintrc.cjs
├── .gitignore
├── .prettierrc.json
├── README.md
├── commands.json
├── index.html
├── package.json
├── postcss.config.js
├── public/
│   └── favicon.ico
├── src/
│   ├── App.jsx
│   ├── components/
│   │   ├── CalorieInput.jsx
│   │   ├── FoodSuggestions.jsx
│   │   ├── GoalSetter.jsx
│   │   ├── LogItem.jsx
│   │   ├── LogList.jsx
│   │   ├── ProgressDisplay.jsx
│   │   └── common/
│   │       ├── Button.jsx
│   │       └── Input.jsx
│   ├── context/
│   │   └── AppContext.jsx
│   ├── data/
│   │   └── suggestions.js
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── index.css
│   ├── main.jsx
│   └── utils/
│       └── helpers.js
├── startup.sh
├── tailwind.config.js
├── tests/
│   ├── components/
│   │   ├── CalorieInput.test.jsx
│   │   └── GoalSetter.test.jsx
│   └── context/
│       └── AppContext.test.jsx
└── vite.config.js
```

## 💻 Installation
  > [!WARNING]
  > ### 🔧 Prerequisites
  > - Node.js (v18.x or v20.x recommended)
  > - npm (v9.x or later, usually included with Node.js)
  > - A modern web browser supporting `localStorage`

  ### 🚀 Setup Instructions
  1. Clone the repository:
     ```bash
     git clone https://github.com/coslynx/health-fit-goal-tracker.git
     cd health-fit-goal-tracker
     ```
  2. Install dependencies:
     ```bash
     npm install
     ```
  3. Configure environment variables (optional, defaults provided):
     - This project uses a `.env` file primarily for the application title. You can create one based on the provided `.env` content or rely on defaults.
     ```bash
     # Create a .env file if you want to customize variables
     # Example .env content:
     # VITE_APP_TITLE="My Custom Tracker Name"
     ```

## 🏗️ Usage
### 🏃‍♂️ Running the MVP
1. Start the development server:
   ```bash
   npm run dev
   ```
   > [!NOTE]
   > This will typically start the server on `http://localhost:5173`. Check the terminal output for the exact URL.

2. Access the application in your web browser using the URL provided by Vite.

### 🛠️ Available Scripts
- **`npm run dev`**: Starts the development server with Hot Module Replacement (HMR).
- **`npm run build`**: Creates a production-ready build in the `dist/` directory.
- **`npm run lint`**: Lints the codebase using ESLint based on the rules in `.eslintrc.cjs`.
- **`npm run preview`**: Starts a local server to preview the production build from `dist/`.
- **`npm run test`**: Runs the unit tests using Vitest.
- **`npm run format`**: Formats the code using Prettier based on rules in `.prettierrc.json`.

> [!TIP]
> ### ⚙️ Configuration
> - The main configuration point is the `.env` file for the application title (`VITE_APP_TITLE`).
> - `localStorage` keys used for persistence (`fitnessAppGoal`, `fitnessAppLog`) are defined within `src/context/AppContext.jsx`. Modifying these would require code changes.
> - Default goal (2000) and initial log (`[]`) are set within `AppContext.jsx`.

### 📚 Examples (User Workflow)
1.  **Set Goal**: Use the "Set Your Daily Goal" section. Enter a positive number (e.g., 2200) and click "Set Goal". The "Current Goal" display will update.
2.  **Log Food**: Use the "Log Food Item" section. Enter a food name (e.g., "Banana") and its calorie count (e.g., 105). Click "Add Log Entry".
3.  **View Progress**: The "Progress Summary" section updates automatically, showing total consumed calories and remaining calories based on your goal and logged items.
4.  **View Log**: The "Daily Log" section lists all items added during the session.
5.  **View Suggestions**: The "Food Suggestions" section displays a static list of ideas.
6.  **Persistence**: Close and reopen your browser tab. Your goal and logged items should still be present as they are saved in `localStorage`.

## 🌐 Hosting
> [!NOTE]
> This is a client-side application. It can be hosted on any static web hosting provider.

### 🚀 Deployment Instructions
Platforms like Netlify, Vercel, or GitHub Pages are suitable. The general process is:

1.  **Build the Application**:
    ```bash
    npm run build
    ```
    This command generates the optimized static assets in the `dist/` directory.

2.  **Deploy the `dist` Directory**:
    - **Netlify/Vercel**: Connect your Git repository and configure the build command (`npm run build`) and publish directory (`dist`). They will handle the build and deployment automatically.
    - **GitHub Pages**: Configure GitHub Pages to serve from the `gh-pages` branch (after pushing the `dist` contents there) or directly from the `dist` folder if using GitHub Actions for deployment.
    - **Other Static Hosts**: Upload the contents of the `dist` directory to your chosen hosting provider.

### 🔑 Environment Variables
For deployment, only `VITE_APP_TITLE` is actively used by the code. Most hosting providers allow setting environment variables during the build process. If you need to customize the title for the deployed version:

-   `VITE_APP_TITLE`: Sets the application title displayed in the header and potentially the browser tab title (configured in `index.html`).
    Example: `VITE_APP_TITLE="My Deployed Health Tracker"`

## 📜 API Documentation
> [!IMPORTANT]
> This Minimum Viable Product (MVP) is entirely **client-side**. It operates directly within the user's browser and uses `localStorage` for data persistence.
>
> **There is no backend API associated with this MVP.** All logic for goal setting, calorie logging, progress calculation, and data storage happens within the browser.

### 🔒 Authentication
No authentication is implemented as the application is client-side and stores data locally per browser.

## 📄 License & Attribution

### 📜 License
This Minimum Viable Product (MVP) is licensed under the [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/) license.

### 🤖 AI-Generated MVP
This MVP was entirely generated using artificial intelligence through [CosLynx.com](https://coslynx.com).

No human was directly involved in the coding process of the repository: health-fit-goal-tracker

### 📞 Contact
For any questions or concerns regarding this AI-generated MVP, please contact CosLynx at:
- Website: [CosLynx.com](https://coslynx.com)
- Twitter: [@CosLynxAI](https://x.com/CosLynxAI)

<p align="center">
  <h1 align="center">🌐 CosLynx.com</h1>
</p>
<p align="center">
  <em>Create Your Custom MVP in Minutes With CosLynxAI!</em>
</p>
<div class="badges" align="center">
<img src="https://img.shields.io/badge/Developers-Drix10,_Kais_Radwan-red" alt="">
<img src="https://img.shields.io/badge/Website-CosLynx.com-blue" alt="">
<img src="https://img.shields.io/badge/Backed_by-Google,_Microsoft_&_Amazon_for_Startups-red" alt="">
<img src="https://img.shields.io/badge/Finalist-Backdrop_Build_v4,_v6-black" alt="">
</div>