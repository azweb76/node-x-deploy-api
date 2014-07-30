var store = require('../store/');
var express = require('express');
var router = express.Router();
var rest = require('./rest');

var AgentModel = store.Agent;
var ChannelModel = store.Channel;

router.get('/', function(req, res, next) {
    rest.findModels(AgentModel, req, res, next);
});

router.get('/:id', function(req, res, next) {
    rest.findModel(AgentModel, req, res, next);
});

router.get('/:server/details', function(req, res, next) {
    AgentModel.find({ server: req.params.server }, function(err, items){
		if(err){ return rest.mongoError(err, res); }

		var redisConfig = req.deployConfig.messaging.redis;
		res.statusCode = 200;
		res.json({
			agent: items[0],
			redis: { host: redisConfig.host, port: redisConfig.port }
		});
	});
});

router.delete('/', function(req, res, next) {
    rest.deleteModel(AgentModel, req, res, next);
});

router.delete('/:id', function(req, res, next) {
    rest.deleteModel(AgentModel, req, res, next);
});

router.post('/', function(req, res, next) {
	rest.saveModel(AgentModel, req, res, next);
});

router.post('/:id', function(req, res, next) {
	rest.saveModel(AgentModel, req, res, next);
});

module.exports = router;