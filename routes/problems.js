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
  collection.find({},function(e,data){
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
    datecreated:req.body.datecreated,
    count:parseInt(req.body.count),
  },function(err,result){
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
router.post('/addcount/:id',function(req,res){
  var db = req.db;
  console.log(req.body)
  var collection = db.get('problemlist');
  var problemToUpdate = req.params.id;
  collection.find({'_id':problemToUpdate})
    .then(function (obj){
      if(obj[0].countDates === undefined){
        collection.update(
          {'_id':problemToUpdate},
          {$set : {'countDates' : [] } },
          {$push: {'countDates' : req.body.dateclicked}}
        )
      }else{
        console.log(req.body.dateclicked)
        console.log(obj[0].countDates)
      }
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
