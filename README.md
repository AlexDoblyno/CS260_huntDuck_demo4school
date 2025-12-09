# 🦆 DUCK HUNT: RETRO EDITION

> A retro-futuristic multiplayer arcade experience built with the MERN stack.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2-61DAFB.svg?style=flat&logo=react)
![Node](https://img.shields.io/badge/Node.js-v20-339933.svg?style=flat&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg?style=flat&logo=mongodb)
![WebSocket](https://img.shields.io/badge/WebSocket-Live-orange.svg)

## 🕹️ About The Project

**Duck Hunt Retro** is a modern web reimagining of the classic 80s light gun shooter. It features a persistent high-score system, secure authentication, and a unique **Real-time CRT Terminal** that logs multiplayer events as they happen.

The design philosophy moves away from typical modern flat UI, embracing a **Retro-Futurism** aesthetic with neon 5-color stripes, scanlines, and pixel-perfect fonts.

### ✨ Key Features

* **authentication:** Secure login/register system using BCrypt hashing and Cookies.
* **Database:** MongoDB persistence for user profiles and global leaderboards.
* **WebSocket Terminal:** A live, auto-scrolling CRT terminal showing real-time player joins, shots, and scores.
* **Retro UI:** Custom CSS variables for neon glows, grid backgrounds, and scanline effects.
* **Responsive:** Works on desktop and mobile devices.

---

## 🚀 Tech Stack

* **Frontend:** React, Vite, React Router DOM
* **Backend:** Node.js, Express
* **Database:** MongoDB (Atlas/Local)
* **Real-time:** Native WebSocket (`ws`)
* **Styling:** CSS3 (Variables, Keyframes, Flexbox)

---

## 🛠️ Goal
# Start up service
Create an HTTP service using Node.js and Express

Frontend served up using Express static middleware

Calls third party service endpoints

Backend provides service endpoints

Supports registration, login, logout, and restricted endpoint


# Startup DB

Stores application data in MongoDB

Stores and retrieves credentials in MongoDB

# Startup WebSocket

Backend listens for WebSocket connection

Frontend makes WebSocket connection

Data sent over WebSocket connection

WebSocket data displayed in the application interface

The application is fully functional

---

## 📂 Project Structure

```text
duck-hunt/
├── public/              # Static assets
├── service/             # Backend Code
│   ├── database.js      # MongoDB connection & CRUD
│   ├── index.js         # Express HTTP endpoints & Auth
│   └── peerProxy.js     # WebSocket server logic
├── src/                 # React Frontend
│   ├── App.css          # Global retro styles
│   ├── App.jsx          # Router & Auth state
│   ├── Play.jsx         # Core Game Logic & WebSocket Client
│   ├── Duck.jsx         # Duck Component
│   ├── Login.jsx        # Auth UI
│   └── ...
├── index.html           # Entry HTML
└── package.json         # Dependencies
