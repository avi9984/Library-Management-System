const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: ObjectId, required: true, ref: 'User' },
    authorName: { type: String },
    genre: { type: String, required: true },
    ISBN: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    publish_year: { type: String }

}, { versionKey: false });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;