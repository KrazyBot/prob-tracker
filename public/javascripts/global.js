//On DOM ready
$(document).ready(function() {
  $('#addProblem textarea').val('');
  $('#addProblem category').val('');
  $('#editProblem textarea').val('');
  $('#editProblem category').val('');
  var variables = getHash();
  if(variables[1] === undefined){
    variables[1] = 'All'
  }
  if(variables[2] === undefined){
    variables[2] = '';
  }
  window.location.hash = variables[0] +'/'+ variables[1]+'/'+variables[2];
  document.getElementById("#searchbox").value = variables[2]
  populateTable();
  populateCategories();
});


function getHash(){
  var hashvalues = [];
  hashvalues = location.hash.split('/');
  return(hashvalues);
}
//Sorts Data based off value
function sortBy(data, property){
  var sortable = [];
  for(var key in data){
    if(data.hasOwnProperty(key)){
      sortable.push([key,data[key]]);
    }
  }
  if(property === 'count'){
    sortable.sort(function(a,b){
      return -1 * (a[1][property] - b[1][property]);
    });
  };
  return sortable;
}

//init edit problem
function showProblemForEdit(){
  $.getJSON( '/problems/getproblem/'+ $(this).attr('rel'),function( data ){
    $('#editProblem div div textarea#editproblem').val(data.problem);
    $('#editProblem div div textarea#editsolution').val(data.solution);
    $('#editProblem div div select#editcategory').val(data.category);
    $('#editProblem div div input#ID').val(data._id);
  });
}

//init list all categories
function populateCategories(){
  var problemcategories = '';
  var cataloguecategories = '';
  var editcategorieslist = '';
  $.getJSON( '/categories/categorylist' ,function( data ){
    //for each item in db
    $.each(data,function(){
      if(this.category !== 'Other'){
        editcategorieslist += '<div class="row"><div class="col-10"><input class="form-control" type="text" placeholder="'+this.category+'" readonly></input></div><div class="col-2"> <button type="button" class="btn btn-danger linkdeletecategory" rel="' + this._id + '">X</button></div></div></br>'
        cataloguecategories += '<a class="dropdown-item categoryOption" href="#/'+this.category+'">' + this.category +'</a>'
        problemcategories += '<option>'+ this.category +'</option>';
      }
    });
      problemcategories += '<option>'+ 'Other' +'</option>';
      cataloguecategories += '<div class="dropdown-divider"></div>'
      cataloguecategories += '<a href="#/All" class="dropdown-item categoryOption">' + 'All' +'</a>'
      cataloguecategories += '<a class="dropdown-item categoryOption" href="#/Other">' + 'Other' +'</a>'
    //put table content in the table
    $('#categoryList').html(editcategorieslist);
    $('#editProblem div div select').html(problemcategories);
    $('#addProblem div div select').html(problemcategories);
    $('#listcategories a div').html(cataloguecategories);
  });
}

