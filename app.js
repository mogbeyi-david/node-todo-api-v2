const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
require('dotenv').config() // pull in dotenv to access enviroment variables

// Declare environment variables

const hostname = process.env.HOSTNAME
const PORT = process.env.PORT || 3000

// Set the database based on the environment
let database
if (process.env.ENVIRONMENT === 'testing') {
  database = process.env.TEST_DATABASE
} else {
  database = process.env.DATABASE
}

//Try to connect to the database
mongoose.connect(`mongodb://${hostname}/${database}`, {useNewUrlParser: true})
  .then(() => {console.log(`Connected to ${database} successfully`)})
  .catch((error) => {console.error('Could not connect to Mongo DB: ', error)})

// Set middlewares
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.json())

//Pull in routes
const user = require('./routes/user')
const authenticateUser = require('./routes/auth')
const todo = require('./routes/todo')

//Use Routes middleware
app.use('/api/user', user)
app.use('/api/user/auth', authenticateUser)
app.use('/api/todo', todo)

//Set app to listen on PORT
const server = app.listen(PORT, () => {
  console.log(`App started and listening on port ${PORT}`)
})

module.exports = server