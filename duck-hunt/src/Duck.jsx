import React from 'react';

export default function Duck({ x, y, onClick }) {
  const duckStyle = {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    width: '70px',
    height: '70px',
    // 移除背景色，改为全息投影风格
    background: 'radial-gradient(circle, rgba(255,204,0,0.2) 0%, rgba(255,204,0,0) 70%)',
    borderRadius: '50%',
    // 发光边框
    border: '2px solid rgba(255, 204, 0, 0.6)',
    boxShadow: '0 0 15px rgba(255, 204, 0, 0.4), inset 0 0 10px rgba(255, 204, 0, 0.2)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'crosshair',
    zIndex: 20,
    transition: 'top 0.5s ease-out, left 0.5s ease-out', // 平滑移动
    animation: 'pulse 1s infinite alternate', // 呼吸效果
  };

  return (
    <div 
      style={duckStyle} 
      onMouseDown={onClick}
    >
      {/* 增加一个内部旋转的瞄准圈，增加科技感 */}
      <style>{`
        @keyframes pulse {
          from { transform: scale(1); box-shadow: 0 0 10px rgba(255,204,0,0.4); }
          to { transform: scale(1.1); box-shadow: 0 0 20px rgba(255,204,0,0.8); }
        }
      `}</style>
      <span style={{ fontSize: '36px', filter: 'drop-shadow(0 0 5px gold)' }}>🦆</span>
    </div>
  );
}