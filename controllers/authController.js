require('dotenv').config()
const SECRET = process.env.SECRET_KEY;
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

module.exports.hash = (password) => {
	return crypto.createHmac('sha256', SECRET).update(password).digest('hex').split('').reverse().join('')
}

module.exports.auth = (req, res, next) => {
	const authHeader = req.headers.authorization
	if (authHeader) {
		const token = authHeader.split(' ')[1]
		jwt.verify(token, SECRET, (err, user) => {
			if (err) {
				res.sendStatus(403)
			} else {
				if (user.username === req.params.username || user.username === 'admin') {
					res.locals.user = user.username
					next()
				} else if (req.method === 'POST' || req.method === 'DELETE') {
					next()
				} else {
					res.sendStatus(401)
				}
			}
		})
	} else {
		console.error('no auth header')
		res.sendStatus(401)
	}
}

module.exports.adminAuth = (req, res, next) => {
	const authHeader = req.headers.authorization
	if (authHeader) {
		const token = authHeader.split(' ')[1]
		jwt.verify(token, SECRET, (err, user) => {
			if (err) {
				res.sendStatus(403)
			} else {
				if (user.username === 'admin') {
					res.locals.user = user.username
					next()
				} else {
					res.sendStatus(401)
				}
			}
		})
	} else {
		console.error('no auth header')
		res.sendStatus(401)
	}
}