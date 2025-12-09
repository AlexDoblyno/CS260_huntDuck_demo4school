import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ authState, onLogin }) {
  const [isRegister, setIsRegister] = useState(false); // 切换登录/注册模式
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayError, setDisplayError] = useState(null);
  
  const navigate = useNavigate();

  // 如果已经登录，直接显示欢迎
  if (authState) {
    return (
      <div className="card">
        <h1>Welcome Back</h1>
        <p className="user-tag">Agent: {authState}</p>
        <button onClick={() => navigate('/play')}>Enter Mission</button>
      </div>
    );
  }

  const loginOrRegister = async () => {
    setDisplayError(null);
    const endpoint = isRegister ? '/api/auth/create' : '/api/auth/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email, password: password }),
      });

      if (response.ok) {
        onLogin(email);
        navigate('/play');
      } else {
        const body = await response.json();
        setDisplayError(`⚠ ${body.msg}`);
      }
    } catch (error) {
      setDisplayError('⚠ Service Error');
    }
  };

  return (
    <div className="card login-card">
      <h1>{isRegister ? 'New Agent' : 'Identify'}</h1>
      
      <div className="input-group">
        <input 
          type="text" 
          placeholder="Username / Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button onClick={loginOrRegister} disabled={!email || !password}>
        {isRegister ? 'Initialize Account' : 'Access System'}
      </button>

      {displayError && <div className="error-msg">{displayError}</div>}

      <div className="toggle-auth">
        {isRegister ? 'Already have an ID?' : 'First time here?'}
        <span onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? ' Login' : ' Register'}
        </span>
      </div>
    </div>
  );
}