// src/Duck.jsx
import React from 'react';

// 阶段一：位置是写死的，还没有动态 props
export default function Duck() {
  const staticStyle = {
    left: '50%',
    top: '40%',
  };

  return (
    <div className="duck" style={staticStyle}>
      {/* 鸭子样式主要靠 CSS 类名控制 */}
    </div>
  );
}