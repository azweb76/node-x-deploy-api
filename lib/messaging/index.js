var redis = require("redis");
var async = require('async');
var BuildModel = require('../store/BuildModel');
var ActionModel = require('../store/ActionModel');
var AgentModel = require('../store/AgentModel');
var AgentLogModel = require('../store/AgentLogModel');
var ApplicationModel = require('../store/ApplicationModel');

function init(config, cb){
    this.config = config;

    var redisConfig = config.redis;
    this.redisClient = redis.createClient(redisConfig.port, redisConfig.host, redisConfig.options);
    this.redisClient.unref();

    cb(null, this);
}

function send(channel, msg){
    this.redisClient.publish(channel, JSON.stringify(msg));
}

function loadApplicationById(build, cb){
    if (!build.applicationId){ return cb(null, build); }
    ApplicationModel.findById(build.applicationId, function(err, application){
        if (err) { return cb(err); }
        if (!application){ return cb(new Error('Application not found')); }
        build.application = application;
        cb(null, build);
    });
}

function loadBuildById(id, cb){
    BuildModel.findById(id, function(err, build){
        if (err) { return cb(err); }
        cb(null, build);
    });
}

function loadAgents(actionModel, cb){
    AgentModel.find({ channelId: actionModel.channelId }, function(err, agents){
        if (err) { return cb(err); }
        agents.forEach(function(agent){
            actionModel.agentLog.push(new AgentLogModel({
                agentId: agent._id,
                status: 0
            }));
        });
        cb(null, actionModel);
    });
}

function buildEvent(buildId, event, eventData, cb){
    var self = this;

    async.waterfall([
        function(cb){ cb(null, buildId); },
        loadBuildById,
        loadApplicationById
    ],
    function(err, build){
        if (err){ return cb(err); }

        var actions = build.application.actions;

        var cnt = 0;
        if (actions && actions.length) {
            async.each(actions, function (action, cb_async) {
                if (action.event === event) {
                    var actionModel = new ActionModel();

                    actionModel.buildId = build._id;
                    actionModel.channelId = action.channelId;
                    actionModel.name = event;
                    actionModel.event = action.trigger;
                    actionModel.actionDate = Date.now();

                    if(eventData) { actionModel.eventData = JSON.stringify(eventData); }
                    
                    loadAgents(actionModel, function(err, actionModel){
                        actionModel.save(function(err, result){
                            if (err){ return cb_async(err); }
                            self.send(action.channelId, { actionId: result._id });
                            cb_async(null);
                        });
                    });

                    cnt++;
                }
                else {
                    cb_async(null);
                }
            }, function(err){
                if(cb) cb(err, { build: build, eventsTriggered: cnt, event: event });
            });
        }
        else {
            if (cb) cb(null, { build: build, eventsTriggered: cnt, event: event });
        }
    });
}

module.exports = {
    redisClient: null,
    config: null,
    init: init,
    send: send,
    buildEvent: buildEvent,
    close: null
}