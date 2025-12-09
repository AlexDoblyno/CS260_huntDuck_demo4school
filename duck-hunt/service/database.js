import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { v4 as uuid } from 'uuid';

const userName = process.env.MONGOUSER || 'Alex';
const password = process.env.MONGOPASSWORD || '600123abc';
const hostname = process.env.MONGOHOSTNAME || 'cluster0.oj2uccb.mongodb.net/?appName=Cluster0';

const url = userName 
  ? `mongodb+srv://${userName}:${password}@${hostname}` 
  : `mongodb://${hostname}/duckhunt`;

const client = new MongoClient(url);
const db = client.db('duckhunt');
const scoreCollection = db.collection('scores');
const userCollection = db.collection('users'); // 新增用户集合

(async function testConnection() {
  try {
    await client.connect();
    await db.command({ ping: 1 });
    console.log(`✅ Connected to MongoDB`);
  } catch (error) {
    console.error(`❌ DB Connection Error: ${error}`);
    process.exit(1);
  }
})();

export async function getHighScores() {
  const query = { score: { $gt: 0 } };
  const options = { sort: { score: -1 }, limit: 10 };
  return scoreCollection.find(query, options).toArray();
}

export async function addScore(scoreData) {
  return scoreCollection.insertOne(scoreData);
}

export function getUser(email) {
  return userCollection.findOne({ email: email });
}

export function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

export async function createUser(email, password) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = {
    email: email,
    password: passwordHash,
    token: uuid(),
  };
  await userCollection.insertOne(user);
  return user;
}