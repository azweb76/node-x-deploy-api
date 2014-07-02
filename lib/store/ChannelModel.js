var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var schema = new Schema({
    name: String,
    applicationArea: String
});

module.exports = mongoose.model('Channel', schema);