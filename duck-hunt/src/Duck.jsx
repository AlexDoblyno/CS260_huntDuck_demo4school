import React from 'react';

export default function Duck({ x, y, onClick }) {
  const duckStyle = {
    left: `${x}px`,
    top: `${y}px`,
    transition: 'all 0.5s ease-out', // 让移动稍微平滑一点
  };

  return (
    <div 
      className="duck" 
      style={duckStyle} 
      onMouseDown={onClick} // 使用 onMouseDown 响应更快
    >
      {/* 这是一个防止拖拽 Ghost 图像的小技巧 */}
    </div>
  );
}