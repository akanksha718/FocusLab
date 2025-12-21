# FocusLab

FocusLab is a lightweight productivity web app for tracking habits, daily todos, and weekly planning. It combines a habit tracker, a sticky note area for quick daily notes, and a weekly planner with per-day todos and progress indicators.

This repository contains a React + Vite frontend (`client/`) and a Node.js backend (`server/`) that manages user authentication and habit persistence.

---

## Features

- Habit tracker: create habits and mark them done per day. Progress bars show completion percentage.
- Weekly planner: per-day todo lists, checkboxes, and a sticky note for each day. Todos and notes persist to `localStorage` (per user & week).
- Sticky Note: a reusable component with autosave and bold, readable text.
- Responsive layout: habit tracker and sticky note appear side-by-side on medium+ screens, with the weekly planner adapting to available width.
- Firebase authentication integration for user sessions and protected API calls.

## Tech stack

- Frontend: React, Vite, Tailwind CSS (utility classes used throughout)
- Backend: Node.js + Express (simple API for habits and auth)
- Auth: Firebase (client) and Firebase Admin (server)
- HTTP client: axios

## Repo structure

- client/ — React frontend
	- src/
		- components/ — UI components (`HabitTracker`, `WeeklyPlanner`, `StickyNote`, `Header`)
		- pages/ — `DashBoard`, `Login`, `SignUp`
		- config/ — Firebase client config
- server/ — Node.js backend
	- routes/ — `auth.js`, `habits.js`
	- models/ — Mongoose models (`User`, `Habit`)
	- config/ — `db.js`, `firebaseAdmin.js`

## Local setup

Prerequisites:
- Node.js 18+ (or compatible)
- npm
- Firebase project (for auth). You'll need client config and a service account key for the server.

1. Clone the repo

```bash
git clone <repo-url>
cd FocusLab
```

2. Configure environment

- Frontend: create a `.env` or `.env.local` in `client/` with Vite env variables (example below)
- Backend: create a `.env` in `server/` with DB connection and other secrets

Example `client/.env` (Vite prefixes):

```
VITE_API=http://localhost:3000
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id
```

Example `server/.env`:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/focuslab
FIREBASE_SERVICE_ACCOUNT=./config/serviceAccountKey.json
```

3. Install and run

Start server:

```bash
cd server
npm install
npm run dev
```

Start client:

```bash
cd client
npm install
npm run dev
```

Open https://focus-lab-97z8.vercel.app/ (Vite default) to view the app.

## Usage notes

- Sign up / log in with Firebase auth. The `HabitTracker` uses the auth token to call protected API routes for persisting habits.
- Weekly planner stores todos/notes in localStorage per user & week. If you want to persist these on the server, add backend endpoints and update the frontend accordingly.

## Development ideas / next steps

- Persist weekly planner todos & notes to the backend database per user
- Add week navigation (prev/next) and calendar integration
- Improve UI: drag-and-drop todos, colored sticky notes, and printable weekly PDF export
- Add tests and CI (GitHub Actions)





