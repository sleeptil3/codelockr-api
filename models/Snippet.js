const { Schema, model } = require('mongoose')

const snippetSchema = new Schema({
	title: { type: String, required: true, unique: true },
	code: { type: String, required: true },
	parseFormat: { type: String, required: true },
	notes: String,
	owner: { type: Schema.Types.ObjectId, ref: 'User' },
	parentFolder: { type: Schema.Types.ObjectId, ref: 'Folder' },
	sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	createdAt: { type: Date, default: Date.now }
})

module.exports = model('Snippet', snippetSchema)