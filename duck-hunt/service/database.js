import { MongoClient } from 'mongodb';

// 从环境变量读取配置，如果没设置则使用默认值 (防止报错，但实际连接需要真实账号)
const userName = process.env.MONGOUSER || 'username';
const password = process.env.MONGOPASSWORD || 'password';
const hostname = process.env.MONGOHOSTNAME || 'cluster0.xxxxx.mongodb.net'; // 这里需要换成你的实际地址

if (!userName || !password || !hostname) {
  throw Error('Database configuration missing');
}


const url = `mongodb+srv://${userName}:${password}@${hostname}`;

const client = new MongoClient(url);
const scoreCollection = client.db('duckhunt').collection('scores');

// 测试连接函数 (可选，用于调试)
export async function testConnection() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log("Connected successfully to MongoDB server");
  } catch (error) {
    console.error("Unable to connect to database:", error);
  }
}

// 1. 获取前 10 名高分
export async function getHighScores() {
  const query = { score: { $gt: 0 } }; // 只查找分数大于0的
  const options = {
    sort: { score: -1 }, // 按分数降序排列 (-1)
    limit: 10,           // 只取前 10 名
  };
  
  const cursor = scoreCollection.find(query, options);
  return cursor.toArray();
}

// 2. 添加新分数
export async function addScore(scoreData) {
  const result = await scoreCollection.insertOne(scoreData);
  return result;
}