import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Duck from './Duck';

export default function Play() {
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ x: 50, y: 100 });
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

    const intervalId = setInterval(() => {
      setPosition(getRandomPosition());
    }, 1200);

    return () => clearInterval(intervalId);
  }, []);

  const shootDuck = (e) => {
    e.stopPropagation(); 
    setScore((prevScore) => prevScore + 1);
    setPosition(getRandomPosition());
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
      <div className="scoreboard">
        <span>Score: {score}</span>
        <button 
          onClick={saveScore}
          style={{
            marginLeft: '20px', 
            fontSize: '0.9rem', 
            padding: '5px 15px', 
            width: 'auto',
            verticalAlign: 'middle',
            backgroundColor: '#e74c3c'
          }}
        >
          Stop & Save
        </button>
      </div>

      <Duck 
        x={position.x} 
        y={position.y} 
        onClick={shootDuck} 
      />

      <div className="ground"></div>
    </div>
  );
}