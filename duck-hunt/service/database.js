import { MongoClient } from 'mongodb';

const userName = process.env.MONGOUSER;
const password = process.env.MONGOPASSWORD;
const hostname = process.env.MONGOHOSTNAME || 'localhost:27017';

let url;

if (userName && password) {
  // 如果有用户名和密码，连接 MongoDB Atlas (云端)
  url = `mongodb+srv://${userName}:${password}@${hostname}`;
} else {
  // 如果没有，连接本地 MongoDB
  // 这里的 /duckhunt 是数据库的名字，如果没有它会自动创建
  url = `mongodb://${hostname}/duckhunt`;
}

// 创建连接客户端
const client = new MongoClient(url);
const scoreCollection = client.db('duckhunt').collection('scores');

// 测试连接并打印当前模式
(async function testConnection() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log(`✅ Connected successfully to MongoDB (${userName ? 'Atlas Cloud' : 'Localhost'})`);
  } catch (error) {
    console.error(`❌ Unable to connect to database: ${url}`, error);
    process.exit(1); // 连接失败直接退出
  }
})();

export async function getHighScores() {
  const query = { score: { $gt: 0 } };
  const options = {
    sort: { score: -1 },
    limit: 10,
  };
  const cursor = scoreCollection.find(query, options);
  return cursor.toArray();
}

export async function addScore(scoreData) {
  const result = await scoreCollection.insertOne(scoreData);
  return result;
}