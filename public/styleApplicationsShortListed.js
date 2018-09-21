'use strict';

var numberOfItemsShortlisted = $('#page-applications-shortlisted .list-group-applications-shortlisted').length; 
var limitPerPageShortlisted = 1; 
$('#page-applications-shortlisted .list-group-applications-shortlisted:gt(' + (limitPerPageShortlisted - 1) + ')').hide(); 
var totalPagesShortlisted = Math.round(numberOfItemsShortlisted / limitPerPageShortlisted); 
$(".pagination-applications-shortlisted").append("<li class='current-page-shortlisted active page-item'><a class='page-link' href='javascript:void(0)'>" + 1 + "</a></li>");

for (var i = 2; i <= totalPagesShortlisted; i++) {
  $(".pagination-applications-shortlisted").append("<li class='current-page-shortlisted page-item'><a class='page-link' href='javascript:void(0)'>" + i + "</a></li>"); 
}

$(".pagination-applications-shortlisted").append("<li class='page-item' id='next-page-shortlisted'><a class='page-link' href='javascript:void(0)' aria-label='Next'><span aria-hidden='true'>&raquo;</span></a></li>");

$(".pagination-applications-shortlisted li.current-page-shortlisted").on("click", function() {
  if ($(this).hasClass('active')) {
    return false; 
  } else {
    var currentPageShortlisted = $(this).index(); 
    $(".pagination-applications-shortlisted li").removeClass('active'); 
    $(this).addClass('active'); 
    $("#page-applications-shortlisted .list-group-applications-shortlisted").hide(); 
    var grandTotalShortlisted = limitPerPageShortlisted * currentPageShortlisted; 
    for (var i = grandTotaShortlistedl - limitPerPageShortlisted; i < grandTotalShortlisted; i++) {
      $("#page-applications-shortlisted .list-group-applications-shortlisted:eq(" + i + ")").show(); 
    }
  }
});

$("#next-page-shortlisted").on("click", function() {
  var currentPageShortlisted = $(".pagination-applications-shortlisted li.active").index(); 
  if (currentPageShortlisted === totalPagesShortlisted) {
    return false; 
  } else {
    currentPageShortlisted++; 
    $(".pagination-applications-shortlisted li").removeClass('active'); 
    $("#page-applications-shortlisted .list-group-applications-shortlisted").hide(); 
    var grandTotalShortlisted = limitPerPageShortlisted * currentPageShortlisted;

    for (var i = grandTotalShortlisted - limitPerPageShortlisted; i < grandTotalShortlisted; i++) {
      $("#page-applications-shortlisted .list-group-applications-shortlisted:eq(" + i + ")").show();
    }
    $(".pagination-applications-shortlisted li.current-page-shortlisted:eq(" + (currentPageShortlisted - 1) + ")").addClass('active'); 
  }
});

$("#previous-page-shortlisted").on("click", function() {
  var currentPageShortlisted = $(".pagination-applications-shortlisted li.active").index();
  if (currentPageShortlisted === 1) {
    return false;
  } else {
    currentPageShortlisted--;
    $(".pagination-applications-shortlisted li").removeClass('active');
    $("#page-applications-shortlisted .list-group-applications-shortlisted").hide();
    var grandTotalShortlisted = limitPerPageShortlisted * currentPageShortlisted;

    for (var i = grandTotalShortlisted - limitPerPageShortlisted; i < grandTotalShortlisted; i++) {
      $("#page-applications-shortlisted .list-group-applications-shortlisted:eq(" + i + ")").show();
    }

    $(".pagination-applications-shortlisted li.current-page-shortlisted:eq(" + (currentPageShortlisted - 1) + ")").addClass('active');
  }
});