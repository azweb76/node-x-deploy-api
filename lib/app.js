var express = require('express');
var store = require('./store');
var bodyParser = require('body-parser');
var authTokenParser = require('./middleware/authTokenParser');
var errorHandler = require('./middleware/errorHandler');
var messaging = require('./messaging');

var app = express();

module.exports = {
    config: null,
    init: function(config, cb){
        this.config = config;
        app.use(errorHandler(config));
        app.use(authTokenParser(config.server.auth));
        app.use(bodyParser());
        require('./routes')(app, config);
        if (cb) cb(null);
    },
    listen: function(cb){
        var self = this;
        var config = self.config;
        messaging.init(config.messaging, function(err, msgClient){
            if (err){ return cb(err); }
            store.open(config.db, function(err){
                if (err){ return cb(err); }
                app.listen(config.server.port || 8080);
                console.log('listening on port ' + config.server.port);
                if (cb) cb(null, this);
            });
        });
    },
    close: function(cb){
        store.close(cb);
    }
};