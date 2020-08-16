const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const app = new Koa();

app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
  await next();
});

router.get('/hello/:name', async (ctx, next) => {
  var name = ctx.params.name;
  ctx.response.body = `<h1>Hello, ${name}!</h1>`;
});

router.get('/', async (ctx, next) => {
  ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="name" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;
});

router.post('/signin', async (ctx, next) => {
  var request = ctx.request.body,
      name = request.name || '',
      password = request.password || '';

  console.log(`signin with name: ${name}, password: ${password}`);

  if(name === 'koa' && password === '123456'){
    ctx.response.body = `<h1>Welcome, ${name}</h1>`;
  } else {
    ctx.response.body = `<h1>登录失败!</h1>
    <p><a href="/">重试</a></p>`
  }
});

router.get('/', async (ctx, next) => {
  ctx.response.body = `<h1>Index</h1>`;
});

app.use(bodyParser());
app.use(router.routes());
app.listen(30090);
console.log('app started at port 30090...');