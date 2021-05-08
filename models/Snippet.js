const { Schema, model } = require('mongoose')

const snippetSchema = new Schema({
	title: { type: String, required: true, unique: true },
	code: { type: String, required: true },
	parseFormat: { type: String, required: true },
	notes: String,
	owner: { type: Schema.Types.ObjectId, ref: 'User' },
	sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	parentFolder: [{ type: Schema.Types.ObjectId, ref: 'Folder' }],
	created: { type: Date, default: Date.now, immutable: true },
	updated: { type: Date, default: Date.now },
	isPrivate: { type: Boolean, default: true, required: true },
})

module.exports = model('Snippet', snippetSchema)