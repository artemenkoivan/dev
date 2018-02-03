const User = require('../models/User')
const Answer = require('../models/Answer')
const Question = require('../models/Question')
const countAmount = require('../../src/helpers/countAmount')

exports.getUserInfo = function (req, res, next) {
  const id = req.params.id

  User.findOne({ _id: id })
      .then(user => {
        res.json({
          status: 200,
          user
        })
      })
      .catch(({ message }) => {
        next(message)
      })
}

exports.getProfile = function (req, res, next) {
  const name = req.params.name

  User.findOne({ userName: name }).populate('questions answers').then(user => {
    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден'
      })
    }

    let questions = []
    let counter = 0

    function whenDone(questions) {
      res.status(200).json({
        profile: {
          userName: user.userName,
          email: user.email,
          _id: user._id,
          createdAt: user.createdAt,
          questions,
          answers: user.answers
        }
      })
    }
    
    if (user.questions.length > 0) {
      user.questions.forEach((element, index) => {
        counter++
  
        Question.findOne({ _id: element._id }).populate('tags').then(el => {
          questions.push({
            title: el.title,
            solved: el.solved,
            answers: countAmount(el.answers.length, ['ответ', 'ответа', 'ответов']),
            tags: el.tags.map(tag => {
              return { title: tag.title, cover: tag.cover }
            }),
            createdAt: el.createdAt,
            _id: el._id
          })
  
          if (counter === questions.length) {
            whenDone(questions)
          }
        })
      })
    } else {
      whenDone([])
    }
  })
  .catch(({ message }) => next(message))
}