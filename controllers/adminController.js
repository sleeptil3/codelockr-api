const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Folder = require('../models/Folder')
const Snippet = require('../models/Snippet')
const { adminAuth } = require('./authController')

// SHOW ALL USERS

router.get('/users', adminAuth, (req, res) => {
	const userQuery = User.find({ username: { $ne: "admin" } }).select('-password')
	userQuery.exec((err, foundUsers) => {
		if (err) res.status(400).json({ msg: err.message })
		else res.status(200).json(foundUsers)
	})
})

// GET RECORD COUNTS

router.get('/count', adminAuth, async (req, res) => {
	try {
		const userCount = await User.countDocuments()
		const folderCount = await Folder.countDocuments()
		const snippetCount = await Snippet.countDocuments()
		res.status(200).json({ userCount, folderCount, snippetCount })
	} catch (error) {
		res.status(400).json({ msg: error.message })
	}
})

// SHOW ONE USER

router.get('/users/:username', adminAuth, (req, res) => {
	const userQuery = User.findOne({ username: req.params.username }).select('-password')
	userQuery.exec((err, foundUser) => {
		if (err) res.status(400).json({ msg: err.message })
		else res.status(200).json(foundUser)
	})
})

// EDIT ONE USER

router.put('/users/:username/edit', adminAuth, (req, res) => {
	const userQuery = User.findOneAndUpdate({ username: req.params.username }, req.body, { new: true }).select('-password')
	userQuery.exec((err, foundUser) => {
		if (err) res.status(400).json({ msg: err.message })
		else res.status(200).json(foundUser)
	})
})

// DELETE ONE USER

router.delete('/users/:username/delete', adminAuth, async (req, res) => {
	try {
		const deletedUser = await User.findOneAndDelete({ username: req.params.username })
		res.status(200).json(deletedUser)
	} catch (err) {
		res.status(400).json({ msg: err.message })
	}
})


module.exports = router