import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Duck from './Duck';

export default function Play() {
  // 游戏状态
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ x: 50, y: 100 });
  const [timeLeft, setTimeLeft] = useState(30);
  
  // WebSocket 状态
  const [onlineCount, setOnlineCount] = useState(1);
  const [events, setEvents] = useState([]);
  const socketRef = useRef(null);

  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Anonymous';

  // --- WebSocket 初始化 ---
  useEffect(() => {
    // 自动判断协议: http -> ws, https -> wss
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    const host = window.location.host;
    const socket = new WebSocket(`${protocol}://${host}`);

    socket.onopen = () => {
      // 登录时广播
      broadcastEvent('joined the hunt');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'count') {
        setOnlineCount(data.value);
      } else if (data.type === 'gameEvent') {
        addEvent(`${data.user} ${data.action}`);
      }
    };

    socketRef.current = socket;

    return () => {
      socket.close();
    };
  }, []);

  // 辅助函数：发送消息
  const broadcastEvent = (action) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const msg = { type: 'gameEvent', user: userName, action: action };
      socketRef.current.send(JSON.stringify(msg));
    }
  };

  // 辅助函数：添加消息到 UI 列表
  const addEvent = (msg) => {
    setEvents((prev) => {
      const newEvents = [...prev, msg];
      if (newEvents.length > 5) return newEvents.slice(1); // 只保留最近5条
      return newEvents;
    });
  };

  // --- 游戏移动逻辑 ---
  const getRandomPosition = () => {
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    const DUCK_SIZE = 60; const NAV_HEIGHT = 60; const GROUND_HEIGHT = 150; const PADDING = 20;

    const minX = PADDING;
    const maxX = winWidth - DUCK_SIZE - PADDING;
    const minY = NAV_HEIGHT + PADDING;
    const maxY = winHeight - GROUND_HEIGHT - DUCK_SIZE - PADDING;

    const safeMaxX = Math.max(minX, maxX);
    const safeMaxY = Math.max(minY, maxY);
    const x = Math.floor(Math.random() * (safeMaxX - minX)) + minX;
    const y = Math.floor(Math.random() * (safeMaxY - minY)) + minY;
    return { x, y };
  };

  useEffect(() => {
    setPosition(getRandomPosition());
    const moveInterval = setInterval(() => {
      setPosition(getRandomPosition());
    }, 1200);
    return () => clearInterval(moveInterval);
  }, []);

  // --- 倒计时逻辑 ---
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft === 0) {
      saveScore();
    }
  }, [timeLeft]);

  // --- 射击逻辑 ---
  const shootDuck = (e) => {
    e.stopPropagation(); // 防止事件冒泡
    if (timeLeft > 0) {
      const newScore = score + 1;
      setScore(newScore);
      setPosition(getRandomPosition());

      // 每得 10 分广播一次，防止刷屏
      if (newScore > 0 && newScore % 10 === 0) {
        broadcastEvent(`hit ${newScore} ducks!`);
      }
    }
  };

  // --- 保存分数逻辑 ---
  const saveScore = async () => {
    const date = new Date().toLocaleDateString();
    const newScore = { name: userName, score: score, date: date };

    // 广播结束消息
    broadcastEvent(`finished with ${score} pts!`);

    try {
      await fetch('/api/score', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newScore),
      });
      navigate('/scores');
    } catch (error) {
      console.error('Failed to save score:', error);
      navigate('/scores');
    }
  };

  return (
    <div className="game-area-wrapper">
      {/* 顶部计分板 */}
      <div className="scoreboard" style={{ display: 'flex', alignItems: 'center', gap: '20px', width: 'auto' }}>
        <span>Score: {score}</span>
        <span style={{ color: timeLeft < 10 ? '#ff4444' : 'white', minWidth: '80px' }}>
          Time: {timeLeft}s
        </span>
        <button 
          onClick={saveScore}
          style={{ margin: 0, fontSize: '1rem', padding: '8px 16px', width: 'auto', backgroundColor: '#e74c3c', border: '2px solid white', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Stop & Save
        </button>
      </div>

      {/* 左下角 WebSocket 消息面板 */}
      <div className="notification-panel">
        <div className="player-count">Players Online: {onlineCount}</div>
        <ul className="event-list">
          {events.map((msg, index) => (
            <li key={index} className="event-item">
              <span className="event-highlight">»</span> {msg}
            </li>
          ))}
        </ul>
      </div>

      {/* 鸭子 */}
      {timeLeft > 0 && (
        <Duck x={position.x} y={position.y} onClick={shootDuck} />
      )}
      
      {/* 游戏结束文字 */}
      {timeLeft === 0 && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '4rem', fontWeight: 'bold', color: 'white', textShadow: '0 0 10px red', zIndex: 50 }}>
          GAME OVER
        </div>
      )}

      <div className="ground"></div>
    </div>
  );
}