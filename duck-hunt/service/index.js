import express from 'express';
const app = express();

app.use(express.json());

let scores = [
  { name: 'Hunter1', score: 50, date: '2024-10-01' },
  { name: 'Hunter2', score: 40, date: '2024-10-02' },
];

const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.get('/scores', (_req, res) => {
  res.send(scores);
});

apiRouter.post('/score', (req, res) => {
  const newScore = req.body;
  scores.push(newScore);
  scores.sort((a, b) => b.score - a.score);
  if (scores.length > 10) {
    scores.length = 10;
  }
  res.send(scores);
});

app.use(express.static('dist'));

app.use((_req, res) => {
  res.sendFile('index.html', { root: 'dist' });
});

const port = process.argv.length > 2 ? process.argv[2] : 4000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});