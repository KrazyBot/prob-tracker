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
module.exports = router;
