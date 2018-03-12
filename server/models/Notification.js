const mongoose = require('mongoose')

const NotificationSchema = new mongoose.Schema({
  title: String,
  notificationTime: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Notification', NotificationSchema)
