'use strict';

var numberOfItems = $('#page-applications .list-group-applications').length; 
var limitPerPage = 1; 
$('#page-applications .list-group-applications:gt(' + (limitPerPage - 1) + ')').hide(); 
var totalPages = Math.round(numberOfItems / limitPerPage); 
$(".pagination-applications").append("<li class='current-page active page-item'><a class='page-link' href='javascript:void(0)'>" + 1 + "</a></li>");

for (var i = 2; i <= totalPages; i++) {
  $(".pagination-applications").append("<li class='current-page page-item'><a class='page-link' href='javascript:void(0)'>" + i + "</a></li>"); 
}

$(".pagination-applications").append("<li class='page-item' id='next-page'><a class='page-link' href='javascript:void(0)' aria-label='Next'><span aria-hidden='true'>&raquo;</span></a></li>");

$(".pagination-applications li.current-page").on("click", function() {
  if ($(this).hasClass('active')) {
    return false; 
  } else {
    var currentPage = $(this).index(); 
    $(".pagination-applications li").removeClass('active'); 
    $(this).addClass('active'); 
    $("#page-applications .list-group-applications").hide(); 
    var grandTotal = limitPerPage * currentPage; 
    for (var i = grandTotal - limitPerPage; i < grandTotal; i++) {
      $("#page-applications .list-group-applications:eq(" + i + ")").show(); 
    }
  }
});

$("#next-page").on("click", function() {
  var currentPage = $(".pagination-applications li.active").index(); 
  if (currentPage === totalPages) {
    return false; 
  } else {
    currentPage++; 
    $(".pagination-applications li").removeClass('active'); 
    $("#page-applications .list-group-applications").hide(); 
    var grandTotal = limitPerPage * currentPage;

    for (var i = grandTotal - limitPerPage; i < grandTotal; i++) {
      $("#page-applications .list-group-applications:eq(" + i + ")").show();
    }
    $(".pagination-applications li.current-page:eq(" + (currentPage - 1) + ")").addClass('active'); 
  }
});

$("#previous-page").on("click", function() {
  var currentPage = $(".pagination-applications li.active").index();
  if (currentPage === 1) {
    return false;
  } else {
    currentPage--;
    $(".pagination-applications li").removeClass('active');
    $("#page-applications .list-group-applications").hide();
    var grandTotal = limitPerPage * currentPage;

    for (var i = grandTotal - limitPerPage; i < grandTotal; i++) {
      $("#page-applications .list-group-applications:eq(" + i + ")").show();
    }

    $(".pagination-applications li.current-page:eq(" + (currentPage - 1) + ")").addClass('active');
  }
});