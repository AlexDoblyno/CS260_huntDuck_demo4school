import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('userName', name);
    navigate('/play');
  };

  return (
    <div className="card">
      <h1>Ready to Hunt?</h1>
      <p>Enter your hunter name to start.</p>
      <input 
        type="text" 
        placeholder="Player Name" 
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={handleLogin} disabled={!name}>
        Start Game
      </button>
    </div>
  );
}