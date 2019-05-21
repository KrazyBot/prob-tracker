//data array
var problemListData = [];
//On DOM ready
$(document).ready(function() {
  populateTable();
});
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

//init list all function
function populateTable(){
  //init tableContent
  var tableContent = '';
  //get JSON from db
  $.getJSON( '/problems/problemlist' ,function( data ){
    var sortedData = sortBy(data,'count');
    //for each item in db
    $.each(sortedData,function(){
      tableContent += '<tr>';
      tableContent += '<td>#</td>';
      tableContent += '<td>'+ this[1].problem +'</td>';
      tableContent += '<td>'+ this[1].solution +'</td>';
      tableContent += '<td>'+ this[1].count +'</td>';
      tableContent += '<td><a href="#" class="linkaddcount" rel="' + this[1]._id + '">x</td>';
      tableContent += '<td><a href="#" class="linkdeleteproblem" rel="' + this[1]._id + '">x</td>';
      tableContent += '</tr>';
    });
    //put table content in the table
    $('#problemList table tbody').html(tableContent);
  });
};

//init add problem function
function addProblem(event){

}


//add problem button on click
$('#btnAdd').on('click', addProblem );
