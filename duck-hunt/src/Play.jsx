import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Duck from './Duck';

export default function Play() {
  // --- 游戏状态 ---
  const [score, setScore] = useState(0);
  const [position, setPosition] = useState({ x: 50, y: 100 });
  const [timeLeft, setTimeLeft] = useState(30);
  
  // --- 终端日志状态 ---
  const [logs, setLogs] = useState([]); 
  const logsEndRef = useRef(null); // 用于自动滚动到底部
  const socketRef = useRef(null);  // WebSocket 引用

  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Anonymous';

  // --- 1. WebSocket 连接与事件处理 ---
  useEffect(() => {
    // 自动判断协议: 开发环境或生产环境自动切换 ws/wss
    const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
    const host = window.location.host;
    const socket = new WebSocket(`${protocol}://${host}`);

    socket.onopen = () => {
      // 连接成功，本地显示系统日志
      addLogSystem('UPLINK ESTABLISHED... ENCRYPTED CHANNEL ACTIVE.');
      
      // 发送初始化消息给后端，注册用户名
      const initMsg = { type: 'init', user: userName };
      socket.send(JSON.stringify(initMsg));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // 接收来自服务器的广播日志
      if (data.type === 'log') {
        addLog(data.message);
      }
    };

    socket.onclose = () => {
      addLogSystem('CONNECTION LOST. RECONNECTING...');
    };

    socketRef.current = socket;

    // 组件卸载时断开连接
    return () => {
      if (socket.readyState === 1) { // OPEN
        socket.close();
      }
    };
  }, []);

  // --- 2. 日志自动滚动效果 ---
  useEffect(() => {
    // 每当 logs 数组更新，自动滚动到最底部
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // 辅助函数：添加普通日志 (来自 WebSocket)
  const addLog = (msg) => {
    const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
    // 只保留最近 20 条日志，防止内存溢出
    setLogs((prev) => [...prev.slice(-20), { time, text: msg }]); 
  };

  // 辅助函数：添加本地系统日志 (不经过服务器)
  const addLogSystem = (msg) => {
    addLog(`[SYS] ${msg}`);
  };

  // 辅助函数：向服务器广播游戏动作
  const broadcastAction = (actionText) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const msg = { type: 'gameEvent', action: actionText };
      socketRef.current.send(JSON.stringify(msg));
    }
  };

  // --- 3. 游戏核心逻辑 ---
  
  // 计算鸭子随机位置 (确保不飞出屏幕)
  const getRandomPosition = () => {
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;
    const DUCK_SIZE = 70; 
    const NAV_HEIGHT = 70; 
    const GROUND_HEIGHT = 150; 
    const PADDING = 20;

    const minX = PADDING;
    const maxX = winWidth - DUCK_SIZE - PADDING;
    const minY = NAV_HEIGHT + PADDING;
    const maxY = winHeight - GROUND_HEIGHT - DUCK_SIZE - PADDING;
    
    const safeMaxX = Math.max(minX, maxX);
    const safeMaxY = Math.max(minY, maxY);
    
    const x = Math.floor(Math.random() * (safeMaxX - minX)) + minX;
    const y = Math.floor(Math.random() * (safeMaxY - minY)) + minY;
    return { x, y };
  };

  // 鸭子移动循环
  useEffect(() => {
    setPosition(getRandomPosition());
    const moveInterval = setInterval(() => {
      setPosition(getRandomPosition());
    }, 1200); // 1.2秒移动一次
    return () => clearInterval(moveInterval);
  }, []);

  // 倒计时逻辑
  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else if (timeLeft === 0) {
      // 时间到，自动保存
      saveScore();
    }
  }, [timeLeft]);

  // 射击处理
  const shootDuck = (e) => {
    e.stopPropagation(); // 防止点击穿透
    if (timeLeft > 0) {
      const newScore = score + 1;
      setScore(newScore);
      setPosition(getRandomPosition());
      
      // 广播击杀日志：制造刷屏快感
      broadcastAction(`AGENT <${userName}> ELIMINATED TARGET. SCORE: ${newScore}`);
    }
  };

  // 保存分数并退出
  const saveScore = async () => {
    const date = new Date().toLocaleDateString();
    const newScore = { name: userName, score: score, date: date };

    // 广播任务结束日志
    broadcastAction(`AGENT <${userName}> MISSION COMPLETE. FINAL SCORE: ${score}`);

    try {
      await fetch('/api/score', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(newScore),
      });
      navigate('/scores');
    } catch (error) {
      console.error('Failed to save score:', error);
      navigate('/scores');
    }
  };

  return (
    <div className="game-area-wrapper">
      {/* 顶部 HUD 计分板 */}
      <div className="scoreboard">
        <span>SCORE: {score}</span>
        <span style={{ color: timeLeft < 10 ? '#ff0055' : 'white', minWidth: '100px' }}>
          TIME: {timeLeft}s
        </span>
        <button onClick={saveScore} className="stop-btn">ABORT MISSION</button>
      </div>

      {/* 左下角复古终端 (Retro Terminal) */}
      <div className="terminal-window">
        <div className="terminal-header">
          <span>NET_LOG // V.1.0</span>
          <span>● ONLINE</span>
        </div>
        <div className="terminal-logs">
          {logs.map((log, index) => (
            <div key={index} className="log-line">
              <span className="log-time">[{log.time}]</span>
              {log.text}
            </div>
          ))}

          <div ref={logsEndRef} />
          
          <div className="log-line">
            <span className="log-time">[{new Date().toLocaleTimeString([], {hour12:false, hour:'2-digit', minute:'2-digit', second:'2-digit'})}]</span>
            _Waiting for signal<span className="cursor"></span>
          </div>
        </div>
      </div>

      {/* 鸭子目标 */}
      {timeLeft > 0 && (
        <Duck x={position.x} y={position.y} onClick={shootDuck} />
      )}
      
      {/* 游戏结束画面 */}
      {timeLeft === 0 && (
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          fontFamily: "'Press Start 2P', cursive", 
          fontSize: '3rem', 
          color: '#ff0055', 
          textShadow: '0 0 20px rgba(255,0,85,0.8)', 
          zIndex: 50, 
          textAlign: 'center', 
          lineHeight: '1.5' 
        }}>
          MISSION<br/>FAILED
        </div>
      )}

      {/* 复古网格地面 */}
      <div className="ground"></div>
    </div>
  );
}