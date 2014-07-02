var BuildModel = require('../store/BuildModel');
var ActionModel = require('../store/ActionModel');
var ApplicationModel = require('../store/ApplicationModel');
var ChannelModel = require('../store/ChannelModel');
var express = require('express');
var async = require('async');
var router = express.Router();
var messaging = require('../messaging');
var rest = require('./rest');

router.get('/', function(req, res, next) {
    rest.findModels(BuildModel, req, res, next);
});

router.get('/:id', function(req, res, next) {
    rest.findModel(BuildModel, req, res, next);
});

router.get('/:buildId/action', function(req, res, next) {
    rest.findModels(ActionModel, req, res, next);
});

router.post('/:id/action', function(req, res, next) {
    messaging.buildEvent(req.params.id, req.body.event, req.body.eventData, function(err, result){
        if (err){ return rest.error("00007", res); }
        res.json(200, { event: req.body.event, buildId: req.params.id, eventsTriggered: result.eventsTriggered })
    })
});

router.post('/', function(req, res, next) {
    var build = new BuildModel();

    async.waterfall([
        function(cb){ cb(null, req.body); },
        loadApplication
    ],
    function(err, reqBody){
        if (err){ return res.send(500, 'failed to save build. ' + err); }

        if (reqBody.name) build.name = reqBody.name;
        if (reqBody.commitHash) build.commitHash = reqBody.commitHash;
        if (reqBody.committer) build.committer = reqBody.committer;
        if (reqBody.artifactPath) build.artifactPath = reqBody.artifactPath;
        if (reqBody.application) build.applicationId = reqBody.application._id;
        if (reqBody.branch) build.branch = reqBody.branch;

        build.save(function (err, result) {
            if (err){ return rest.error("00000", res); }
            messaging.buildEvent(result._id, 'build', {}, function(err, result){
                if (err){ return rest.error('00000', res); }
                res.json(result);
            });
        });
    });
});

router.post('/:id', function(req, res, next) {
    rest.saveModel(BuildModel, req, res, next);
});

router.delete('/:id', function(req, res, next) {
    rest.deleteModel(BuildModel, req, res, next);
});

function loadApplication(reqBody, cb){
    if (!reqBody.app){ return cb(null, reqBody); }
    ApplicationModel.find({ name: reqBody.app }, function(err, apps){
        if (err) { return cb(err); }
        if (!apps || apps.length != 1){ return cb(new Error('Unable to find application ' + reqBody.app)); }
        delete reqBody.app;
        reqBody.application = apps[0];
        cb(null, reqBody);
    });
}

function loadChannels(reqBody, cb){
    if (!reqBody.channels){ return cb(null, reqBody); }
    async.map(reqBody.channels, function(channel, map_cb){
        ChannelModel.find({ name: channel }, function(err, channels){
            if (err) { return map_cb(err); }
            if (!channels || channels.length != 1){ return map_cb(new Error('Unable to find channel ' + channel)); }
            map_cb(null, channels[0]._id);
        });
    }, function(err, channelIds){
        if (err){ return cb(err); }
        delete reqBody.channels;
        reqBody.channelIds = channelIds;
        cb(null, reqBody);
    });
}

module.exports = router;