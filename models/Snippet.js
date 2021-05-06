const { Schema, model } = require('mongoose')

const snippetSchema = new Schema({
	title: { type: String, required: true, unique: true },
	code: { type: String, required: true },
	format: { type: String, required: true },
	notes: String,
	owner: { type: Schema.Types.ObjectId, ref: 'User' },
})

module.exports = model('Snippet', snippetSchema)