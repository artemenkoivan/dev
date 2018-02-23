const mongoose = require('mongoose')
const { Schema } = require('mongoose')

let QuestionSchema = new Schema({
  title: {
    type: String,
    unique: true,
    required: true
  },
  body: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
  solved: false,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('Question', QuestionSchema)
