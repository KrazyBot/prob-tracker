var express = require('express');
var router = express.Router();

//GetReq Get all categories
router.get('/categorylist',function(req,res){
  var db = req.db;
  var collection = db.get('categories');
  collection.find({},{},function(e,docs){
    res.json(docs);
  });
});


module.exports = router;
