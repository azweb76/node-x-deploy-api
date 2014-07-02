var app = require('./app');
var config = require('x-config');

app.init(config, function(){
    app.listen();
});