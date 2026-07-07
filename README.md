# MindQuest - Interactive Quiz App

MindQuest is a premium, high-fidelity Multiple Choice Quiz Application with scoring, high score leaderboards, question lifelines, and a custom quiz builder.

Built with a **React (Vite) frontend** featuring dark-mode glassmorphism styling and custom keyframe animations, backed by a **Node.js (Express) server** with local file-based JSON storage.

---

## Key Features

1. **Space Glassmorphism Theme**: Curated HSL colors, blur backdrops, glowing selection outlines, and smooth card transition animations.
2. **Circular Countdown Timer**: SVG-based timer that visually drains and shifts colors (green ➔ orange ➔ red) as time runs out.
3. **Gameplay Lifelines**: 
   - **50:50**: Randomly removes two incorrect choices.
   - **Skip Question**: Skip current question (earns 0 score).
   - **+10 Seconds**: Adds extra time to the active countdown.
4. **Result breakdown**: Animated circular percentage gauge, performance evaluations, and a collapsible accordion list detailing correct/incorrect choices with explanations.
5. **Hall of Fame (Leaderboard)**: Top 3 players highlighted on an interactive podium with a ranking table showing all scores.
6. **Quiz Creator**: Form editor to build and publish custom quizzes (set title, categories, custom questions, option counts, correct answers, and hints).

---

## Project Structure

```
Quiz-app/
├── backend/
│   ├── data/
│   │   └── db.json       # JSON file database (Seed data pre-loaded)
│   ├── db.js             # File system read/write helper functions
│   ├── server.js         # Express REST API (Endpoints for quizzes and leaderboard)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/   # Welcome, Quiz, Results, Leaderboard, and QuizCreator
    │   ├── App.jsx       # Routing & central application state
    │   ├── index.css     # Design tokens, variables, and keyframe animations
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

## Installation & Running

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- `npm`

### Step 1: Run the Backend API Server
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server (runs on port `5000`):
   ```bash
   npm run dev
   ```

### Step 2: Run the React Frontend Development Server
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite server (runs on port `5173` or similar):
   ```bash
   npm run dev
   ```
4. Open the displayed local link (usually `http://localhost:5173`) in your web browser.

Enjoy playing and building custom quizzes!
