const DB = require('../module/db');
const koaRequest = require('koa2-request');

/**
 * 首页信息
 */
const fn_index = async (ctx, next) => {

  // 获取 session
  // console.log('获取到的 session 数据：', ctx.session.userInfo);

  let userList = await DB.find('user');

  await ctx.render('index', {
    userList: userList
  });
};

/**
 * 登录信息
 */
const fn_signin = async (ctx, next) => {
  let request = ctx.request.body,
      name = request.name || '',
      password = request.password || '';

  console.log(`signin with name: ${name}, password: ${password}`);

  // 设置 session
  ctx.session.userInfo = '扫地僧';

  if(name === 'saodiseng' && password === '123456'){
    ctx.response.body = `<h1>Welcome, ${name}</h1>`;
  } else {
    ctx.response.body = `<h1>登录失败!</h1>
    <p><a href="/">重试</a></p>`
  }
};

/**
 * 获取用户信息
 */
const fn_getUserInfo = async (ctx, next) => {
  let dbData = await DB.find('user');
  ctx.response.type = 'application/json';
  ctx.response.body = dbData;
}

/**
 * 获取第三方接口信息(获取的是列表，详情接口如下)
 * 详情接口：https://api.apiopen.top/getSingleJoke?sid=
 */
const fn_getThirdPartyApi = async (ctx, next) => {
  let query = ctx.request.query;
  let pageNum = query.page || 1;
  let count = query.count || 10;
  let type = query.type || 'all';     // 可选参数：all/video/image/gif/text

  // GET 方式
  let res = await koaRequest({
    url: 'https://api.apiopen.top/getJoke',
    method: 'post',
    qs: {
      page: pageNum,
      count: count,
      type: type
    }
  });

  // POST 方式
  // let res = await koaRequest({
  //   url: 'https://api.apiopen.top/getJoke',
  //   method: 'post',
  //   form: {
  //     page: pageNum,
  //     count: count,
  //     type: type
  //   }
  // });
  ctx.response.body = res.body;
  // ctx.render('duanzi', {
  //   res
  // });
}

/**
 * 新増用户信息
 */
const show_addUserInfo = async (ctx, next) => {
  await ctx.render('addOrUpdate', {
    options: {
      title: '新増用户',
      doPageUrl: '/doAddUserInfo',
      doBtnText: '新増'
    },
    data: {
      "age": 1
    }    
  })
}

const fn_addUserInfo = async (ctx, next) => {
  let params = ctx.request.body
  let id = new Date().getTime().toString(16) + Math.random().toString(16).slice(-11)
  let result = await DB.insert('user', {
    "id": id,
    "name": params.name,
    "sex": params.sex,
    "age": Number(params.age),
    "status": "1"
  });

  try{
    if(result.result.ok === 1){
      ctx.redirect('/')
    }
  } catch(err){
    ctx.redirect('/')
  }
}

/**
 * 更新用户信息
 */
const show_updataUserInfo = async (ctx, next) => {
  let userInfo = await DB.find('user', {
    "id": ctx.request.query.id
  });
  await ctx.render('addOrUpdate', {
    options: {
      title: '更新用户信息',
      doPageUrl: '/doUpdateUserInfo',
      doBtnText: '更新'
    },
    data: {
      ...userInfo[0]
    }
  })
}

const fn_updateUserInfo = async (ctx, next) => {
  let params = ctx.request.body
  let result = await DB.update('user', {
    "id": params.id
  }, {
    "name": params.name,
    "sex": params.sex,
    "age": Number(params.age)
  });

  try{
    if(result.result.ok === 1){
      ctx.redirect('/')
    }
  } catch(err){
    ctx.redirect('/')
  }
}

/**
 * 删除用户信息
 */
const fn_deleteUserInfo = async (ctx, next) => {
  let query = ctx.request.query

  if(typeof query.id === 'undefined' || query.id === ''){
    ctx.response.body = '小朋友不可以调皮哟~'
    return
  }

  let result = await DB.remove('user', {
    "id": query.id
  });

  try{
    if(result.result.ok === 1){
      ctx.redirect('/')
    }
  } catch(err){
    ctx.redirect('/')
  }
}

module.exports = {
  'GET /': fn_index,
  'GET /signin': fn_signin,
  'GET /getUserInfo': fn_getUserInfo,
  'GET /duanzi': fn_getThirdPartyApi,
  'GET /addUserInfo': show_addUserInfo,
  'POST /doAddUserInfo': fn_addUserInfo,
  'GET /updateUserInfo': show_updataUserInfo,
  'POST /doUpdateUserInfo': fn_updateUserInfo,
  'GET /deleteUserInfo': fn_deleteUserInfo
}