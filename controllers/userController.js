const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Folder = require('../models/Folder')
const { auth, hash } = require('./authController');
const Snippet = require('../models/Snippet');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const SECRET = process.env.SECRET_KEY

// SHOW ROUTES ////////////////////////////////////////////

// GET userdata for dashboard
router.get('/:username', auth, (req, res) => {
	const userQuery = User.findOne({ username: req.params.username }).select('-password').populate('folders')
	userQuery.exec((err, foundUser) => {
		if (err) res.status(400).json({ msg: err.message })
		else res.status(200).json(foundUser)
	})
})

// GET all snippets for user
router.get('/:username/:user_id/allsnippets', auth, (req, res) => {
	const snippetQuery = Snippet.find({ owner: req.params.user_id })
	snippetQuery.exec((err, foundSnippets) => {
		if (err) res.status(400).json({ msg: err.message })
		else res.status(200).json(foundSnippets)
	})
})

// CREATE ROUTES ////////////////////////////////////////////

// Add a folder to a user
router.post('/:username/addfolder', auth, async (req, res) => {
	try {
		const newFolder = await Folder.create(req.body)
		const updatedUser = await User.findByIdAndUpdate(newFolder.owner, {
			$addToSet: { folders: newFolder._id }
		}, { new: true })
		if (updatedUser) res.status(200).json(newFolder)
		else res.status(400).json({ msg: "unable to create folder" })
	} catch (err) {
		res.status(400).json({ msg: err.message })
	}
})

// Add a Snippet
router.post('/:username/:folder_id/addsnippet', auth, async (req, res) => {
	try {
		const newSnippet = await Snippet.create(req.body)
		const foundFolder = await Folder.findByIdAndUpdate(newSnippet.parentFolder, {
			$addToSet: { snippets: newSnippet._id }
		}, { new: true })
		res.status(200).json({ newSnippet, foundFolder })
	} catch (error) {
		res.status(400).json({ msg: error.message })
		console.error(error)
	}
})

// Add a friend
router.put('/:username/addfriend/:friend_username', auth, async (req, res) => {
	try {
		// Find new friend
		const friendToAdd = await User.findOne({ username: req.params.friend_username }).select('-password')
		// Update self with the sent request
		const updatedUser = await User.findOneAndUpdate({ username: req.params.username }, {
			$addToSet: { friendRequestsSent: friendToAdd._id }
		}).select('-password')
		// Update friend with received request
		const updatedFriend = await User.findOneAndUpdate({ username: req.params.friend_username }, {
			$addToSet: { friendRequestsReceived: updatedUser._id }
		}).select('-password')
		res.status(200).json({ msg: `Friend Request Sent to ${friendToAdd.firstName} ${friendToAdd.lastName}` })
	} catch (err) {
		res.status(400).json({ msg: err.message })
	}
})


// EDIT ROUTES ////////////////////////////////////////////

// Edit user info
router.put('/:username/edit', auth, async (req, res) => {
	if (req.body.password) {
		const hashedPassword = hash(req.body.password)
		req.body.password = bcrypt.hashSync(hashedPassword, bcrypt.genSaltSync(10))
	}
	const updatedUser = await User.findOneAndUpdate({ username: req.params.username }, req.body, { new: true }).select('-password')
	if (req.body.password) {
		const token = jwt.sign({
			id: createdUser._id,
			username: createdUser.username
		}, SECRET)
		res.status(200).json({ token: token, ...updatedUser })
	} else {
		res.status(200).json(updatedUser)
	}
})

// Edit Snippet
router.put('/:username/snippets/:snippet_id/edit', auth, async (req, res) => {
	try {
		const updatedSnippet = await Snippet.findByIdAndUpdate(req.params.snippet_id, {
			title: req.body.title,
			code: req.body.code,
			notes: req.body.notes,
			$currentDate: { updated: true }
		},
			{ new: true }
		)
		res.status(200).json(updatedSnippet)
	} catch (err) {
		res.status(200).json({ msg: err.message })
	}
})

// Edit Folder
router.put('/:username/folders/:folder_id/edit', auth, async (req, res) => {
	try {
		const updatedFolder = await Folder.findByIdAndUpdate(req.params.folder_id, {
			...req.body,
			$currentDate: { updated: true }
		},
			{ new: true }
		)
		res.status(200).json(updatedFolder)
	} catch (err) {
		res.status(200).json({ msg: err.message })
	}
})


// Approve a friend
router.put('/:username/approvefriend/:friend_id', auth, async (req, res) => {
	try {
		const updatedUser = await User.findOneAndUpdate({ username: req.params.username }, {
			$pull: { friendRequestsSent: req.params.friend_id },
			$addToSet: { friends: req.params.friend_id }
		}).select('-password')
		// Update friend with received request
		const updatedFriend = await User.findByIdAndUpdate(req.params.friend_id, {
			$addToSet: { friends: updatedUser._id },
			$pull: { friendRequestsReceived: updatedUser._id }
		}).select('-password')
		res.status(200).json({ msg: `Approved: ${updatedFriend.firstName} ${updatedFriend.lastName}` })
	} catch (err) {
		res.status(400).json({ msg: err.message })
	}
})

// Deny a friend

router.put('/:username/denyfriend/:friend_id', auth, async (req, res) => {
	try {
		const updatedUser = await User.findOneAndUpdate({ username: req.params.username }, {
			$pull: { friendRequestsReceived: req.params.friend_id }
		}).select('-password')
		const updatedFriend = await User.findByIdAndUpdate(req.params.friend_id, {
			$pull: { friendRequestsSent: updatedUser._id }
		}).select('-password')
		res.status(200).json({ msg: `Denied: ${updatedFriend.firstName} ${updatedFriend.lastName}` })
	} catch (err) {
		res.status(400).json({ msg: err.message })
	}
})

// Add Share with a Friend
// This will send a request to the friend to add the snippet data as a new snippet to a chosen folder


// DELETE ROUTES ////////////////////////////////////////////

// Delete logged in user
router.delete('/:username/delete', auth, async (req, res) => {
	try {
		const deletedUser = await User.findOneAndDelete({ username: req.params.username })
		res.status(200).json(deletedUser)
	} catch (err) {
		res.status(400).json({ msg: err.message })
	}
})
// ADD: capture the friends in an array and map over it ($each?) to remove deleted user from friend lists

// Delete Snippet
router.delete('/:username/snippets/:snippet_id/delete', auth, async (req, res) => {
	try {
		const deletedSnippet = await Snippet.findByIdAndDelete(req.params.snippet_id)
		const foundFolder = await Folder.findByIdAndUpdate(deletedSnippet.parentFolder, {
			$pull: { snippets: deletedSnippet._id }
		}).select('-password')
		res.status(200).json(deletedSnippet)
	} catch (err) {
		res.status(200).json({ msg: err.message })
	}
})

// Delete Folder
router.delete('/:username/folders/:folder_id/delete', auth, async (req, res) => {
	try {
		const deletedFolder = await Folder.findByIdAndDelete(req.params.folder_id)
		const updateUser = await User.findByIdAndUpdate(deletedFolder.owner, { $pull: { folders: deletedFolder._id } })
		res.status(200).json(deletedFolder)
	} catch (err) {
		res.status(200).json({ msg: err.message })
	}
})

module.exports = router