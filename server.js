const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { auth } = require('./controllers/authController')

const app = express()
const SECRET = process.env.SECRET_KEY
const port = process.env.PORT || 3030;


////////////////
// MIDDLEWARE //
////////////////

app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
	console.log('MIDDLEWARE LOG', req.body)
	next()
})

mongoose.connect(process.env.MONGO_URI, {
	useUnifiedTopology: true,
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: true
})

mongoose.connection.once('connected', () => console.log('Connected to Mongo, life is good.'))

////////////
// ROUTES //
////////////

app.use('/user', require('./controllers/userController'))
app.use('/', require('./controllers/rootController'))

//////////////
// LISTENER //
//////////////

app.listen(port, () => console.log('Express Dev Port:', port))