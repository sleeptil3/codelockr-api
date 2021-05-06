const { Schema, model } = require('mongoose')

const folderSchema = new Schema({
	title: { type: String, required: true },
	snippets: [{ type: Schema.Types.ObjectId, ref: 'Snippet' }],
})

const userSchema = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	snippets: [{ type: Schema.Types.ObjectId, ref: 'Snippet' }],
	folders: [folderSchema],
	sharedSnippets: [{ type: Schema.Types.ObjectId, ref: 'Snippet' }]
})

module.exports = model('User', userSchema)