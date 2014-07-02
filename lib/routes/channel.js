var ChannelModel = require('../store/ChannelModel');
var express = require('express');
var router = express.Router();
var rest = require('./rest');

router.get('/', function(req, res, next) {
    rest.findModels(ChannelModel, req, res, next);
});

router.get('/:id', function(req, res, next) {
    rest.findModel(ChannelModel, req, res, next);
});

router.post('/', function(req, res, next) {
    rest.saveModel(ChannelModel, req, res, next);
});

router.post('/:id', function(req, res, next) {
    rest.saveModel(ChannelModel, req, res, next);
});

router.delete('/:id', function(req, res, next) {
    rest.deleteModel(ChannelModel, req, res, next);
});

module.exports = router;