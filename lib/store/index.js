var mongoose = require('mongoose');

module.exports = {
    open: function(config, cb){
        mongoose.connect(config.url);
        cb(null);
    }
};

