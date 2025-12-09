import React, { useState, useEffect } from 'react';
import Duck from './Duck';

export default function Play() {
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ x: 100, y: 100 });

  const getRandomPosition = () => {
    const maxWidth = window.innerWidth - 80;
    const maxHeight = window.innerHeight - 200;
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
    setScore((prevScore) => prevScore + 1);
    setPosition(getRandomPosition());
  };

  return (
    <div className="game-area">
      <div className="scoreboard">Score: <strong>{score}</strong></div>
      <Duck x={position.x} y={position.y} onClick={shootDuck} />
      <div className="ground"></div>
    </div>
  );
}