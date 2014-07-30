var ApplicationModel = require('../store/ApplicationModel');
var express = require('express');
var rest = require('./rest');
var router = express.Router();

router.get('/', function(req, res, next) {
    rest.findModels(ApplicationModel, req, res, next);
});

router.get('/:id', function(req, res, next) {
    rest.findModel(ApplicationModel, req, res, next);
});

router.post('/', function(req, res, next) {
    rest.saveModel(ApplicationModel, req, res, next);
});

router.post('/:id', function(req, res, next) {
    rest.saveModel(ApplicationModel, req, res, next);
});

router.post('/:id/action', function(req, res, next) {
	loadChannel(req.body, function(err, reqBody){
		ApplicationModel.findById(req.params.id, function(err, app){
			if (err){ rest.error('00000', res); }
			app.actions.push({
				event: reqBody.event,
				trigger: reqBody.trigger,
				channelId: reqBody.channelId
			});
			app.save(function(err, app){
				res.json(app);
			});
		});
	});
});

function loadChannel(reqBody, cb){
    if(reqBody.channelId){ return cb(null, reqBody); }

    ChannelModel.find({ name: reqBody.channel }, function(err, channels){
        if (err) { return cb(err); }
        if (!channels || channels.length != 1){ return cb(new Error('Unable to find channel ' + reqBody.channel)); }

        delete reqBody.channel;
        reqBody.channel = channels[0]._id;
        cb(null, reqBody);
    });
}

router.delete('/:id', function(req, res, next) {
    rest.deleteModel(ApplicationModel, req, res, next);
});

module.exports = router;