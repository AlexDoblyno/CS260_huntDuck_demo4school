import React from 'react';

export default function About() {
  return (
    <div className="card">
      <h1>About Duck Hunt</h1>
      <p>
        This is a web-based remake of the classic arcade game.
      </p>
      <p>
        <strong>How to play:</strong><br/>
        Click on the ducks as they fly across the screen to score points.
      </p>
      <p style={{marginTop: '20px', fontSize: '0.9rem', color: '#666'}}>
        Built for CS 260.
      </p>
    </div>
  );
}