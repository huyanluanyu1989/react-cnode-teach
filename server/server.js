const express = require('express')
const favicon = require('serve-favicon')
// 引用ReactSSR模块
const ReactSSR = require('react-dom/server')
const bodyParser = require('body-parser')
const session = require('express-session')
const fs = require('fs')
// 用绝对路径
const path = require('path')
const app = express()
const isDev = process.env.NODE_ENV === 'development'

// 把json数据请求格式转化成req.body上的数据
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid',
  resave: false,
  saveUninitialized: false,
  secret: 'react cnode class'
}))

app.use(favicon(path.join(__dirname, '../favicon.ico')))
// 使用api要放在服务端代码渲染之前
app.use('/api/user', require('./util/handle-login'))
app.use('/api', require('./util/proxy'))

if (!isDev) {
  // 服务端代码在serverEntry当中
  const serverEntry = require('../dist/server-entry').default
  // 同步去读文件
  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8')
  // 给静态文件指定对应的请求返回
  // path.join(__dirname, '../dist/')想要处理的静态文件的目录
  // 如果不加public无法在服务端区分到底是哪个路径返回静态内容，哪个路径返回服务端渲染的内容，加上之后就很方便区分了
  app.use('/public', express.static(path.join(__dirname, '../dist/')))

  // 从浏览器中发出的任何请求都让他返回服务端渲染的代码，服务端代码在serverEntry当中
  app.get('*', (req, res) => {
    const appString = ReactSSR.renderToString(serverEntry) // 得到的内容
    // 把template中的内容替换成appString
    res.send(template.replace('<!-- app -->', appString)) // send到浏览器
  })
} else {
  const devStatic = require('./util/dev-static')
  devStatic(app)
}
app.listen(3333, () => {
  console.log('server is listening on 3333 success')
})
