const mongoose = require('mongoose')
const express = require('express')
const app = express()
require('dotenv').config() // pull in dotenv to access enviroment variables

// Declare environment variables
const database = process.env.DATABASE
const hostname = process.env.HOSTNAME
const PORT = process.env.PORT || 3000

//Try to connect to the database
mongoose.connect(`mongodb://${hostname}/${database}`, {useNewUrlParser: true})
  .then(() => {console.log('Connected to Mongodb successfully')})
  .catch((error) => {console.error('Could not connect to Mongo DB: ', error)})

//Set app to listen on PORT
app.listen(PORT, () => {
  console.log(`App started and listening on port ${PORT}`)
})