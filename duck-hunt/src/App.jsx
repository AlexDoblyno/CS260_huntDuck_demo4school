import React, { useState, useEffect } from 'react';
import Duck from './Duck';
import './App.css';

function App() {
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ x: 100, y: 100 });

  // 生成随机位置的辅助函数
  const getRandomPosition = () => {
    // 减去鸭子的大小(60px)和边缘边距，防止飞出屏幕
    const maxWidth = window.innerWidth - 80;
    const maxHeight = window.innerHeight - 200; // 留出地面高度

    const x = Math.floor(Math.random() * maxWidth);
    const y = Math.floor(Math.random() * maxHeight);
    return { x, y };
  };

  // 游戏循环：每 1.5 秒移动一次鸭子
  useEffect(() => {
    const intervalId = setInterval(() => {
      setPosition(getRandomPosition());
    }, 1500); // 1500ms 移动一次

    // 清理函数：组件卸载时清除定时器
    return () => clearInterval(intervalId);
  }, []); // 空数组表示只在挂载时设置一次 interval

  // 点击鸭子的处理函数
  const shootDuck = () => {
    setScore((prevScore) => prevScore + 1);
    // 打中后立即移动，增加反馈感
    setPosition(getRandomPosition());
  };

  return (
    <div className="game-container">
      <div className="scoreboard">
        Score: <strong>{score}</strong>
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

export default App;