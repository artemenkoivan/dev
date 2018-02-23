const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('../models/User')
const config = require('./index')

module.exports = function(passport) {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.secret
  }

  passport.use(
    new JwtStrategy(jwtOptions, (payload, done) => {
      User.findOne({ id: payload.id }, (error, user) => {
        if (error) {
          return done(error)
        }

        if (user) {
          return done(null, user)
        } else {
          return done(null, false)
        }
      })
    })
  )
}
