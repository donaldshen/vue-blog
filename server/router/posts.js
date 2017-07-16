const PostModel = require('../mongo.js').PostModel
const router = require('express').Router()
const { checkLogin } = require('./utils')

router.route('/')
  .get(async (req, res, next) => {
    try {
      const posts = await PostModel.get(req.query.author)
      res.status(200).send(posts)
    } catch (e) {
      next(e)
    }
  })
  .post(checkLogin(true), async (req, res, next) => {
    try {
      await PostModel.add(req.body)
      res.status(201).json({
        message: '发布成功'
      })
    } catch (e) {
      next(e)
    }
  })

router.route('/:id')
  .delete(checkLogin(true), async (req, res, next) => {
    try {
      await PostModel.delete({ id: req.params.id })
      res.status(200).json({
        message: '文章已删除'
      })
    } catch (e) {
      next(e)
    }
  })
  .put(checkLogin(true), async (req, res, next) => {
    try {
      const query = Object.assign({
        id: req.params.id
      }, req.body)
      console.log(query)
      await PostModel.update(query)
      res.status(200).json({
        message: '修改成功'
      })
    } catch (e) {
      next(e)
    }
  })

module.exports = router
