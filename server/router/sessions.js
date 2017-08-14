const bcrypt = require('bcrypt')
const { UserModel } = require('../mongo.js')
const router = require('express').Router()
const { checkLogin } = require('./utils')

router.route('/')
  .get((req, res) => {
    res.status(200).json({
      user: req.session.user,
    })
  })
  .post(checkLogin(false), async (req, res, next) => {
    const name = req.body.name
    let user
    try {
      user = await UserModel.get({ name })
    } catch (e) {
      next(e)
    }
    if (user) {
      let succeed
      try {
        succeed = await bcrypt.compare(req.body.password, user.password)
      } catch (e) {
        next(e)
        return
      }
      if (succeed) {
        delete user.password
        req.session.user = user
        res.status(200).json({
          message: '登录成功',
          user,
        })
      } else {
        res.status(403).json({
          message: '密码错误',
        })
      }
    } else {
      res.status(403).json({
        message: '用户名不存在',
      })
    }
  })
  .delete(checkLogin(true), (req, res, next) => {
    req.session.destroy((e) => {
      if (e) {
        next(e)
      } else {
        res.status(200).json({
          message: '登出成功',
        })
      }
    })
  })

module.exports = router
