const User = require('../models/User')

let hello = ''

exports.allUsers = function(req, res, next) {
  const id = req.get('userId')

  User.findOne({ _id: id })
    .then(user => {
      if (!user) {
        return res.json({
          status: 404,
          message: 'Пользователь не найден'
        })
      }

      if (user.accessLevel === 0) {
        return res.json({
          status: 403,
          message: 'Доступ запрещен'
        })
      }

      User.find({})
        .then(users => {
          let data = []

          users.forEach(el => {
            data.push({
              name: el.userName,
              _id: el._id,
              date: el.createdAt
            })
          })

          res.json({
            status: 200,
            data
          })
        })
        .catch(({ message }) => {
          next(message)
        })
    })
    .catch(({ message }) => {
      next(message)
    })
}

exports.getUser = function(req, res, next) {
  const id = req.get('userId')
  const name = req.params.name

  User.findOne({ _id: id }).then(user => {
    if (!user) {
      return res.json({
        status: 404,
        message: 'Пользователь не найден'
      })
    }

    if (user.accessLevel === 0) {
      return res.json({
        status: 403,
        message: 'Доступ запрещен'
      })
    }

    User.findOne({ userName: name }).then(foundUser => {
      res.json({
        status: 200,
        user: foundUser
      })
    })
  })
}

exports.editUser = function(req, res, next) {
  const id = req.get('userId')
  const form = req.body

  User.findOne({ _id: id }).then(user => {
    if (!user) {
      return res.json({
        status: 404,
        message: 'Пользователь не найден'
      })
    }

    if (user.accessLevel === 0 || user.accessLevel === undefined) {
      return res.json({
        status: 403,
        message: 'Доступ запрещен'
      })
    }

    User.findOne({ _id: form._id }).then(editableUser => {
      if (!editableUser) {
        return res.json({
          status: 404,
          message: 'Пользователь не найден'
        })
      }

      editableUser.userName = form.userName
      editableUser.email = form.email
      editableUser.description = form.description
      editableUser.accessLevel = form.accessLevel
      editableUser.save()

      res.json({
        status: 200,
        message: 'Пользователь изменен!'
      })
    })
  })
}
