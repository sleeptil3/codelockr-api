const { Schema, model } = require('mongoose')

const userSchema = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	folders: [{ type: Schema.Types.ObjectId, ref: 'Folder' }],
	friendRequestsReceived: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	friendRequestsSent: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	created: { type: Date, default: Date.now, immutable: true }
})

module.exports = model('User', userSchema)