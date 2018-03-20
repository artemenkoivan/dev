const User = require('../models/User')
const Question = require('../models/Question')
const Answer = require('../models/Answer')
const Tag = require('../models/Tag')
const countAmount = require('../../src/helpers/countAmount')
const Notification = require('../models/Notification')

exports.create = function(req, res, next) {
  const { title, body, tags, userId } = req.body

  User.findById({ _id: userId })
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: 'Пользователь не найден'
        })
      }

      let data = []

      tags.forEach(el => {
        data.push(el)
      })

      let question = new Question({
        title,
        body,
        tags: data,
        author: userId
      })

      question.save(error => {
        if (error) {
          return res.json({
            status: 400,
            message: 'Произошла ошибка при сохранении вопроса!'
          })
        }
      })

      tags.forEach(el => {
        Tag.findOne({ _id: el._id }).then(tag => {
          tag.questions.push(question)
          tag.save()
        })
      })

      user.questions.push(question)
      user.save()

      res.status(200).json({
        message: 'Вопрос успешно создан!'
      })
    })
    .catch(({ message }) => {
      next(message)
    })
}

exports.getWithLimit = function(req, res, next) {
  const { limit } = req.params
  let limitNumber = parseInt(limit)
  let questionsAmount = 0

  Question.find().then(data => {
    questionsAmount = data.length
  })

  Question.find({})
    .limit(limitNumber)
    .populate('tags')
    .then(questions => {
      let data = []

      questions.forEach(el => {
        let questionSolved = false

        if (el.solved !== undefined) {
          questionSolved = el.solved
        }

        data.push({
          title: el.title,
          solved: questionSolved,
          answers: countAmount(el.answers.length, [
            'ответ',
            'ответа',
            'ответов'
          ]),
          tags: el.tags.map(tag => {
            return { title: tag.title, cover: tag.cover }
          }),
          createdAt: el.createdAt,
          _id: el._id
        })
      })

      res.status(200).json({
        data,
        questionsAmount
      })
    })
    .catch(({ message }) => {
      next(message)
    })
}

// TODO: remove this
exports.getAll = function(req, res, next) {
  Question.find({})
    .populate('tags')
    .then(questions => {
      let data = []

      questions.forEach(el => {
        let questionSolved = false

        if (el.solved !== undefined) {
          questionSolved = el.solved
        }

        data.push({
          title: el.title,
          solved: questionSolved,
          answers: countAmount(el.answers.length, [
            'ответ',
            'ответа',
            'ответов'
          ]),
          tags: el.tags.map(tag => {
            return { title: tag.title, cover: tag.cover }
          }),
          createdAt: el.createdAt,
          _id: el._id
        })
      })

      res.status(200).json({
        data
      })
    })
    .catch(({ message }) => {
      next(message)
    })
}

exports.getOne = function(req, res, next) {
  const _id = req.params.id

  Question.findById({ _id })
    .populate('answers author')
    .then(question => {
      if (!question) {
        return res.json({
          status: 404,
          message: 'Вопрос не найден'
        })
      }

      let questionSolved

      if (question.solved !== undefined) {
        questionSolved = question.solved
      }

      function whenDone(tags) {
        let responseData = {
          title: question.title,
          author: question.author,
          body: question.body,
          userName: '',
          solved: questionSolved,
          createdAt: question.createdAt,
          answers: question.answers,
          tags,
          questionId: question._id
        }

        res.status(200).json({
          data: responseData
        })
      }

      let tags = []
      let counter = 0

      question.tags.forEach(tag => {
        counter++

        Tag.findById({ _id: tag }).then(tagItem => {
          if (tagItem) {
            tags.push(tagItem)

            if (tags.length === counter) {
              whenDone(tags)
            }
          }
        })
      })
    })
}

exports.saveEditedAnswer = function(req, res, next) {
  const { body, _id } = req.body

  Answer.findOne({ _id }).then(answer => {
    answer.body = body
    answer.save()

    res.json({
      status: 200,
      message: 'Ответ изменен'
    })
  })
}

