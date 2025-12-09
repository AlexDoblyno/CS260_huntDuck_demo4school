import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Duck from './Duck';

export default function Play() {
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ x: 50, y: 100 });
  const [timeLeft, setTimeLeft] = useState(30); // 30秒倒计时
  const navigate = useNavigate();

  const getRandomPosition = () => {
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    const DUCK_SIZE = 60;
    const NAV_HEIGHT = 60;
    const GROUND_HEIGHT = 150;
    const PADDING = 20;

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

  const shootDuck = (e) => {
    e.stopPropagation();
    if (timeLeft > 0) {
      setScore((prevScore) => prevScore + 1);
      setPosition(getRandomPosition());
    }
  };

  const saveScore = async () => {
    const userName = localStorage.getItem('userName') || 'Anonymous';
    const date = new Date().toLocaleDateString();
    const newScore = { name: userName, score: score, date: date };

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
      {/* 修改点：这里直接加上内联的 flex 样式，
        确保 Score, Time 和 Button 强制在同一行显示 
      */}
      <div className="scoreboard" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '20px',
        width: 'auto' // 允许宽度自适应内容
      }}>
        <span>Score: {score}</span>
        
        <span style={{ color: timeLeft < 10 ? '#ff4444' : 'white', minWidth: '80px' }}>
          Time: {timeLeft}s
        </span>
        
        <button 
          onClick={saveScore}
          style={{
            // 按钮样式调整：去除 margin-top，强制不许换行
            margin: 0,
            fontSize: '1rem', 
            padding: '8px 16px', 
            width: 'auto', 
            backgroundColor: '#e74c3c',
            whiteSpace: 'nowrap', // 防止文字换行
            border: '2px solid white', // 加个白边框确保能看见
            cursor: 'pointer'
          }}
        >
          Stop & Save
        </button>
      </div>

      {timeLeft > 0 && (
        <Duck x={position.x} y={position.y} onClick={shootDuck} />
      )}
      
      {timeLeft === 0 && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '4rem', fontWeight: 'bold', color: 'white',
          textShadow: '0 0 10px red', zIndex: 50
        }}>
          GAME OVER
        </div>
      )}

      <div className="ground"></div>
    </div>
  );
}