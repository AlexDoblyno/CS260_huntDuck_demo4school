import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login({ authState, onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayError, setDisplayError] = useState(null);

  // --- 新增：每日一句状态 ---
  const [quote, setQuote] = useState('Retrieving Daily Transmission...');
  const [quoteAuthor, setQuoteAuthor] = useState('');

  const navigate = useNavigate();

  // --- 新增：调用 Quotable API ---
  useEffect(() => {
    fetch('https://quote.cs260.click')
      .then((response) => response.json())
      .then((data) => {
        setQuote(data.quote);
        setQuoteAuthor(data.author);
      })
      .catch(() => {
        setQuote(data.quote);
        setQuoteAuthor('System');
      });
  }, []);

  // 如果已登录
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
    <div className="login-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
      
      {/* 登录卡片 */}
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

      {/* --- 新增：每日一句展示区 --- */}
      <div className='quote-box'>
        <div className='quote-label'>/// DAILY_BROADCAST ///</div>
        <div className='quote-content'>"{quote}"</div>
        <div className='quote-author'>— {quoteAuthor}</div>
      </div>

    </div>
  );
}