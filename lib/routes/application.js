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
	ApplicationModel.findById(req.params.id, function(err, app){
		if (err){ rest.error('00000', res); }
		app.actions.push({
			event: req.body.event,
			trigger: req.body.trigger,
			channelId: req.body.channelId
		});
		app.save(function(err, app){
			res.json(app);
		});
	})
});

router.delete('/:id', function(req, res, next) {
    rest.deleteModel(ApplicationModel, req, res, next);
});

module.exports = router;