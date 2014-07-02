function errorHandlerMiddleware(err, req, res, next ){
    if(!err) return next();
    console.log("error!!! ", err);
    res.send("error!!!");
}

function errorHandler(config) {
    return errorHandlerMiddleware.bind(config);
}

module.exports = errorHandler;