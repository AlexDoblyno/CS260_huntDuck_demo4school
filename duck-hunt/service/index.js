import express from 'express';
import cookieParser from 'cookie-parser'; // 引入
import bcrypt from 'bcryptjs';
import { addScore, getHighScores, getUser, createUser, getUserByToken } from './database.js';
import { peerProxy } from './peerProxy.js';

const app = express();
const port = process.argv.length > 2 ? process.argv[2] : 4000;

app.use(express.json());
app.use(cookieParser()); // 启用 Cookie 解析

const verifyAuth = async (req, res, next) => {
  const token = req.cookies['token'];
  const user = await getUserByToken(token);
  if (user) {
    next();
  } else {
    res.status(401).send({ msg: 'Unauthorized' });
  }
};

const apiRouter = express.Router();
app.use('/api', apiRouter);

apiRouter.post('/auth/create', async (req, res) => {
  if (await getUser(req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await createUser(req.body.email, req.body.password);
    setAuthCookie(res, user.token);
    res.send({ id: user._id });
  }
});

apiRouter.post('/auth/login', async (req, res) => {
  const user = await getUser(req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user.token);
      res.send({ id: user._id });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

// --- 3. 登出接口 ---
apiRouter.delete('/auth/logout', (_req, res) => {
  res.clearCookie('token');
  res.status(204).end();
});

apiRouter.get('/scores', async (_req, res) => {
  const scores = await getHighScores();
  res.send(scores);
});

apiRouter.post('/score', verifyAuth, async (req, res) => {
  const newScore = req.body;
  await addScore(newScore);
  const scores = await getHighScores();
  res.send(scores);
});

function setAuthCookie(res, token) {
  res.cookie('token', token, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.use(express.static('public'));
app.use((_req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

const httpService = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

peerProxy(httpService);