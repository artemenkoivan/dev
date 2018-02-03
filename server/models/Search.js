const mongoose = require('mongoose')
const { Schema } = require('mongoose')

let SearchSchema = new Schema({
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  subscribers: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

module.exports = mongoose.model('Search', SearchSchema)