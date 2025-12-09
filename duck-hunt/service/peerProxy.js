import { WebSocketServer } from 'ws';
import { v4 as uuidv4 } from 'uuid';

export function peerProxy(httpServer) {
  // 创建 WebSocket 服务器对象
  const wss = new WebSocketServer({ noServer: true });

  // 处理 HTTP 协议升级为 WebSocket 协议
  httpServer.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  // 跟踪连接列表
  let connections = [];

  wss.on('connection', (ws) => {
    const connection = { id: Math.floor(Math.random() * 100000), ws, alive: true };
    connections.push(connection);

    // 1. 当有新用户连接，向所有人广播最新的在线人数
    broadcastCount();

    // 2. 处理接收到的消息
    ws.on('message', function message(data) {
      connections.forEach((c) => {
        // 将消息转发给除了发送者以外的所有人 (或者发给所有人，取决于需求)
        // 这里我们发给除了自己以外的人，避免自己看到自己的“User scored”刷屏，
        // 或者你可以选择发给所有人。这里我们选择发给*其他人*。
        if (c.id !== connection.id) {
          c.ws.send(data);
        }
      });
    });

    // 3. 处理连接断开
    ws.on('close', () => {
      const pos = connections.findIndex((o, i) => o.id === connection.id);
      if (pos >= 0) {
        connections.splice(pos, 1);
        // 广播更新后的人数
        broadcastCount();
      }
    });

    // 4. 心跳检测 (保持连接活跃)
    ws.on('pong', () => {
      connection.alive = true;
    });
  });

  // 广播在线人数的辅助函数
  function broadcastCount() {
    const countMsg = JSON.stringify({ type: 'count', value: connections.length });
    connections.forEach((c) => {
      c.ws.send(countMsg);
    });
  }

  // 定时清理死连接
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