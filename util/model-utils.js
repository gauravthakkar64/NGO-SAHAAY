

module.exports = {

    /*
        middleware that loads  a model from database and 
        append the model object(result) into 'req' object.
        so request can get result with 'req.model'
    */ 
    loadSingleModel(model, queryId){
        return function(req, res, next){
            model.findOne({uniqueId: req.params[queryId]}, function(err, ngo){
                if(err)
                    res.json({errMsg: err.message})
                else if(!ngo)
                    res.status(404).json({errMsg: 'Id Not Found!'})    
                else{
                    req.model = ngo
                    next();
                }
            });
        }
    },

    loadSingleModel(model, field, queryId){
        return function(req, res, next){
            model.findOne({field: req.params[queryId]}, function(err, ngo){
                if(err)
                    res.json({errMsg: err.message})
                else if(!ngo)
                    res.status(404).json({errMsg: 'Id Not Found!'})    
                else{
                    req.model = ngo
                    next();
                }
            });
        }
    }


}