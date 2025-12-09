import React, { useState, useEffect } from 'react';

export default function Scores() {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // 组件加载时调用 API
    fetch('/api/scores')
      .then((response) => response.json())
      .then((data) => {
        setScores(data);
      });
  }, []);

  return (
    <div className="card">
      <h1>Leaderboard</h1>
      <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
        {scores.length > 0 ? (
          scores.map((s, index) => (
            <li key={index} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
              <span>{index + 1}. {s.name}</span> 
              <span>{s.score} pts</span>
            </li>
          ))
        ) : (
          <li style={{textAlign: 'center'}}>Loading scores...</li>
        )}
      </ul>
    </div>
  );
}