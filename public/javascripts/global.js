//data array
var problemListData = [];
//On DOM ready
$(document).ready(function() {
  populateTable();
});

//init function
function populateTable(){
  //init tableContent
  var tableContent = '';
  //get JSON from db
  $.getJSON( '/problems/problemlist' ,function( data ){
    //for each item in db
    $.each(data,function(){
      tableContent += '<tr>';
      tableContent += '<td>#</td>';
      tableContent += '<td>'+ this.problem +'</td>';
      tableContent += '<td>'+ this.solution +'</td>';
      tableContent += '<td>'+ this.count +'</td>';
      tableContent += '<td>x</td>';
      tableContent += '<td>x</td>';
      tableContent += '</tr>';
    });
    //put table content in the table
    $('#problemList table tbody').html(tableContent);
  });
};
