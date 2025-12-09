import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Duck from './Duck';

// 接收父组件传下来的 props
export default function Play({ userName, broadcastAction }) {
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ x: 50, y: 100 });
  const [timeLeft, setTimeLeft] = useState(30);
  const navigate = useNavigate();

  const getRandomPosition = () => {
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    const DUCK_SIZE = 70; const NAV_HEIGHT = 70; const GROUND_HEIGHT = 150; const PADDING = 20;

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
      const newScore = score + 1;
      setScore(newScore);
      setPosition(getRandomPosition());
      broadcastAction(`AGENT <${userName}> HIT TARGET. SCORE: ${newScore}`);
    }
  };

  const saveScore = async () => {
    const date = new Date().toLocaleDateString();
    const newScore = { name: userName, score: score, date: date };

    broadcastAction(`AGENT <${userName}> MISSION COMPLETE. FINAL SCORE: ${score}`);

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
      <div className="scoreboard">
        <span>SCORE: {score}</span>
        <span style={{ color: timeLeft < 10 ? '#ff0055' : 'white', minWidth: '100px' }}>
          TIME: {timeLeft}s
        </span>
        <button onClick={saveScore} className="stop-btn">ABORT MISSION</button>
      </div>

      {timeLeft > 0 && <Duck x={position.x} y={position.y} onClick={shootDuck} />}
      
      {timeLeft === 0 && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: "'Press Start 2P', cursive", fontSize: '3rem', color: '#ff0055', textShadow: '0 0 20px rgba(255,0,85,0.8)', zIndex: 50, textAlign: 'center', lineHeight: '1.5' }}>
          MISSION<br/>FAILED
        </div>
      )}

      <div className="ground"></div>
    </div>
  );
}