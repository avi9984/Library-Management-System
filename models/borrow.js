const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const borrowSchema = new mongoose.Schema({
    userId: { type: ObjectId, ref: 'User' },
    bookId: { type: ObjectId, ref: 'Book' },
    borrowDate: { type: String },
    returnDate: { type: String, default: null },
}, { versionKey: false })

const Borrow = mongoose.model('Borrow', borrowSchema);
module.exports = Borrow;