import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Play from './Play';
import Login from './Login';
import Scores from './Scores';
import About from './About';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        {/* 导航栏 */}
        <header className="navbar">
          <div className="brand">🦆 Duck Hunt</div>
          <nav>
            <NavLink className="nav-item" to="/">Login</NavLink>
            <NavLink className="nav-item" to="/play">Play</NavLink>
            <NavLink className="nav-item" to="/scores">Scores</NavLink>
            <NavLink className="nav-item" to="/about">About</NavLink>
          </nav>
        </header>

        {/* 路由出口 */}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/play" element={<Play />} />
          <Route path="/scores" element={<Scores />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<main>404 Not Found</main>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;