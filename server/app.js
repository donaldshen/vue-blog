const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const winston = require('winston')
const expressWinston = require('express-winston')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const config = require('config-lite')(__dirname)
const cookieParser = require('cookie-parser')

const isProduction = process.env.NODE_ENV === 'production'
const app = express()

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', `http://localhost:${config.clientPort}`)
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin')
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,DELETE,PUT')
  next()
})

app.use((req, res, next) => {
  req.query && console.log('query:', req.query)
  req.body && console.log('body:', req.body)
  req.cookies && console.log('cookies:', req.cookies)
  next()
})

app.use(session({
  // 设置 cookie 中保存 session id 的字段名称
  name: 'blog-sid',
  // 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
  secret: 'weak-secret',
  cookie: {
    // 过期时间，过期后 cookie 中的 session id 自动删除
    maxAge: 1000 * 60 * 60 * (isProduction ? 24 : 8),
    // 生产环境应启用
    httpOnly: isProduction,
  },
  store: new MongoStore({
    url: config.mongodbURI,
  }),
  resave: false,
  saveUninitialized: false,
}))

// test dist
app.use('/dist', express.static(path.join(__dirname, '../dist')))

if (isProduction) {
  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true,
      }),
      // new winston.transports.File({
      //   filename: 'logs/success.log',
      // }),
    ],
  }))
}

app.use('/api', require('./router'))

if (isProduction) {
  app.use(expressWinston.errorLogger({
    transports: [
      new winston.transports.Console({
        json: true,
        colorize: true,
      }),
      // new winston.transports.File({
      //   filename: 'logs/error.log',
      // }),
    ],
  }))
}

app.listen(config.serverPort)
