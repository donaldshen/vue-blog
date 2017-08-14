const bcrypt = require('bcrypt')
const { UserModel } = require('../mongo.js')
const router = require('express').Router()
const { checkLogin } = require('./utils')

router.route('/')
  .post(checkLogin(false), async (req, res, next) => {
    const user = req.body
    const saltRounds = 10
    const hash = await bcrypt.hash(user.password, saltRounds)
    user.password = hash
    try {
      await UserModel.add(user)
      delete user.password
      req.session.user = user
      res.status(201).json({
        message: '注册成功',
        user,
      })
    } catch (e) {
      if (e.code === 11000) {
        res.status(409).json({
          message: '用户名已被使用！',
        })
      } else {
        next(e)
      }
    }
  })
  .delete(checkLogin(true), async (req, res, next) => {
    try {
      UserModel.delete({ name: req.session.user.name })
    } catch (e) {
      next(e)
    }
    req.session.destroy((e) => {
      if (e) {
        next(e)
      } else {
        res.status(200).json({
          message: '注销成功',
        })
      }
    })
  })

module.exports = router
