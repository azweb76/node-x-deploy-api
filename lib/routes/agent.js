var AgentModel = require('../store/AgentModel');
var ChannelModel = require('../store/ChannelModel');
var express = require('express');
var router = express.Router();
var rest = require('./rest');

router.get('/', function(req, res, next) {
    rest.findModels(AgentModel, req, res, next);
});

router.get('/:id', function(req, res, next) {
    rest.findModel(AgentModel, req, res, next);
});

router.post('/', function(req, res, next) {
    rest.saveModel(AgentModel, req, res, next);
});

router.delete('/', function(req, res, next) {
    rest.deleteModel(AgentModel, req, res, next);
});

router.delete('/:id', function(req, res, next) {
    rest.deleteModel(AgentModel, req, res, next);
});

router.post('/:server', function(req, res, next) {
    rest.findAndSaveModel(AgentModel, { server: req.params.server }, req, res, next);
});

module.exports = router;