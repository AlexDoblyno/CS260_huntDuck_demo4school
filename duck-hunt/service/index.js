import express from 'express';
import { addScore, getHighScores } from './database.js'; // 导入数据库函数

const app = express();

app.use(express.json());

const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.get('/scores', async (_req, res) => {
  try {
    const scores = await getHighScores();
    res.send(scores);
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: 'Internal Server Error' });
  }
});

// SubmitScore 接口 (改为 async)
apiRouter.post('/score', async (req, res) => {
  try {
    const newScore = req.body;
    await addScore(newScore);
    
    // 插入成功后，重新获取最新排行榜返回给前端
    const scores = await getHighScores();
    res.send(scores);
  } catch (error) {
    console.error(error);
    res.status(500).send({ msg: 'Internal Server Error' });
  }
});

app.use(express.static('dist'));

app.use((_req, res) => {
  res.sendFile('index.html', { root: 'dist' });
});

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});