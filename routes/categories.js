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
router.delete('/deletecategory/:id',function(req,res){
  var db = req.db;
  var collection = db.get('categories');
  var toUpdate = db.get('problemlist');
  var categoryToDelete = req.params.id;
  collection.find({'_id':categoryToDelete})
    .then(function(data){
      collection.remove({'_id':data[0]._id})
        .then(function(test){
          toUpdate.update({'category':data[0].category},{$set:{'category':'Other'}},{multi:true},function(err,result){
            res.send(
              (err === null) ? { msg : '',cat: data[0].category } : { msg : err }
            );
          });
        });
    });
});

module.exports = router;
