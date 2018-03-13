const User = require('../models/User')
const Notification = require('../models/Notification')

exports.remove = function(req, res, next) {
  User.findOne({ _id: req.params.id }).then(user => {
    Notification.remove({ _id: { $in: user.notifications } }).then(() => {
      user.notifications = []
      user.save()

      res.json({
        status: 200,
        user
      })
    })
  })
}
