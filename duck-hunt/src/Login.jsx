import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    // 简单模拟登录，实际课程可能需要存 localStorage
    localStorage.setItem('userName', name);
    navigate('/play');
  };

  return (
    <div className="page-content login-container">
      <h1>Duck Hunt Start</h1>
      <input 
        type="text" 
        placeholder="Enter your name" 
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleLogin} disabled={!name}>Play</button>
    </div>
  );
}