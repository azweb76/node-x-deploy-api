var mongoose = require('mongoose');

module.exports = {
    open: function(config, cb){
        mongoose.connect(config.url);
        cb(null);
    },
    Action: require('./ActionModel'),
    AgentLog: require('./AgentLogModel'),
    Agent: require('./AgentModel'),
    Application: require('./ApplicationModel'),
    Artifact: require('./ArtifactModel'),
    Build: require('./BuildModel'),
    Channel: require('./ChannelModel')
};

