const mongoose = require('mongoose')
const { Schema } = require('mongoose')

let AnswerSchema = new Schema({
  body: String,
  author: {
    _id: String,
    name: String
  },
  likes: [],
  solved: false,
  referenceQuestion: {
    type: Schema.Types.ObjectId,
    ref: 'Question'
  },
  question: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
})

module.exports = mongoose.model('Answer', AnswerSchema)
