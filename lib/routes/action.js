var ActionModel = require('../store/ActionModel');
var AgentLogModel = require('../store/AgentLogModel');
var AgentModel = require('../store/AgentModel');
var express = require('express');
var rest = require('./rest');
var messaging = require('../messaging');
var router = express.Router();

router.get('/', function(req, res, next) {
    rest.findModels(ActionModel, req, res, next);
});

router.get('/:id', function(req, res, next) {
    rest.findModel(ActionModel, req, res, next);
});

router.post('/', function(req, res, next) {
    rest.saveModel(ActionModel, req, res, next);
});

router.post('/:id', function(req, res, next) {
    rest.saveModel(ActionModel, req, res, next);
});

router.post('/:id/agentLog/:agentId', function(req, res, next) {
	var logStatus = req.body.status, agentId = req.params.agentId;
	ActionModel.update( { _id: req.params.id, "agentLog.agentId": agentId }, {
		$set: { "agentLog.$.logDate": Date.now(), "agentLog.$.status": logStatus }
	}, function(err, result){
		if (err){ return rest.error('00000', res); }
		if (!result){
			rest.error('00000', res);
		}
		else {
			// if the current agent was updated to status 1 (success), check if all has been updated to 1
			if (logStatus === 1){
				ActionModel.count({ _id: req.params.id, agentLog: { $elemMatch: { agentId: { $ne: agentId }, status: { $ne: 1 } } } }, function(err, count){
					if (err){ return rest.mongoError(err, res); }
					if (count === 0){
						messaging.buildEvent(action.buildId, action.name + '_channelComplete', {},  function(err, result){
							if (err){ return rest.error('00000', res); }
							res.json({ item: resultAction, channelComplete: true });
						});
					}
					else {
						res.json({ agentId: agentId, channelComplete: false });
					}
				});
			}
			else {
				res.json({ agentId: agentId, channelComplete: false });
			}
		}

	});
});

router.delete('/:id', function(req, res, next) {
    rest.deleteModel(ActionModel, req, res, next);
});

module.exports = router;