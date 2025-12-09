import React from 'react';

export default function Scores() {
  return (
    <div className="card">
      <h1>Leaderboard</h1>
      <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
        <li style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
          <span>🥇 Hunter1</span> <span>500 pts</span>
        </li>
        <li style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
          <span>🥈 Hunter2</span> <span>450 pts</span>
        </li>
        <li style={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
          <span>🥉 Hunter3</span> <span>300 pts</span>
        </li>
      </ul>
    </div>
  );
}