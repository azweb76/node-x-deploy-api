var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var actionSchema = new Schema({
	name: String,
    event: String,
    trigger: String,
    channelId: ObjectId
});

var schema = new Schema({
    name: String,
    defaultBuildId: ObjectId,
    area: String,
    actions: [actionSchema]
});

module.exports = mongoose.model('Application', schema);