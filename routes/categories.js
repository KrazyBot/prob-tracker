var express = require('express');
var router = express.Router();

//Get Req Get all categories
router.get('/categorylist',function(req,res){
  var db = req.db;
  var collection = db.get('categories');
  collection.find({},{},function(e,docs){
    res.json(docs);
  });
});
//post req add new category
router.post('/addcategory',function(req,res){
  var db = req.db;
  var collection = db.get('categories');
  collection.insert(req.body,function(err,result){
    res.send(
      (err === null) ? { msg : '' } : { msg : err }
    );
  });
});

module.exports = router;
