const Tag = require('../models/Tag')
const User = require('../models/User')
const Question = require('../models/Question')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../src/uploads/tags')
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}.jpg`)
  }
})

const upload = multer({ storage: storage }).single('cover')

exports.create = function(req, res, next) {
  const { title, description } = req.query
  const id = req.get('userId')

  upload(req, res, error => {
    if (error) {
      return res.json({
        status: 400,
        message: error.message
      })
    }

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

        Tag.findOne({ title })
          .then(tag => {
            if (tag) {
              return res.json({
                status: 409,
                message: `Тег ${title} уже существует`
              })
            }

            let newTag = new Tag({
              title,
              description,
              cover: req.file.filename,
              questions: [],
              subscribers: []
            })

            newTag.save(error => {
              if (error) {
                return res.json({
                  status: 400,
                  message: 'Произошла ошибка при сохранении тега'
                })
              }

              res.status(200).json({
                message: 'Тег успешно создан!'
              })
            })
          })
          .catch(({ message }) => {
            next(message)
          })
      })
      .catch(({ message }) => {
        next(message)
      })
  })
}

exports.getAll = function(req, res, next) {
  Tag.find({}).then(tags => {
    let data = []

    tags.forEach(item => {
      data.push({
        title: item.title,
        cover: item.cover,
        questions: item.questions,
        _id: item._id
      })
    })

    res.status(200).json({
      data
    })
  })
}

exports.getOne = function(req, res, next) {
  const name = req.params.tagName

  Tag.find({ title: { $regex: name, $options: 'i' } })
    .populate('questions')
    .then(tags => {
      let data = []

      if (!tags) {
        return res.status(404).json({
          message: 'Ничего не найдено'
        })
      }

      tags.forEach(item => {
        data.push({
          value: item.title,
          _id: item.id,
          data: item
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

exports.follow = function(req, res, next) {
  const { tagId, userId } = req.body

  Tag.findOne({ _id: tagId }).then(tag => {
    if (!tag) {
      return res.json({
        status: 404,
        message: 'Тег не найден!'
      })
    }

    User.findOne({ _id: userId }).then(user => {
      if (!user) {
        return res.json({
          status: 404,
          message: 'Пользователь не найден!'
        })
      }

      for (let id of tag.subscribers) {
        if (JSON.stringify(id) === JSON.stringify(user._id)) {
          tag.subscribers.pull(user._id)
          user.tags.pull(tag._id)
          tag.save()
          user.save()

          return res.json({
            status: 200,
            message: 'Вы успешно отписались',
            title: tag.title
          })
        }
      }

      tag.subscribers.push(user)
      tag.save()

      user.tags.push(tag)
      user.save()

      return res.json({
        status: 200,
        message: 'Вы успешно подписались',
        title: tag.title
      })
    })
  })
}
