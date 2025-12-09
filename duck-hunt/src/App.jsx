import React from 'react';
import Duck from './Duck';
import './App.css';

function App() {
  return (
    <div className="game-container">
      <div className="scoreboard">Score: 0</div>
      
      {/* 游戏区域 */}
      <Duck />
      
      {/* 地面装饰 */}
      <div className="ground"></div>
    </div>
  );
}

export default App;