//init list all function
function populateTable(category,searchtext){
  //init tableContent
  var variables = getHash();
  //if the category hasnt been selected (such as on 1st load or click of title)
  if(variables[1] === undefined || variables[1] === 'All'){
    category = '';
  }else{
    category = variables[1].replace(/%20/g,' ')
  }

  if(category === "undefined" || category === "All"){
    category ='';
  }
  //if searchbox has not been used
  if(variables[2] === undefined){
    searchtext = '';
  }else{
    searchtext = variables[2].replace(/%20/g,' ')
  }
  var tableContent = '';
  //get JSON from db
  $.getJSON( '/problems/problemlist' ,function( data ){
    searcheddata = [];
    if(searchtext){
      searchtext = searchtext.toLowerCase();
      $.each(data,function(){
        if(this.problem.toLowerCase().includes(searchtext) || this.solution.toLowerCase().includes(searchtext)){
          searcheddata.push(this)
        }
      })
      data = searcheddata;
    }

    var sortedData = sortBy(data,'count');
    if(category){
      $('#navbar nav a#title').html('Trackr' +': '+category);
      $.each(sortedData,function(){
        if(this[1].category === category){
          tableContent += '<tr>';
          tableContent += '<td>'+ this[1].problem +'</td>';
          tableContent += '<td>'+ this[1].solution +'</td>';
          tableContent += '<td>'+ this[1].count +'</td>';

          tableContent += '<td><center><button class="btn btn-secondary linkaddcount" href="#" rel="' + this[1]._id + '">+1</center></td>';
          tableContent += '<td><button class="btn btn-info linkeditproblem" data-toggle="modal" data-target="#problemEdit" href="#"  rel="' + this[1]._id + '"><img src="/images/pencil.svg"></img></td>';
          tableContent += '<td><button class="btn btn-danger linkdeleteproblem" href="#"  rel="' + this[1]._id + '"><img src="/images/trashcan.svg"></img></td>';
          tableContent += '</tr>';
        }
      });
    }else{
      $('#navbar nav a#title').html('Trackr');
      $.each(sortedData,function(){
        tableContent += '<tr>';
        tableContent += '<td>'+ this[1].problem +'</td>';
        tableContent += '<td>'+ this[1].solution +'</td>';
        tableContent += '<td>'+ this[1].count +'</td>';
        tableContent += '<td><center><button class="btn btn-secondary linkaddcount" href="#" rel="' + this[1]._id + '">+1</center></td>';
        tableContent += '<td><button class="btn btn-info linkeditproblem" data-toggle="modal" data-target="#problemEdit" href="#"  rel="' + this[1]._id + '"><img src="/images/pencil.svg"></img></td>';
        tableContent += '<td><button class="btn btn-danger linkdeleteproblem" href="#"  rel="' + this[1]._id + '"><img src="/images/trashcan.svg"></img></td>';
        tableContent += '</tr>';
      });
    }
    //for each item in db

    //put table content in the table
    $('#problemList table tbody').html(tableContent);
  });
};

//init update problems
function updateProblem(){

  //basic validation for now
  var errorCount = 0;
  $('#editProblem textarea').each(function(index,val){
    if($(this).val() === ''){
      errorCount++;
    };
  });
  //check all forms are filled
  if(errorCount === 0){
    //create json for fields
    var newProblem ={
      'ID':$('#editProblem input#ID').val(),
      'problem':$('#editProblem textarea#editproblem').val(),
      'solution':$('#editProblem textarea#editsolution').val(),
      'category':$('#editProblem select#editcategory').val()
    }
    //sends problem to db
    $.ajax({
      type: 'PUT',
      data: newProblem,
      url: '/problems/updateproblem/'+newProblem.ID,
      datatype: 'JSON'
    }).done(function(response){
      //if success
      if(response.msg === ''){
        //refreshes table
        populateTable();
      }
      else{
        //if error show error
        alert('error' + response.msg);
      }
    });
  }
  else{
    //if fields are missing
    alert('Please fill in all fields');
    return false;
  }
}

//init add category function
function addCategory(event){


  //basic validation for now
  var errorCount = 0;
  $('#addCategory input').each(function(index,val){
    if($(this).val() === ''){
      errorCount++;
    };
  });
  //check all forms are filled
  if(errorCount === 0){
    //create json for fields
    var newCategory ={
      'category':$('#addCategory input#category').val()
    }
    //sends problem to db
    $.ajax({
      type: 'POST',
      data: newCategory,
      url: '/categories/addcategory',
      datatype: 'JSON'
    }).done(function(response){
      //if success
      if(response.msg === ''){
        //clears fields
        $('#addCategory input').val('');
        //refreshes table
        populateTable();
      }
      else{
        //if error show error
        alert('error' + response.msg);
      }
    });
  }
  else{
    //if fields are missing
    alert('Please fill in all fields');
    return false;
  }
  populateCategories();
}