exports.removeAnswer = function(req, res, next) {
  const _id = req.params.id
  const questionId = req.params.questionId

  Answer.findOne({ _id }).then(answer => {
    Question.findOne({ _id: questionId }).then(question => {
      question.answers.pull(_id)
      question.save()
      answer.remove()

      res.json({
        status: 200,
        message: 'Ответ удален!'
      })
    })
  })
}

exports.addAnswer = function(req, res, next) {
  const { body, author, userName, toUser, questionId } = req.body

  if (!body) {
    return res.json({
      status: 400,
      message: 'Ответ не может быть пустым!'
    })
  }

  let likeNotification = new Notification({
    title: `${userName} ответил на ваш вопрос`
  })

  User.findOne({ _id: toUser }).then(user => {
    user.notifications.push(likeNotification)
    likeNotification.save()
    user.save()
  })

  const newAnswer = new Answer({
    body,
    author: {
      _id: author,
      name: userName
    },
    referenceQuestion: questionId
  })

  Question.findOne({ _id: questionId })
    .then(question => {
      if (!question) {
        return res.json({
          status: 404,
          message: 'Вопрос не найден!'
        })
      }

      Question.findOne({ _id: questionId })
        .populate('answers')
        .then(answers => {
          let flag = false

          answers.answers.forEach(el => {
            if (el.author._id === author) {
              flag = true
            }
          })

          return flag
        })
        .then(flag => {
          if (flag) {
            return res.json({
              status: 400,
              message: 'Вы уже отвечали на этот вопрос!'
            })
          }

          newAnswer.save()
          question.answers.push(newAnswer)

          User.findOne({ _id: author }).then(user => {
            user.answers.push(newAnswer)
            user.save()
          })

          question.save(error => {
            if (error) {
              return res.json({
                status: 400,
                message: 'Ошибка при сохранении ответа на вопрос'
              })
            }

            res.status(200).json({
              message: 'Ответ сохранен!'
            })
          })
        })
    })
    .catch(({ message }) => {
      next(message)
    })
}

exports.likeAnswer = function(req, res, next) {
  const { id, userName, toUser } = req.body

  Answer.findOne({ _id: id })
    .then(answer => {
      if (!answer) {
        return res.json({
          status: 404,
          message: 'Ответ не найден!'
        })
      }

      if (answer.likes.length === 0) {
        answer.likes.push(userName)
      } else {
        answer.likes.forEach((el, index, likes) => {
          if (el === userName) {
            likes.pull(userName)
            return
          } else {
            likes.push(userName)

            let likeNotification = new Notification({
              title: `${userName} понравился ваш ответ`
            })

            User.findOne({ _id: toUser._id }).then(user => {
              user.notifications.push(likeNotification)
              likeNotification.save()
              user.save()
            })
          }
        })
      }

      answer.save()

      res.status(200).json({
        message: 'Вы лайкнули ответ!',
        more: answer.likes
      })
    })
    .catch(({ message }) => {
      next(message)
    })
}

exports.markSolved = function(req, res, next) {
  const { _id, questionId, questionAuthor, toUser } = req.body

  let solveNotification = new Notification({
    title: `${questionAuthor} отметил ваш ответ решением`
  })

  User.findOne({ _id: toUser._id }).then(user => {
    user.notifications.push(solveNotification)
    solveNotification.save()
    user.save()
  })

  Answer.findOne({ _id }).then(answer => {
    if (answer) {
      Question.findOne({ _id: questionId }).then(question => {
        if (!question.solved && !answer.solved) {
          answer.solved = true
          question.solved = true
          answer.save()
          question.save()

          return res.status(200).json({
            message: 'Вы отметили ответ решением',
            data: question
          })
        } else {
          answer.solved = false
          question.solved = false
          answer.save()
          question.save()

          return res.status(200).json({
            message: 'Вы убрали решение с ответа',
            data: question
          })
        }
      })
    }
  })
}
