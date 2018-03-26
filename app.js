const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-session-minimal')

const cors = require('koa2-cors')
/* const session = require('koa-session-minimal') */
/* const MongooseStore = require('koa-session-mongoose'); */

const routes = require('./routes/index')

// error handler
onerror(app)
// 具体参数我们在后面进行解释
app.use(cors({
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5 * 60,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))

let expires = new Date(new Date().getTime() + 60 * 60 * 1000 * 24)
let cookie = {
  maxAge: 30 * 60 * 1000, // cookie有效时长
  expires: expires,
  patth: "/api",
  httpOnly: false, // 是否只用于http请求中获取
  overwrite: false // 是否允许重写
}

app.use(session({
  key: 'userId',
  cookie: cookie,
  expires: expires,
  path: "/api"
}))


// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes

app.use(routes.routes(), routes.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app