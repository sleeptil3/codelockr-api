const { Schema, model } = require('mongoose')

const folderSchema = new Schema({
	title: { type: String, required: true },
	snippets: [{ type: Schema.Types.ObjectId, ref: 'Snippet' }],
	owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	created: { type: Date, default: Date.now, immutable: true },
	updated: { type: Date, default: Date.now }
})

module.exports = model('Folder', folderSchema)