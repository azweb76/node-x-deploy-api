function authTokenMiddleware(req, res, next ){
    var self = this;
    if (req.headers) {
        var token = req.headers['x-authtoken'] || req.query['x-authtoken'];
        if (token && self.tokens.indexOf(token) > -1){
            return next();
        }
    }
    res.send(401, 'Unauthorized');
    res.end();
}

function authTokenParser(config) {
    return authTokenMiddleware.bind(config);
}

module.exports = authTokenParser;