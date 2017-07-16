# simple Vue blog

> 前端：vue，vue-router，vuex，element-ui，axios；  
> 后端：express，mongodb，提供RESTful服务；  
> 用户验证：session。  
> 从0开始写项目代码，没有使用脚手架。参考了[vue-cli](https://github.com/vuejs/vue-cli)，[The Fine Art of the Webpack 2 Config](https://blog.flennik.com/the-fine-art-of-the-webpack-2-config-dc4d19d7f172)，[n-blog](https://github.com/nswbmw/N-blog)，[login](https://github.com/Selvin11/login)等项目

## Build Setup

``` bash
# 在本机启动MongoDB服务，监听默认端口（27017）。参照官网下载配置运行即可。

# install dependencies
npm install

# serve backend using nodemon at localhost:3000
npm run server

# serve frontend with hot reload at localhost:9000
npm run dev

# build for production, check localhost:3000/dist to see its result
npm run build
```
---
## MODEL
```
user {
  name,
  password,
  bio,
}
post {
  author,
  title,
  content,
  access,
}
```

## API/routing:
#### server
登录实际是对应的资源是 sessions，因此  
- GET /sessions # 获取会话信息
- POST /sessions # 创建新的会话（登录）
<!-- - PUT /sessions # 更新会话信息 -->
- DELETE /sessions # 销毁当前会话

而注册对应的资源是users，api如下：
<!-- - GET /users # 获取name用户的信息 -->
- POST /users # 创建新的用户（注册）
<!-- - PUT /users # 更新name用户的信息 -->
- DELETE /users # 删除当前用户（注销）

posts:
- GET /posts?author=name # 获取文章
- POST /posts # 发表文章
- PUT /posts/:id # 更新文章
- DELETE /posts/:id # 删除文章

#### client
- / # 主页，redirect to /posts
- /posts # 展示文章
- /posts/:id # 文章详情
- /signin
- /register
- /create # 发布文章页面


## webpack
- CommonsChunkPlugin：提取entry chunks中的公共module到新chunk中（待修订）
  - name：新chunk的名称。如果是某已存在的chunk，则公共module都提取到该chunk中
  - names：大坑
  - minChunks：
    - number：一个module至少存在于number个chunks中时，才会被提取
    - Infinity：会让所有module都不被提取
    - module=>boolean：就是filter函数
  - 多个bundle时顺序很重要。前头的bundle先提取的module。最后一个bundle里包含"webpack runtime code"，建议单独抽取到一个bundle里
  - Error: webpackJsonp is not defined：
    - Just to expand a little on the concept, the vendor has to come first since the runtime is contained in there (everything that defines all the variables and methods run during client load time because of all the webpacking). you use a manifest file (because of chunking and so on), you'll have to put that first since it will then contain the runtime because of the way the module is built.
- Error: Hot Module Replacement is disabled.
  - means the `HotModuleReplacementPlugin` is not used.
  - `--hot` adds it. (because the CLI have access to your webpack configuration)
  - `hot: true` in config file doesn't add it. (because the API doesn't have access to your webpack configuration)
  - devServer有时会无法正常加载vue文件。静候一段时间后问题或会消失（not a joke）。
- should not use [chunkhash] or [hash] for development. This will cause many other issues, like a memory leak, because the dev server does not know when to clean up the old files.


## test server
- node的http模块构建的服务器极其基础，至少需要配置各类文件的mime类型。express则是开箱即用。


## 同步登录状态
在每次切换路由时都checkLogin。原因如下
- Navbar要一直反映登录状态
- 其他方式会使checkLogin散落在组件、router、axios.interceptor等处。
- 而且刷新页面就会清空store，router的beforeEach钩子又在所有钩子之前。为了在beforeEach里检查用户登录状态，必须在这执行checkLogin


## 错误处理
- 根据王垠的观点，try/catch应尽量只包含可能出error的代码，而不是一个try/catch覆盖整个函数体。但这样做会增加一个function可能的出口：catch处
- express中next只是下一个middleware的引用。在catch中执行`next(e)`时，try/catch块后的代码仍会被执行。可以在catch末尾加`return`语句
- 通用错误处理代码交给axios的interceptors


## vue-router
- 在导航钩子（如beforeEach）中，确保next不被多次调用


## TODO
- [ ] oauth2
- [ ] ssr
- [ ] session-secret
- [ ] https
- [ ] avatar。上传功能
- [ ] comment
- [x] markdown
- [ ] collapse/expand
- [ ] 防止用户在多处登录
