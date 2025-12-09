const express = require('express');
const app = express();

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