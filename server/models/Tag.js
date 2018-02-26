const mongoose = require('mongoose')
const { Schema } = require('mongoose')

const TagSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  cover: String,
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  subscribers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

module.exports = mongoose.model('Tag', TagSchema)
