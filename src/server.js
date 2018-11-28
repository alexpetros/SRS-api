// starter from http://cs52.me/assignments/sa/server-side/
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import mongoose from 'mongoose'

import apiRouter from './routes'

// initialize
const app = express()

// enable/disable cross origin resource sharing if necessary
app.use(cors())

// enable/disable http request logging
app.use(morgan('dev'))

// enable only if you want static assets from folder static
app.use(express.static('static'))

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/srs'
mongoose.connect(mongoURI, { useNewUrlParser: true })
mongoose.Promise = global.Promise


// default index route
app.use('/api', apiRouter)

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090
app.listen(port)

console.log(`listening on: ${port}`)
