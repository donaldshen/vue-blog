module.exports = {
  checkLogin (status) {
    return (req, res, next) => {
      // console.log(req.session)
      if (!!req.session.user === status) {
        next()
      } else {
        res.status(403).json({
          message: status ? '未登录' : '已登录'
        })
      }
    }
  }
}
