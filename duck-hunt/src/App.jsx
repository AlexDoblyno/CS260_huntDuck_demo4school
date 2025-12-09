import React from 'react';
import Play from './Play';
import './App.css';

function App() {
  // 阶段一：暂时直接渲染 Play 组件，确保重构没问题
  return (
    <div className="app">
      <Play />
    </div>
  );
}

export default App;