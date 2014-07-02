var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var schema = new Schema({
    server: { type: String, unique: true, required: true },
    channelId: { type: ObjectId, required: true }
});

module.exports = mongoose.model('Agent', schema);