var mongoose = require('mongoose');
var AgentLogModel = require('./AgentLogModel');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var schema = new Schema({
	name: String,
    event: String,
    eventData: String,
    channelId: ObjectId,
    buildId: ObjectId,
    actionDate: Date,
    agentLog: [AgentLogModel.schema]
});

module.exports = mongoose.model('Action', schema);