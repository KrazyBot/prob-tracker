var express = require('express');
var router = express.Router();

//GetReq Get all problems
router.get('/problemlist',function(req,res){
  var db = req.db;
  var collection = db.get('problemlist');
  collection.find({},{},function(e,docs){
    res.json(docs);
  });
});
//PostReq Add new problem
router.post('/addproblem',function(req,res){
  var db = req.db;
  var collection = db.get('problemlist');
  collection.insert(req.body,function(err,result){
    res.send(
      (err === null) ? { msg : '' } : { msg : err }
    );
  });
});
//Delete request
router.delete('/deleteproblem/:id',function(req,res){
  var db = req.db;
  var collection = db.get('problemlist');
  var problemToDelete = req.params.id;
  collection.remove({'_id':problemToDelete},function(err){
    res.send(( err === null ) ? { msg : '' } : { msg : 'error' + err});
  });
});
//Add +1 to count
router.put('/addcount/:id',function(req,res){
  var db = req.db;
  var collection = db.get('problemlist');
  var problemToUpdate = req.params.id;
  collection.find({'_id':problemToUpdate})
    .then(function (obj){
      var newCount = obj[0].count;
      newCount = parseInt(newCount,10)+1
      collection.update(
        {'_id':problemToUpdate},
        {$set : {'count' : newCount} }
      )
    })
    .catch(function (error){})

})
module.exports = router;
