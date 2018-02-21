const User = require('../models/User')
const Answer = require('../models/Answer')
const Question = require('../models/Question')
const countAmount = require('../../src/helpers/countAmount')
const multer  = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../src/uploads/avatars')
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}.jpg`)
  }
})

const upload = multer({ storage: storage }).single('avatar')

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
          description: user.description,
          avatar: user.avatar,
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

exports.editProfile = function (req, res, next) {
  const { _id, email, description } = req.body

  User.findOne({ _id }).then(user => {
    if (email === undefined || email === null) {
      return res.status(200).json({
        message: 'Эл. почта не изменилась',
        data: user
      })
    }

    if (email.length) {
      user.email = email
    }

    if (description.length) {
      user.description = description
    }
    user.save()

    res.status(200).json({
      message: 'Изменения сохранены',
      data: user
    })
  })
  .catch(({ message }) => {
    next(message)
  })
}

exports.editProfileAvatar = function (req, res, next) {
  const _id = req.get('userId')

  upload(req, res, error => {
    if (error) {
      return res.json({
        status: 400,
        message: error.message
      })
    }

    User.findOne({ _id }).then(user => {
      user.avatar = req.file.filename
      user.save()
      
      res.json({
        status: 200,
        message: 'Изменения сохранены',
        data: user
      })
    }).catch(({ message }) => {
      next(message)
    })
  })
}