const path = require('path');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const static = require('koa-static');
const render = require('koa-art-template');
const session = require('koa-session');
const app = new Koa();

// 导入 controller 中间件
const controller = require('../controllers/controller.js');

// 配置 koa-art-template 模板引擎
render(app, {
  root: path.join(__dirname, '../views'),    // 视图的位置
  extname: '.html',    // 后缀名
  debug: process.env.NODE_ENV !== 'production'    // 量澡开启调试模式
})

// 配置 session 中间件
app.keys = ['some secret hurr'];  // session 签名

const CONFIG = {
  key: 'koa:sess',
  maxAge: 8640000,
  overwrite: true,
  httpOnly: true,   // 只有服务器端可以获取 cookie
  signed: true,     // 签名
  rolling: false,   // 在每次请求时强行设置 cookie, 这将重置 cookie 过期时间（默认： false）
  renew: true
}

app.use(session(CONFIG, app));

app.use(static('static'));

app.use(bodyParser());
app.use(controller());

app.listen(30090);
console.log('app started at port 30090...');