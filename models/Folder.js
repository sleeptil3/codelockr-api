const { Schema, model } = require('mongoose')

const folderSchema = new Schema({
	title: { type: String, required: true },
	snippets: [{ type: Schema.Types.ObjectId, ref: 'Snippet' }]
})