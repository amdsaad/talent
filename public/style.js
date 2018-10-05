'use strict';

var numberOfItemsDefault  = $('#page-default .list-group').length; // Get total number of the items that should be paginated
var limitPerPageDefault  = 8; // Limit of items per each page
$('#page-default .list-group:gt(' + (limitPerPageDefault  - 1) + ')').hide(); // Hide all items over page limits (e.g., 5th item, 6th item, etc.)
var totalPagesDefault  = Math.round(numberOfItemsDefault  / limitPerPageDefault ); // Get number of pages
$(".pagination-default").append("<li class='current-page-default active page-item'><a class='page-link' href='javascript:void(0)'>" + 1 + "</a></li>"); // Add first page marker

// Loop to insert page number for each sets of items equal to page limit (e.g., limit of 4 with 20 total items = insert 5 pages)
for (var i = 2; i <= totalPagesDefault ; i++) {
  $(".pagination-default").append("<li class='current-page-default page-item'><a class='page-link' href='javascript:void(0)'>" + i + "</a></li>"); // Insert page number into pagination tabs
}

if(totalPagesDefault > 1){
  $(".pagination-default").append("<li class='page-item' id='next-page-default'><a class='page-link' href='javascript:void(0)' aria-label='Next'><span aria-hidden='true'>&raquo;</span></a></li>");
}
// Add next button after all the page numbers  

// Function that displays new items based on page number that was clicked
$(".pagination-default li.current-page-default").on("click", function() {
  // Check if page number that was clicked on is the current page that is being displayed
  if ($(this).hasClass('active')) {
    return false; // Return false (i.e., nothing to do, since user clicked on the page number that is already being displayed)
  } else {
    var currentPageDefault  = $(this).index(); // Get the current page number
    $(".pagination-default li").removeClass('active'); // Remove the 'active' class status from the page that is currently being displayed
    $(this).addClass('active'); // Add the 'active' class status to the page that was clicked on
    $("#page-default .list-group").hide(); // Hide all items in loop, this case, all the list groups
    var grandTotalDefault  = limitPerPageDefault  * currentPageDefault ; // Get the total number of items up to the page number that was clicked on

    // Loop through total items, selecting a new set of items based on page number
    for (var i = grandTotalDefault  - limitPerPageDefault ; i < grandTotalDefault ; i++) {
      $("#page-default .list-group:eq(" + i + ")").show(); // Show items from the new page that was selected
    }
  }

});

// Function to navigate to the next page when users click on the next-page id (next page button)
$("#next-page-default").on("click", function() {
  var currentPageDefault = $(".pagination-default li.active").index(); // Identify the current active page
  // Check to make sure that navigating to the next page will not exceed the total number of pages
  if (currentPageDefault === totalPagesDefault) {
    return false; // Return false (i.e., cannot navigate any further, since it would exceed the maximum number of pages)
  } else {
    currentPageDefault++; // Increment the page by one
    $(".pagination-default li").removeClass('active'); // Remove the 'active' class status from the current page
    $("#page-default .list-group").hide(); // Hide all items in the pagination loop
    var grandTotalDefault = limitPerPageDefault * currentPageDefault; // Get the total number of items up to the page that was selected

    // Loop through total items, selecting a new set of items based on page number
    for (var i = grandTotalDefault - limitPerPageDefault; i < grandTotalDefault; i++) {
      $("#page-default .list-group:eq(" + i + ")").show(); // Show items from the new page that was selected
    }

    $(".pagination-default li.current-page-default:eq(" + (currentPageDefault  - 1) + ")").addClass('active'); // Make new page number the 'active' page
  }
});

// Function to navigate to the previous page when users click on the previous-page id (previous page button)
$("#previous-page-default").on("click", function() {
  var currentPageDefault = $(".pagination-default li.active").index(); // Identify the current active page
  // Check to make sure that users is not on page 1 and attempting to navigating to a previous page
  if (currentPageDefault === 1) {
    return false; // Return false (i.e., cannot navigate to a previous page because the current page is page 1)
  } else {
    currentPageDefault--; // Decrement page by one
    $(".pagination-default li").removeClass('active'); // Remove the 'activate' status class from the previous active page number
    $("#page-default .list-group").hide(); // Hide all items in the pagination loop
    var grandTotalDefault = limitPerPageDefault * currentPageDefault; // Get the total number of items up to the page that was selected

    // Loop through total items, selecting a new set of items based on page number
    for (var i = grandTotalDefault - limitPerPageDefault; i < grandTotalDefault; i++) {
      $("#page-default .list-group:eq(" + i + ")").show(); // Show items from the new page that was selected
    }

    $(".pagination-default li.current-page-default:eq(" + (currentPageDefault - 1) + ")").addClass('active'); // Make new page number the 'active' page
  }
});