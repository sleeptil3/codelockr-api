const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { hash } = require('./authController')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const SECRET = process.env.SECRET_KEY

router.get('/', (req, res) => {
	res.status(200).json({ msg: 'root route works!' })
})

router.post('/login', async (req, res) => {
	const { username, password } = req.body
	const hashedPassword = hash(password)
	await User.findOne({ username }, (err, foundUser) => {
		if (foundUser === null) res.status(400).json({ msg: "err.message" })
		else {
			if (bcrypt.compareSync(hashedPassword, foundUser.password)) {
				const token = jwt.sign({
					id: foundUser._id,
					username: foundUser.username
				}, SECRET)
				res.status(200).json({ token: token, username: foundUser.username })
			} else res.status(500).json({ problem: "Crypt compare did not match. Did you change the hash algo?" })
		}
	})
})

router.post('/register', async (req, res) => {
	const hashedPassword = hash(req.body.password)
	req.body.password = bcrypt.hashSync(hashedPassword, bcrypt.genSaltSync(10))

	await User.create(req.body, (err, createdUser) => {
		if (err) res.status(400).json({ msg: err.message })
		else {
			const token = jwt.sign({
				id: createdUser._id,
				username: createdUser.username
			}, SECRET)
			res.status(200).json({ token: token, createdUser: createdUser })
		}
	})
})

module.exports = router
