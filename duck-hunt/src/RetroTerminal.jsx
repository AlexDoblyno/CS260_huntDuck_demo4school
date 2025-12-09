import React, { useState, useEffect, useRef } from 'react';

export default function RetroTerminal({ logs, onlineCount }) {
  const [isMinimized, setIsMinimized] = useState(false);
  const logsEndRef = useRef(null);

  // 自动滚动到底部
  useEffect(() => {
    if (!isMinimized) {
      logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isMinimized]);

  return (
    <div className={`retro-window ${isMinimized ? 'minimized' : ''}`}>
      {/* 窗口标题栏 - 点击右上角按钮折叠 */}
      <div className="window-header">
        <div className="header-title">
          <span className="status-dot">●</span> NET_LOG // V.2.0
        </div>
        <button 
          className="window-toggle-btn" 
          onClick={() => setIsMinimized(!isMinimized)}
        >
          {isMinimized ? '▲' : '▼'}
        </button>
      </div>

      {/* 窗口内容区 - 非折叠状态下显示 */}
      {!isMinimized && (
        <div className="window-body">
          <div className="system-info">
            ONLINE AGENTS: <span className="highlight-count">{onlineCount}</span>
          </div>
          <div className="log-container">
            {logs.map((log, index) => (
              <div key={index} className="log-line">
                <span className="log-time">[{log.time}]</span>
                {log.text}
              </div>
            ))}
            <div ref={logsEndRef} />
            <div className="log-line">
              <span className="log-time">[{new Date().toLocaleTimeString([], {hour12:false, hour:'2-digit', minute:'2-digit'})}]</span>
              _Monitoring<span className="cursor"></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}