const express = require('express')
const passport = require('passport')
const pass = require('../config/passport')
const User = require('../models/User')

// Controllers
const auth = require('../controllers/auth.controller')
const user = require('../controllers/user.controller')
const tag = require('../controllers/tag.controller')
const admin = require('../controllers/admin.controller')
const search = require('../controllers/search.controller')
const question = require('../controllers/question.controller')

const router = express.Router()

const authenticate = passport.authenticate('jwt', { session: false })

router.get('/', (req, res) => {
  res.json({
    status: 200,
    message: 'GeekAsks API root directory'
  })
})

// Auth routes
router.post('/register', auth.register)
router.post('/login', auth.login)

// User routes
router.get('/user/:id', authenticate, user.getUserInfo)
router.get('/profile/:name', user.getProfile)
router.post('/profile/edit', authenticate, user.editProfile)
router.post('/profile/edit-avatar', authenticate, user.editProfileAvatar)

// Tag routes
router.get('/tags', tag.getAll)
router.get('/tag/:tagName', tag.getOne)
router.post('/tag/follow', authenticate, tag.follow)

// Admin routes
router.get('/admin/users', authenticate, admin.allUsers)
router.get('/admin/user/:name', authenticate, admin.getUser)
router.post('/admin/tag', authenticate, tag.create)
router.post('/admin/user/edit', authenticate, admin.editUser)
router.delete('/admin/user/:id', authenticate, admin.removeUser)

// Question routes
router.post('/question', authenticate, question.create)
router.get('/question', question.getAll)
router.get('/questions/limit/:limit', question.getWithLimit)
router.get('/question/:id', question.getOne)
router.post('/question/answer', authenticate, question.addAnswer)
router.post('/question/answer/like', authenticate, question.likeAnswer)
router.post('/question/answer/solve', authenticate, question.markSolved)

// Search route
router.get('/search/:any', search.search)

module.exports = router
