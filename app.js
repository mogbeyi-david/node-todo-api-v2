const mongoose = require('mongoose')
require('dotenv').config() // pull in dotenv to access enviroment variables

//Try to connect to the database
const database = process.env.DATABASE
const hostname = process.env.HOSTNAME
mongoose.connect(`mongodb://${hostname}/${database}`, {useNewUrlParser: true})
  .then(() => {console.log('Connected to Mongodb successfully')})
  .catch((error) => {console.error('Could not connect to Mongo DB: ', error)})