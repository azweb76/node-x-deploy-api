var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var agentLogSchema = new Schema({
	agentId: ObjectId,
	status: Number,
	logDate: Date
});

module.exports = mongoose.model('AgentLog', agentLogSchema);