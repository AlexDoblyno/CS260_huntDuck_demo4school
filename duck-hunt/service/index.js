import express from 'express';
const app = express();

app.use(express.json());

// 内存中的分数数据 (暂时替代数据库)
let scores = [
  { name: 'Hunter1', score: 50, date: '2024-10-01' },
  { name: 'Hunter2', score: 40, date: '2024-10-02' },
];

// Router for API
const apiRouter = express.Router();
app.use('/api', apiRouter);

// GetScores 接口
apiRouter.get('/scores', (_req, res) => {
  res.send(scores);
});

// SubmitScore 接口
apiRouter.post('/score', (req, res) => {
  const newScore = req.body; // 前端传来的数据 {name, score, date}
  scores.push(newScore);
  // 保持只存前 10 名
  scores.sort((a, b) => b.score - a.score); 
  if (scores.length > 10) {
    scores.length = 10;
  }
  res.send(scores);
});
// 托管静态文件 (这是 Vite 构建后的产物)
app.use(express.static('dist'));

// 所有未知的请求都返回 index.html (支持 React Router 的 SPA 模式)
// 这样当你在 /scores 刷新页面时，不会 404
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'dist' });
});

// 启动端口
const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});