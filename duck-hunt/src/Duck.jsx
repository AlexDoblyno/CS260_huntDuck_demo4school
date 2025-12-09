import React from 'react';

export default function Duck({ x, y, onClick }) {
  const duckStyle = {
    position: 'absolute', // 必须是 absolute
    left: `${x}px`,
    top: `${y}px`,
    width: '60px',        // 显式定义宽高
    height: '60px',
    backgroundColor: '#ffcc00',
    borderRadius: '50%',
    border: '3px solid white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'crosshair',
    zIndex: 15,          // 确保层级在草地(10)之上，计分板(20)之下
    transition: 'top 0.5s, left 0.5s', // 平滑移动
  };

  return (
    <div 
      className="duck-component" // 避免和 App.css 里的类名冲突，直接用内联样式
      style={duckStyle} 
      onMouseDown={onClick}
    >
      <span style={{fontSize: '30px'}}>🦆</span>
    </div>
  );
}