import React from 'react';

export default function Duck({ x, y, onClick }) {
  const duckStyle = {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    width: '60px',
    height: '60px',
    backgroundColor: '#ffcc00',
    borderRadius: '50%',
    border: '3px solid white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'crosshair',
    zIndex: 15,
    transition: 'top 0.5s, left 0.5s',
  };

  return (
    <div 
      style={duckStyle} 
      onMouseDown={onClick}
    >
      <span style={{fontSize: '30px'}}>🦆</span>
    </div>
  );
}