const express = require('express')
const bodyParser = require('body-parser')
// TODO uncomment module
// const logger = require('morgan')
const mongoose = require('mongoose')
const helmet = require('helmet')
const cors = require('cors')
const config = require('./config')
const bluebird = require('bluebird')
const path = require('path')
const routes = require('./routing')
const passport = require('passport')

const app = express()
mongoose.Promise = bluebird

app.use(cors())
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }))

// TODO uncomment middleware
// app.use(logger('tiny'))
app.use(helmet())

// Routing for api: http://example.com/api/
app.use('/api', routes)

// Routing for html: http://example.com/
app.use(express.static(path.join(__dirname, '../build')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'))
})

app.listen(config.port, () => {
  console.log(`Server is up & running on http://localhost:${config.port}`)
})

mongoose.connect(config.db, { useMongoClient: true }, error => {
  if (error) {
    console.log(error)
  }

  console.log('MongoDB has been successfully connected')
})

app.use(passport.initialize())
require('./config/passport')(passport)
