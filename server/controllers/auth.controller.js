const jwt = require('jsonwebtoken')
const User = require('../models/User')
const config = require('../config/index')

exports.register = function(request, response, next) {
  const credentials = request.body
  const { userName, email, password } = request.body

  if (!email || !password || !userName) {
    return response.json({
      status: 400,
      message: 'Данные введены неверно'
    })
  } else {
    User.findOne({ email }).then(user => {
      if (user) {
        return response.json({
          status: 409,
          message: 'Пользователь с таким e-mail уже существует'
        })
      }

      User.create(credentials)
        .then(user => {
          let token = jwt.sign({ _id: user._id }, config.secret)

          return response.json({
            access_token: token,
            user: {
              id: user.id,
              email,
              userName: user.userName
            }
          })
        })
        .catch(error => {
          next(error)
        })
    })
  }
}

exports.login = function(request, response, next) {
  let { email, password } = request.body

  User.findOne({ email })
    .then(user => {
      if (user) {
        user
          .comparePasswords(password)
          .then(function(password) {
            if (!password) {
              return response.json({
                status: 400,
                message: 'Пароль введен неверно'
              })
            } else {
              let token = jwt.sign({ _id: user._id }, config.secret)

              return response.json({
                status: 200,
                access_token: token,
                user: {
                  id: user.id,
                  email,
                  userName: user.userName
                }
              })
            }
          })
          .catch(({ message }) => {
            next(message)
          })
      } else {
        return response.json({
          status: 404,
          message: 'Пользователь с таким E-mail не найден'
        })
      }
    })
    .catch(({ message }) => {
      next(message)
    })
}
