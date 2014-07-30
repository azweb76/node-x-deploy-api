var errors = {
    "00000": { "status": 500, "code": "00000", "message": "Unknown error." },
    "00001": { "status": 500, "code": "00001", "message": "Unable to find objects" },
    "00002": { "status": 500, "code": "00002", "message": "Unable to save object" },
    "00003": { "status": 500, "code": "00003", "message": "Unable to delete object" },
    "not-found": { "status": 404, "code": "not-found", "message": "Unable to find object" },
    "00006": { "status": 500, "code": "00006", "message": "Unable to find application." },
    "00007": { "status": 500, "code": "00007", "message": "Artifact version is already published." },
    "00008": { "status": 404, "code": "00008", "message": "Artifact not found." },
    "mongo-11000": { "status": 409, "code": "dup-key", "message": "Record already exists." }
};

function findModel(model, req, res, next){
    var q = model.findById(req.params.id);
    if (req.query._fields){ q = q.select(req.query._fields); }
    q.exec(function(err, results){
        if (err){ return mongoError(err, res); }
        if (!results || !results.length){
            return error('not-found', res);
        }

        var o = results.toObject();
        o.href = getHref(req);
        res.json(o);
    });
}
function findModels(model, req, res, next){
    var q = model.find(getQueryFields(req));
    
    if (req.query._limit){ q = q.limit(req.query._limit); }
    if (req.query._skip){ q = q.skip(req.query._skip); }
    if (req.query._sort){ q = q.sort(req.query._sort); }
    if (req.query._fields){ q = q.select(req.query._fields); }

    q.exec(function(err, results){
        if (err){ return mongoError(err, res); }
        res.json({
            href: getHref(req),
            items: results
        });
    });
}
function saveModel(model, req, res, next){
    if (req.params.id){
        model.findByIdAndUpdate(req.params.id, req.body, function(err, result){
            if (err){ return mongoError(err, res); }
            res.json(200, {
                status: 200,
                item: result
            });
        })
    }
    else {
        saveModelInternal(new model(), true, req, res, next);
    }
}
function findAndSaveModel(model, query, req, res, next){
    model.find(query, function(err, items){
        if (err){ return mongoError(err, res); }

        var isNew = false;
        var item = null;

        if (items.length === 0){
            isNew = true;
            item = new model();
        }
        else {
            item = items[0];
        }

        for(var n in req.body){
            if (n[0] !== '_'){
                item[n] = req.body[n];
            }
        }

        item.save(function (err, results) {
            if (err){ return mongoError(err, res); }

            res.statusCode = (isNew ? 201 : 200);
            res.json({
                status: res.statusCode,
                item: results
            });
        });
    });
}
function saveModelInternal(m, isNew, req, res, next){
    for(p in req.body){
        m[p] = req.body[p];
    }

    m.save(function(err, results){
        if (err){ return mongoError(err, res); }
        res.status = (isNew ? 201 : 200);
        if (req.query._body){
            var o = results.toObject();
            res.json(o);
        }
        else {
            res.end();
        }
    });
}

function deleteModel(model, req, res, next){
    if (req.params.id){
        model.findByIdAndRemove(req.params.id, function(err, result){
            if (err){ return mongoError(err, res); }
            res.status = 200;
            res.end('deleted');
        });
    }
    else {
        model.remove(req.query, function(err, result){
            if (err){ return mongoError(err, res); }
            res.status = 200;
            res.end('deleted ' + result);
        });
    }
}
function getQueryFields(req){
    var q = {};
    for(var n in req.params){
        if (n[0] !== '_'){
            q[n] = req.params[n];
        }
    }
    for(var n in req.query){
        if (n[0] !== '_'){
            q[n] = req.query[n];
        }
    }
    return q;
}
function getHref(req){
    return req.originalUrl;
}
function mongoError(err, res){
    return error('mongo-' + err.code, res);
}
function error(code, res, error){
    var err = errors[code];
    if (!err){ err = errors['00000']; }
    res.statusCode = err.status;
    res.json({
        status: err.status,
        code: err.code,
        message: err.message
    });
}

module.exports = {
    findModel: findModel,
    findModels: findModels,
    saveModel: saveModel,
    findAndSaveModel: findAndSaveModel,
    deleteModel: deleteModel,
    error: error,
    mongoError: mongoError
};