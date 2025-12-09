// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Play from './Play';
import Login from './Login';
import Scores from './Scores';
import About from './About';
import RetroTerminal from './RetroTerminal'; // 引入新组件
import './App.css';

function App() {
  const [userName, setUserName] = useState(localStorage.getItem('userName') || '');
  
  // --- WebSocket 全局状态 ---
  const [socket, setSocket] = useState(null);
  const [logs, setLogs] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);

  // 登录/登出处理
  const onLogin = (authName) => {
    setUserName(authName);
    localStorage.setItem('userName', authName);
  };

  const onLogout = () => {
    setUserName('');
    localStorage.removeItem('userName');
    fetch(`/api/auth/logout`, { method: 'delete' });
    // 登出时关闭 socket
    if (socket) {
      socket.close();
      setSocket(null);
    }
  };

  // --- WebSocket 连接逻辑 (监听 userName 变化) ---
  useEffect(() => {
    // 只有登录了才连接 WebSocket
    if (userName) {
      const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
      const host = window.location.host;
      const newSocket = new WebSocket(`${protocol}://${host}`);

      newSocket.onopen = () => {
        addLogSystem(`UPLINK ESTABLISHED. AGENT <${userName}> CONNECTED.`);
        newSocket.send(JSON.stringify({ type: 'init', user: userName }));
      };

      newSocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'log') {
          addLog(data.message);
        } else if (data.type === 'count') {
          // 如果后端有发在线人数的类型(看你后端实现)，可以在这里处理
          // 如果后端只发 log，那我们就只能看 log。
          // 假设后端 peerProxy.js 广播了 count (之前的代码有写)
           setOnlineCount(data.value);
        }
      };

      newSocket.onclose = () => {
        addLogSystem('CONNECTION LOST.');
      };

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [userName]); // 依赖 userName，登录即连，登出即断

  // 添加日志辅助函数
  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
    setLogs((prev) => [...prev.slice(-50), { time, text: msg }]); // 保留最近50条
  };

  const addLogSystem = (msg) => {
    addLog(`[SYS] ${msg}`);
  };

  // 供子组件调用的广播函数
  const broadcastNotifier = (actionText) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'gameEvent', action: actionText }));
    }
  };

  return (
    <BrowserRouter>
      <div className="app-container">
        {/* 导航栏 */}
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
            <Route path="/" element={<Login authState={userName} onLogin={onLogin} />} />
            <Route 
              path="/play" 
              element={
                userName ? (
                  /* 将广播函数传给 Play */
                  <Play userName={userName} broadcastAction={broadcastNotifier} />
                ) : <Navigate to="/" />
              } 
            />
            <Route path="/scores" element={userName ? <Scores /> : <Navigate to="/" />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<div className="card" style={{color:'white'}}>404 Not Found</div>} />
          </Routes>
        </main>

        {/* --- 持久化日志窗口 (在 Routes 之外) --- */}
        {/* 只有登录后才显示 */}
        {userName && (
          <RetroTerminal logs={logs} onlineCount={onlineCount} />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;