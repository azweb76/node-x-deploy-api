module.exports = function(app, config){
    app.use('/channel', require('./channel'));
    app.use('/agent', require('./agent'));
    app.use('/application', require('./application'));
    app.use('/build', require('./build'));
    app.use('/action', require('./action'));
    app.use('/artifact', require('./artifact').use(config.artifacts));
};