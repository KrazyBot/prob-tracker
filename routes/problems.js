var express = require('express');
var router = express.Router();

//Get all problems
router.get('/problemlist',function(req,res){
  var db = req.db;
  var collection = db.get('problemlist');
  collection.find({},{},function(e,docs){
    res.json(docs);
  });
});

module.exports = router;
