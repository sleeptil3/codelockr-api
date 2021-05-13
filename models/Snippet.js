const { Schema, model } = require('mongoose')

const snippetSchema = new Schema({
	title: { type: String, required: true },
	code: { type: String, required: true },
	parseFormat: { type: String, required: true },
	owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	parentFolder: { type: Schema.Types.ObjectId, ref: 'Folder', required: true },
	notes: String,
	sharedWith: [{ type: Schema.Types.ObjectId, ref: 'User' }],
	created: { type: Date, default: Date.now, immutable: true },
	updated: { type: Date, default: Date.now },
	isPrivate: { type: Boolean, default: true }
})

module.exports = model('Snippet', snippetSchema)
