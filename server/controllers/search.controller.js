const Tag = require('../models/Tag')
const User = require('../models/User')
const Question = require('../models/Question')

exports.search = function(req, res, next) {
  const query = req.params.any
  const searchResults = []

  let userRequest = User.find({ userName: { $regex: query, $options: 'i' } })
    .then(results => {
      if (!results) {
        return res.json({
          status: 404,
          message: 'Пользователь не найден'
        })
      }

      results.forEach(el => {
        searchResults.push({
          value: el.userName,
          img: el.avatar,
          address: '/user/' + el.userName
        })
      })
    })
    .catch(({ message }) => {
      next(message)
    })

  let tagRequest = Tag.find({ title: { $regex: query, $options: 'i' } })
    .then(results => {
      if (!results) {
        return res.json({
          status: 404,
          message: 'Тег не найден'
        })
      }

      results.forEach(el => {
        searchResults.push({
          value: el.title,
          img: el.cover,
          address: '/tag/' + el.title
        })
      })
    })
    .catch(({ message }) => {
      next(message)
    })

  let questionRequest = Question.find({
    title: { $regex: query, $options: 'i' }
  })
    .then(results => {
      if (!results) {
        return res.status(404).json({
          message: 'Вопросы не найдены'
        })
      }

      results.forEach(el => {
        searchResults.push({
          value: el.title,
          address: '/question/' + el._id
        })
      })
    })
    .catch(({ message }) => {
      next(message)
    })

  Promise.all([userRequest, tagRequest, questionRequest])
    .then(function() {
      res.status(200).json({
        searchResults
      })
    })
    .catch(({ message }) => {
      return next(message)
    })
}
