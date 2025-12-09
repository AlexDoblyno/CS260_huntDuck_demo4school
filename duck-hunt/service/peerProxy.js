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
    // 初始连接对象，暂时不知道名字，直到前端发来 init 消息
    const connection = { id: uuidv4(), ws, alive: true, user: 'Unknown Agent' };
    connections.push(connection);

    ws.on('message', function message(data) {
      const msg = JSON.parse(data);

      if (msg.type === 'init') {
        // 1. 初始化：记录用户名并广播 "JOIN" 事件
        connection.user = msg.user;
        broadcastLog(`[SYS] CONNECTION ESTABLISHED: AGENT <${connection.user}> JOINED.`);
      } else if (msg.type === 'gameEvent') {
        // 2. 游戏事件：直接转发
        // 比如: "AGENT <Hunter1> ELIMINATED TARGET (Score: 10)"
        broadcastLog(`[LOG] ${msg.action}`);
      }
    });

    ws.on('close', () => {
      const pos = connections.findIndex((o, i) => o.id === connection.id);
      if (pos >= 0) {
        // 3. 断开连接：广播 "LEFT" 事件
        const userLeft = connections[pos].user;
        connections.splice(pos, 1);
        broadcastLog(`[SYS] CONNECTION LOST: AGENT <${userLeft}> DISCONNECTED.`);
      }
    });

    ws.on('pong', () => {
      connection.alive = true;
    });
  });

  // 广播日志给所有人
  function broadcastLog(text) {
    const packet = JSON.stringify({ type: 'log', message: text, timestamp: new Date().toISOString() });
    connections.forEach((c) => {
      // 这里的策略是发给所有人，包括自己，这样自己的终端也能看到确认回显，更有感觉
      c.ws.send(packet);
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