const express = require("express")
const router = express.Router()
const User = require("../models/User")
const { hash } = require("./authController")
const bcrypt = require("bcryptjs")
const generatePassword = require("password-generator")
const axios = require("axios")

router.post("/auth", async (req, res) => {
	try {
		const { PWR_USER, PWR_PASS, userEmail } = req.body
		const hashedPassword = hash(PWR_PASS)
		await User.findOne({ username: PWR_USER }, async (err, foundUser) => {
			if (foundUser === null) res.status(400).json({ status: "PWR User not found", error: err })
			else {
				if (bcrypt.compareSync(hashedPassword, foundUser.password)) {
					await User.findOne({ email: userEmail }, (err, foundUser) => {
						if (foundUser === null)
							res.status(400).json({
								error: "Unable to find existing user with that email address",
								message: err,
							})
						else {
							const newUserPassword = generatePassword(12, false)
							let hashedUserPassword = hash(newUserPassword)
							hashedUserPassword = bcrypt.hashSync(hashedUserPassword, bcrypt.genSaltSync(10))
							User.findOneAndUpdate(
								{ username: foundUser.username },
								{ password: hashedUserPassword },
								async (err, editedUser) => {
									if (err)
										res.status(400).json({
											error: "Error when attempting to save new password to user account",
											message: err,
										})
									else {
										const templateData = {
											service: "CODELOCKR",
											action: "PW_RESET",
											firstName: foundUser.firstName,
											lastName: foundUser.lastName,
											username: foundUser.username,
											emailAddress: foundUser.email,
											newPassword: newUserPassword,
										}
										// https://sleeptil3software-mailserver.herokuapp.com/send
										// http://localhost:8088/send
										axios
											.post("https://sleeptil3software-mailserver.herokuapp.com/send", {
												...templateData,
											})
											.then(response => {
												if (response.status !== 200)
													res.status(400).json({
														error: "Error when sending email (mail server)",
														message: response.data,
													})
												else res.status(200).json({ status: "Password Reset  - Email Sent" })
											})
											.catch(error => {
												console.error(error)
												res.status(400).json({
													error: "Server error when executing send mail code (codelockr-api)",
													message: JSON.stringify(error),
												})
											})
									}
								}
							).select("-password")
						}
					})
				} else
					res
						.status(500)
						.json({ problem: "Provided PWR_USER password/hash did not match user account" })
			}
		})
	} catch (error) {
		console.error(error)
	}
})

module.exports = router
