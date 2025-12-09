```markdown
# CS 260 Web Programming - Learning Notes

This document summarizes the technical concepts and skills learned throughout the development of the "Duck Hunt" project.

## 1. HTML & CSS (Static Structure)
* **Semantic HTML:** Learned to use `<header>`, `<main>`, `<nav>` tags for better accessibility and structure instead of just `<div>`.
* **CSS Flexbox:** Used `display: flex`, `justify-content`, and `align-items` to center content (like the login card) and organize the navigation bar.
* **CSS Variables:** Implemented `:root` variables (e.g., `--retro-1`, `--bg-color`) to maintain a consistent color theme and make global style changes easier.
* **Animations:** Created `@keyframes` for the duck's floating effect (`pulse`) and the cursor blinking effect in the terminal.
* **Glassmorphism vs. Solid:** Initially tried semi-transparent glass effects, but learned that solid colors with borders (`box-shadow`) often provide better contrast for retro designs.

## 2. React (Frontend Framework)
* **Components:** Broke the application into reusable pieces (`Duck.jsx`, `Play.jsx`, `Login.jsx`).
* **Props:** Passed data (like coordinates `x`, `y`) from the parent `Play` component to the child `Duck` component.
* **Hooks:**
    * `useState`: Managed game state (score, time, position) and UI state (input fields, logs).
    * `useEffect`: Handled side effects like the game timer, the duck movement interval, and initializing WebSocket connections.
    * `useRef`: Used to access the DOM directly for the auto-scrolling terminal logs and to persist the WebSocket instance across renders.
* **React Router:** Implemented Single Page Application (SPA) routing using `BrowserRouter`, `Routes`, and `Maps` to protect routes (redirecting unauthenticated users).

## 3. Service (Node.js & Express)
* **Express Server:** Built a web server to serve static frontend files (`app.use(express.static('dist'))`) and handle API requests.
* **API Endpoints:** Created RESTful endpoints:
    * `GET /api/scores`: Retrieve leaderboard data.
    * `POST /api/score`: Submit a new high score.
    * `POST /api/auth/login`: Authenticate users.
* **Middleware:** Used `express.json()` to parse request bodies and `cookie-parser` to handle authentication tokens.
* **Vite Proxy:** Configured `vite.config.js` to proxy `/api` requests to the backend server during development to avoid CORS issues.

## 4. Database (MongoDB)
* **Persistence:** Moved data storage from in-memory arrays to a MongoDB database so data survives server restarts.
* **MongoDB Driver:** Used `MongoClient` to connect to Atlas (Cloud) or Localhost dynamically based on environment variables.
* **CRUD Operations:**
    * `insertOne()`: To add users and scores.
    * `findOne()`: To check if a user exists or validate a token.
    * `find().sort().limit()`: To efficiently retrieve the top 10 high scores.
* **Security:** Learned **never** to store passwords in plain text. Used `bcryptjs` to hash passwords before saving them to the database.

## 5. WebSocket (Real-time Communication)
* **Protocol Upgrade:** Learned how HTTP requests are "upgraded" to the WebSocket protocol.
* **Server-Side (`peerProxy.js`):**
    * Created a `WebSocketServer` (using the `ws` library).
    * Managed a list of active connections.
    * Broadcasted messages (JSON strings) to all connected clients when an event occurs (User joined, Score update).
* **Client-Side (`Play.jsx`):**
    * Opened a persistent `new WebSocket()` connection.
    * Handled `onopen`, `onmessage`, and `onclose` events.
    * Parsed incoming JSON data to update the live "Retro Terminal" UI.

## 6. Authentication (Security)
* **Flow:** Register -> Hash Password -> Store User -> Issue Token.
* **Cookies:** Used HTTP-only cookies to store the authentication token (`uuid`), making it harder for XSS attacks to steal credentials compared to localStorage.
* **Route Protection:** Implemented logic on both Frontend (React Router redirect) and Backend (API middleware) to ensure only logged-in users can play or submit scores.

## Conclusion
This project evolved from a static page to a full-stack, real-time multiplayer application. The biggest challenge was synchronizing the React state with the WebSocket events, but the result is a responsive and interactive user experience.