const { Schema, model } = require('mongoose')

const userSchema = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	folders: [{ type: Schema.Types.ObjectId, ref: 'Folder' }],
	friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	approvedRequest: { type: Boolean, default: false },
	createdAt: { type: Date, default: Date.now }

})

module.exports = model('User', userSchema)