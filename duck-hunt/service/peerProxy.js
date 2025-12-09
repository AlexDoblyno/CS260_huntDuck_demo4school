import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

export function peerProxy(httpServer) {
  const wss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  let connections = [];

  wss.on('connection', (ws) => {
    const connection = { id: uuidv4(), ws, alive: true, user: 'Unknown Agent' };
    connections.push(connection);

    broadcastCount();

    ws.on('message', function message(data) {
      const msg = JSON.parse(data);

      if (msg.type === 'init') {
        connection.user = msg.user;
        broadcastLog(`[SYS] CONNECTION ESTABLISHED: AGENT <${connection.user}> JOINED.`);
      } else if (msg.type === 'gameEvent') {
        broadcastLog(`[LOG] ${msg.action}`);
      }
    });

    ws.on('close', () => {
      const pos = connections.findIndex((o, i) => o.id === connection.id);
      if (pos >= 0) {
        const userLeft = connections[pos].user;
        connections.splice(pos, 1);
        
        broadcastCount();
        broadcastLog(`[SYS] CONNECTION LOST: AGENT <${userLeft}> DISCONNECTED.`);
      }
    });

    ws.on('pong', () => {
      connection.alive = true;
    });
  });

  function broadcastCount() {
    const countMsg = JSON.stringify({ type: 'count', value: connections.length });
    connections.forEach((c) => {
      if (c.ws.readyState === 1) { // WebSocket.OPEN
        c.ws.send(countMsg);
      }
    });
  }

  function broadcastLog(text) {
    const logMsg = JSON.stringify({ 
      type: 'log', 
      message: text, 
      timestamp: new Date().toISOString() 
    });
    connections.forEach((c) => {
      if (c.ws.readyState === 1) {
        c.ws.send(logMsg);
      }
    });
  }

  setInterval(() => {
    connections.forEach((c) => {
      if (!c.alive) {
        c.ws.terminate();
      } else {
        c.alive = false;
        c.ws.ping();
      }
    });
  }, 10000);
}