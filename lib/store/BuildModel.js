var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var schema = new Schema({
    name: String,
    applicationId: ObjectId,
    branch: String,
    commitHash: String,
    committer: String,
    artifactPath: String
});

module.exports = mongoose.model('Build', schema);