const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const { Schema } = mongoose

const UserSchema = new Schema({
  userName: {
    type: String,
    unique: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: String,
  accessLevel: 0,
  avatar: String,
  description: String,
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
  answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  createdAt: {
    type: Date,
    default: Date.now
  }
})

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    bcrypt.hash(this.password, 10).then(hash => {
      this.password = hash

      next()
    })
  } else {
    return next()
  }
})

UserSchema.methods.comparePasswords = function(password) {
  return bcrypt.compare(password, this.password)
}

module.exports = mongoose.model('User', UserSchema)