//init delete category function
function deleteCategory(){
  //asks the user if they're sure
  var confirmation = confirm('Are you sure you want to delete this item?');
    //if user confirms
  if(confirmation === true){
    $.ajax({
      type: 'DELETE',
      url: '/categories/deletecategory/' + $(this).attr('rel')
    }).done(function(response){
      //successful blank message
      if(response.msg === ''){
      }else{
        alert('Error: '+ response.msg);
      }
      populateTable();
      populateCategories();
    });
  }else{
    //if they cancel
    return false;
  }
}

//init add problem function
function addProblem(event){
  //get current date
  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  var date = (day<10 ? '0' :'') + day +'/'+(month<10 ? '0' : '')+ month + '/' + (day<10 ? '0' :'') + d.getFullYear();
  //basic validation for now
  var errorCount = 0;
  $('#addProblem textarea').each(function(index,val){
    if($(this).val() === ''){
      errorCount++;
    };
  });
  //check all forms are filled
  if(errorCount === 0){
    //create json for fields
    var newProblem ={
      'problem':$('#addProblem textarea#problem').val(),
      'solution':$('#addProblem textarea#solution').val(),
      'category':$('#addProblem select#category').val(),
      'datecreated': date,
      'count': 1
    }
    //sends problem to db
    $.ajax({
      type: 'POST',
      data: newProblem,
      url: '/problems/addproblem',
      datatype: 'JSON'
    }).done(function(response){
      //if success
      if(response.msg === ''){
        //clears fields
        $('#addProblem textarea').val('');
        //refreshes table
        populateTable();
      }
      else{
        //if error show error
        alert('error' + response.msg);
      }
    });
  }
  else{
    //if fields are missing
    alert('Please fill in all fields');
    return false;
  }
}

//init del problem function
function deleteProblem(event){

  //asks the user if they're sure
  var confirmation = confirm('Are you sure you want to delete this item?');
    //if user confirms
  if(confirmation === true){
    $.ajax({
      type: 'DELETE',
      url: '/problems/deleteproblem/' + $(this).attr('rel')
    }).done(function(response){
      //successful blank message
      if(response.msg === ''){
      }else{
        alert('Error: '+ response.msg);
      }
      populateTable();
    });
  }else{
    //if they cancel
    return false;
  }
};

//init add count function
function addCount(event){

  var d = new Date();
  var month = d.getMonth()+1;
  var day = d.getDate();
  var date = (day<10 ? '0' :'') + day +'/'+(month<10 ? '0' : '')+ month + '/' + (day<10 ? '0' :'') + d.getFullYear();
  var data = {'dateclicked' : date}

  $.ajax({
    type: 'POST',
    data: data,
    url: '/problems/addcount/' + $(this).attr('rel')
  }).done(function(response){
    //successful blank message
    if(response.msg === ''){
    }else{
      alert('Error: '+ response.msg);
    }
    populateTable();
  });

}

//add problem button on click
$('#btnAddProblem').on('click', function(){
  event.preventDefault();
  addProblem();
});
$('#btnAddCategory').on('click', function(){
  event.preventDefault();
  addCategory();
});
$('#btnEditProblem').on('click' ,function(){
  event.preventDefault();
  editProblem();
});
$('#title').on('click',function(){
  event.preventDefault();
  var variables = getHash();
  window.location.hash = variables[0] +'/'+ 'All' +'/'+document.getElementById("#searchbox").value;
})
$('#dropdownMenu').on('click','a.dropdown-item', function(){
  event.preventDefault();
  window.location.hash = this.hash+'/'+document.getElementById("#searchbox").value;
});
$(window).on('hashchange', function(){
  populateTable()
})
$('#search div button').on('click',function(){
  event.preventDefault();
  var variables = getHash();
  window.location.hash = variables[0] +'/'+ variables[1]+'/'+document.getElementById("#searchbox").value;

});
$('#problemList div table tbody').on('click', 'tr td button.linkaddcount', addCount );
$('#problemList div table tbody').on('click', 'tr td button.linkdeleteproblem', deleteProblem );
$('#categoryList').on('click', 'button.linkdeletecategory', deleteCategory );
$('#problemList div table tbody').on('click', 'tr td button.linkeditproblem', showProblemForEdit );
