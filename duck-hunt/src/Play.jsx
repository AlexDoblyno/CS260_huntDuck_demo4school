import React, { useState, useEffect } from 'react';
import Duck from './Duck';

export default function Play() {
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ x: 100, y: 100 });

  const getRandomPosition = () => {
      const maxWidth = window.innerWidth - 80;
      const maxHeight = window.innerHeight - 200; // 减去头部和草地
      const x = Math.floor(Math.random() * maxWidth);
      const y = Math.floor(Math.random() * maxHeight);
      return { x, y };
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setPosition(getRandomPosition());
    }, 1500);
    return () => clearInterval(intervalId);
  }, []);

  const shootDuck = () => {
    setScore((s) => s + 1);
    setPosition(getRandomPosition());
  };

  return (
    // 使用 game-area-wrapper 让它充满剩余空间
    <div className="game-area-wrapper">
      <div className="scoreboard">Score: {score}</div>
      <Duck x={position.x} y={position.y} onClick={shootDuck} />
      <div className="ground"></div>
    </div>
  );
}