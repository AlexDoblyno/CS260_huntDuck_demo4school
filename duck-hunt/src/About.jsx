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
      <p style={{marginTop: '10px', fontSize: '0.9rem', color: '#666'}}>
         Find source code on https://github.com/AlexDoblyno/
          CS260_huntDuck_demo4school.git
      </p>
    </div>
  );
}