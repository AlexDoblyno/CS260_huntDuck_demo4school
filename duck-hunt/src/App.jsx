import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Play from './Play';
import Login from './Login';
import Scores from './Scores';
import About from './About';
import './App.css';

function App() {
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  
  const onLogin = (authName) => {
    setUserName(authName);
    localStorage.setItem('userName', authName);
  };

  const onLogout = () => {
    setUserName('');
    localStorage.removeItem('userName');
    fetch(`/api/auth/logout`, { method: 'delete' });
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="navbar">
          <div className="brand">
            <span className="brand-icon">🦆</span>
            <span>DUCK HUNT</span>
          </div>
          
          <nav className="nav-links">
            {userName && (
              <>
                <NavLink className="nav-item" to="/play">Play</NavLink>
                <NavLink className="nav-item" to="/scores">Scores</NavLink>
              </>
            )}
            <NavLink className="nav-item" to="/about">About</NavLink>
          </nav>

          <div className="auth-status">
            {userName ? (
              <div className="user-info">
                <span>{userName}</span>
                <button className="logout-btn" onClick={onLogout}>EXIT</button>
              </div>
            ) : (
              <NavLink className="nav-item" to="/">Login</NavLink>
            )}
          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={
                <Login authState={userName} onLogin={(name) => onLogin(name)} />
              } 
            />
            <Route path="/play" element={userName ? <Play /> : <Navigate to="/" />} />
            <Route path="/scores" element={userName ? <Scores /> : <Navigate to="/" />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<div className="card" style={{color:'white'}}>404 Not Found</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;