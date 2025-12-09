import React, { useState, useEffect } from 'react';
import Duck from './Duck';

export default function Play() {
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ x: 50, y: 50 }); // 给个初始安全位置

  const getRandomPosition = () => {
    // 获取当前视口宽高
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    // 边界计算：
    // x: 0 到 (屏幕宽 - 鸭子宽80px)
    // y: 60px(导航栏高) 到 (屏幕高 - 草地高150px - 鸭子高80px)
    
    const minX = 20;
    const maxX = winWidth - 80;
    
    // 注意：Y轴要避开顶部的导航栏(约60px)和底部的草地(150px)
    const minY = 80; 
    const maxY = winHeight - 160 - 80; 

    // 防止计算出负数（窗口太小时）
    const safeMaxX = Math.max(minX, maxX);
    const safeMaxY = Math.max(minY, maxY);

    const x = Math.floor(Math.random() * (safeMaxX - minX)) + minX;
    const y = Math.floor(Math.random() * (safeMaxY - minY)) + minY;

    return { x, y };
  };

  useEffect(() => {
    // 初始移动一次
    setPosition(getRandomPosition());

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
    <div className="game-area-wrapper">
      <div className="scoreboard">Score: {score}</div>
      {/* 传递 x, y 给鸭子 */}
      <Duck x={position.x} y={position.y} onClick={shootDuck} />
      <div className="ground"></div>
    </div>
  );
}