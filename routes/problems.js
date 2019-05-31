var express = require('express');
var router = express.Router();

//GetReq get specific problem from ID
router.get('/getproblem/:id',function(req,res){
  var db = req.db;
  var collection = db.get('problemlist')
  var problemToEdit = req.params.id;
  collection.find({'_id':problemToEdit})
    .then(function(obj){
      res.json(obj[0])
    });
});

//Editing problem with new data
router.put('/updateproblem/:id',function(req,res){
  var db = req.db;
  var collection = db.get('problemlist');
  var problemToUpdate = req.params.id;

  collection.find({'_id':problemToUpdate})
    .then(function (obj){
      var newProblem = req.body.problem;
      var newSolution = req.body.solution;
      var newCategory = req.body.category;
      collection.update(
        {'_id':problemToUpdate},
        {$set : {'problem' : newProblem,
                  'solution':newSolution,
                  'category':newCategory} },function(err){
          res.send(( err === null ) ? { msg : '' } : { msg : 'error' + err});
        }
      )
    })
    .catch(function (error){})

})


//GetReq Get all problems
router.get('/problemlist',function(req,res){
  var db = req.db;
  var collection = db.get('problemlist');
  collection.find({"disabled":"False"},function(e,data){
    res.json(data);
  });
});
//PostReq Add new problem
router.post('/addproblem',function(req,res){
  var db = req.db;
  var collection = db.get('problemlist');
  collection.insert({
    problem:req.body.problem,
    solution:req.body.solution,
    category:req.body.category,
    countDates:[req.body.datecreated],
    count:parseInt(req.body.count),
    disabled:"False"
  },function(err,result){
    res.send(
      (err === null) ? { msg : '' } : { msg : err }
    );
  });
});
//Delete request
router.post('/disableproblem/:id',function(req,res){
  var db = req.db;
  var collection = db.get('problemlist');
  var problemToDisable = req.params.id;
  collection.find({'_id':problemToDisable})
    .then(function (obj){
      collection.update(
        {'_id':problemToDisable},
        {$set: {"disabled":"True"} }
        ,function(err){
        res.send(( err === null ) ? { msg : '' } : { msg : 'error' + err});
      });
    })
    .catch(function(error){
      console.log(error)
    })
});
//Add +1 to count
router.post('/addcount/:id',function(req,res){
  var db = req.db;
  var collection = db.get('problemlist');
  var problemToUpdate = req.params.id;
  collection.find({'_id':problemToUpdate})
    .then(function (obj){
      collection.update(
        {'_id':problemToUpdate},
        {$push: {'countDates' : req.body.dateclicked}}
      )
      collection.update(
        {'_id':problemToUpdate},
        {$inc : {'count' : 1} },function(err){
          res.send(( err === null ) ? { msg : '' } : { msg : 'error' + err});
        }
      )
    })
    .catch(function (error){
      console.log(error)
    })

})
module.exports = router;
