import express from 'express';
import { addScore, getHighScores } from './database.js';
import { peerProxy } from './peerProxy.js'; // 导入 WebSocket 模块

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());

const apiRouter = express.Router();
app.use('/api', apiRouter);

// 获取分数
apiRouter.get('/scores', async (_req, res) => {
  try {
    const scores = await getHighScores();
    res.send(scores);
  } catch (error) {
    res.status(500).send({ msg: 'Error getting scores' });
  }
});

// 提交分数
apiRouter.post('/score', async (req, res) => {
  try {
    const newScore = req.body;
    await addScore(newScore);
    const scores = await getHighScores();
    res.send(scores);
  } catch (error) {
    res.status(500).send({ msg: 'Error saving score' });
  }
});

// 托管静态文件
app.use(express.static('dist'));

// 所有未知请求返回 index.html
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'dist' });
});

// 启动 HTTP 服务
const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// 启动 WebSocket 服务 (传入 httpService)
peerProxy(httpService);