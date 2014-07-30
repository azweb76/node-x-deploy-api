var ArtifactModel = require('../store/ArtifactModel');
var fs = require('fs');
var path = require('path');
var rest = require('./rest');
var express = require('express');
var router = express.Router();

function parseVersion(ver){
    var p = ver.split('.');
    return {
        major: (p[0] === '*' ? 0 : parseInt(p[0])),
        minor: (p[1] === '*' ? 0 : parseInt(p[1])),
        build: (p[2] === '*' ? 0 : parseInt(p[2])),
        patch: (p[3] === '*' ? 0 : parseInt(p[3]))
    };
}

router.post('/:name/:version', function(req, res, next) {
    var name = req.params.name;
    var version = req.params.version;

    ArtifactModel.find({ name: req.params.name, version: parseVersion(req.params.version) }, function(err, results){
        if (results && results.length > 0){
            rest.error('00007', res, err);
        }
        else {
            var tgzFile = path.resolve(path.join($module.config.path, name + "-" + version + ".tgz"));
            var writeStream = fs.createWriteStream(tgzFile);

            req.on('error', function(err) {
                res.statusCode = 500;
                res.end("unable to upload file");
            });
            req.on('data', function(data) {
                writeStream.write(data);
            });
            req.on('end', function() {
                writeStream.end();
                var artifact = new ArtifactModel({
                    name: name,
                    version: parseVersion(version),
                    path: tgzFile,
                    insertDate: Date.now()
                });
                artifact.save(function(err, artifactResult){
                    if (err){ return rest.error('00000', res, err); }
                    res.statusCode = 200;
                    res.json(artifactResult);
                })
            });
        }
    })

    
});

router.get('/:name/:version.tgz', function(req, res, next) {
    var name = req.params.name;
    var version = req.params.version;
    ArtifactModel.find({ name: req.params.name, version: parseVersion(req.params.version) }, function(err, results){
        if (results && results.length === 0){
            rest.mongoError(err, res);
        }
        else {
            var tgzFile = results[0].path;

            res.contentType = 'application/x-compressed';
            res.header("Content-Disposition", "filename=" + name + "-" + version + ".tgz");
            var stream = fs.createReadStream(tgzFile);
            stream.pipe(res);
        }
    });
});

router.get('/', function(req, res, next) {
    rest.findModels(ArtifactModel, req, res, next);
});

var $module = {
    config: {},
    use: function(config){
        this.config = config;
        return router;
    }
};

module.exports = $module;