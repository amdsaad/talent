
$('#new-post-form').submit(function (e) {
  e.preventDefault();

  var postItem = $(this).serializeArray();

  $.post('/posts', postItem, function (data) {
    var postBody = data.body;

    var shortText = jQuery.trim(postBody).substring(0, 100)
      .split(" ").slice(0, -1).join(" ") + "...";
    var blodStatus = data.status;
    if (blodStatus == 'public') {
      $('#post-list').prepend(
        `
        <div class="col-md-12">
        <div class="card product-card mb-4 post-card">
          <!-- Content -->
          <div class="card-body p-3 pos-relative row">
            <!-- Image content -->
            <div class="col-md-4 mb-2 mb-md-0">
              <img class="rounded img-fluid image-post" src="${data.image}" alt="Card image cap">
            </div>
            <!-- Product details -->
            <div class="col-md-8 d-flex flex-column">
              <h4 class="card-title mb-2">
                <a href="/posts/show/${data._id}" class="text-grey-dark">${data.title}</a>
              </h4>
              <p class="text-muted text-uppercase text-xs mb-1">
                <span class="text-primary">Author</span> : ${data.userName} <span><img class="rounded-circle ml-1 small-image" src="${data.userImage}}" alt=""></span></p>
              <p class="text-muted text-uppercase text-xs mb-1">
                <span class="text-primary">${data.date}</span> </p>
              <p class="text-muted text-xs">${shortText}</p>
            </div>
          </div>
        </div>
      </div>
      
        `
      )
    }
    $('#new-post-form').find('.form-control').val('');
    $(".post-new-area").toggle();

  })
});

/* Published Resume Edit Start */
$('#edit-resume').on('submit', '.published-resume-form', function (e) {
  e.preventDefault();
  var publ = $(this).serializeArray();
  var actionUrl = $(this).attr('action');
  var $originalItem = $(this).parent('.list-group-item');
  $.ajax({
    url: actionUrl,
    data: publ,
    type: 'PUT',
    originalItem: $originalItem,
    success: function (data) {
      if(data.published == 'false'){
        this.originalItem.html(
          `
          <p>Your resume is not yet <span class="text-warning">Published</span> , please published your resume once it is complated</p>
          <form method="post" action="/candidate-resume/${data._id}" class="published-resume-form">
            <input type="hidden" name="resume[published]" value="true">
            <input type="submit" value="Publish" class="btn btn-primary w-100" />
          </form>      
        `
        )
      }else{
        this.originalItem.html(
          `
          <p>Your resume is <span class="text-warning">Published</span></p>
          <form method="post" action="/candidate-resume/${data._id}" class="published-resume-form">
            <input type="hidden" name="resume[published]" value="false">
            <input type="submit" value="Un-Publish" class="btn btn-primary w-100" />
          </form>       
        `
        )
      }
    }
  });
});
/* Published Resume Edit End  */

/* Resume Default Style Edit Start */
$('#edit-resume').on('submit', '.style-resume-form', function (e) {
  e.preventDefault();
  var publ = $(this).serializeArray();
  var actionUrl = $(this).attr('action');
  var $originalItem = $(this).parent('.list-group-item');
  $.ajax({
    url: actionUrl,
    data: publ,
    type: 'PUT',
    originalItem: $originalItem,
    success: function (data) {
      window.location.href=window.location.href;
    }
  });
});
/* Resume Default Style Edit End */

$('#add-exp').submit(function (e) {
  e.preventDefault();
  var exp = $(this).serializeArray();
  $.post('/candidate-resume/experience', exp, function (data) {
    var expTo = $.format.date(data.to, "dd MMM yyyy");
    var expFrom = $.format.date(data.from, "dd MMM yyyy");
    if (expTo) {
      expEnd = expTo
    } else {
      expEnd = data.current
    };

    console.log(data)
    $('#exp-list').prepend(
      `
      <li class="list-group-item mt-3">
      <form method="POST" action="/candidate-resume/experience/${data._id}" class="edit-exp-form">
        <div class="form-group row">
          <div class="col-md-4">
            <input type="text" class="form-control border-op-8 border-grey" value="${data.title}" name="exper[title]" required />
          </div>
          <div class="col-md-4">
            <input type="text" class="form-control border-op-8 border-grey" value="${data.company}" name="exper[company]" required />
          </div>
          <div class="col-md-4">
            <input type="text" class="form-control border-op-8 border-grey" value="${data.location}" name="exper[location]" />
          </div>
        </div>
        <div class="form-group row">
          <div class="col-md-5">
            <h6>From Date</h6>
            <input type="date" class="form-control border-op-8 border-grey" name="exper[from]" 
            />
          </div>
          <div class="col-md-7">
            <h6>To Date</h6>
            <div class="row">
              <div class="col-md-7 to-date-exp">
                <input type="date" class="form-control border-op-8 border-grey" name="exper[to]" />
              </div>
              <div class="col-md-5 ">
                <div class="form-check mb-4 mr-sm-4 mb-sm-2 mt-2">
                  <input class="form-check-input" type="checkbox" name="exper[current]" value="Till Now" id="current-exp-edit" />
                  <label class="form-check-label" for="current">Current Job</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-group row">
          <div class="col-md-12">
            <textarea class="form-control border-op-8 border-grey" name="exper[description]">${data.description}</textarea>
          </div>
        </div>
        <input type="submit" value="Update" class="btn btn-info" />
      </form>
      <div class="row mr-0 ml-0 mt-2 mb-2 bg-op-1 bg-op-5 bg-gradient">
        <div class="col-sm-9 col-md-8 col-lg-8">
          <div class=" text-left pt-2 pb-2">
            <h5>${data.title} @
              <span class="text-blue  ">${data.company} - ${data.location}</span>
            </h5>
          </div>
        </div>
        <div class="col-sm-3 col-md-4 col-lg-4">
          <div class="float-right pt-2 pb-2">
            <h6 class="text-green">${expFrom} - ${expEnd} </h6>
          </div>
        </div>
        <div class="col-md-12">
          <div class="text-grey-dark">
            <p>${data.description}</p>
          </div>
        </div>
      </div>
      <div class="" >
      <button type="button" class="btn btn-outline-primary btn-sm edit-button">Edit</button>
      <form style="display: inline" method="POST" action="/candidate-resume/experience/${data._id}" class="delete-exp-form">
        <button type="submit" class="btn btn-outline-danger btn-sm">Delete</button>
      </form>
    </div>
    </li>
    `
    )
    $('#add-exp').find('.form-control').val('');
    $('#add-exp').find('.form-check-input').prop("checked", false);
    $(".exp-new-area").toggle();
  });
});

//Edit Exp
$('#exp-list').on('click', '.edit-button', function () {
  $(this).parent().siblings('.edit-exp-form').toggle();
});

$('#exp-list').on('submit', '.edit-exp-form', function (e) {
  e.preventDefault();
  var exp = $(this).serializeArray();
  var actionUrl = $(this).attr('action');
  var $originalItem = $(this).parent('.list-group-item');
  $.ajax({
    url: actionUrl,
    data: exp,
    type: 'PUT',
    originalItem: $originalItem,
    success: function (data) {
      var expTo = $.format.date(data.to, "dd MMM yyyy");
      var expFrom = $.format.date(data.from, "dd MMM yyyy");
      if (expTo) {
        expEnd = expTo
      } else {
        expEnd = data.current
      };
      this.originalItem.html(
        `
          <form method="POST" action="/candidate-resume/experience/${data.id}" class="edit-exp-form">
          <div class="form-group row">
            <div class="col-md-4">
              <input type="text" class="form-control border-op-8 border-grey" value="${data.title}" name="exper[title]" required />
            </div>
            <div class="col-md-4">
              <input type="text" class="form-control border-op-8 border-grey" value="${data.company}" name="exper[company]" required />
            </div>
            <div class="col-md-4">
              <input type="text" class="form-control border-op-8 border-grey" value="${data.location}" name="exper[location]" />
            </div>
          </div>
          <div class="form-group row">
            <div class="col-md-5">
              <h6>From Date</h6>
              <input type="date" class="form-control border-op-8 border-grey" name="exper[from]"/>
            </div>
            <div class="col-md-7">
              <h6>To Date</h6>
              <div class="row">
                <div class="col-md-7 to-date">
                  <input type="date" class="form-control border-op-8 border-grey" name="exper[to]" />
                </div>
                <div class="col-md-5 ">
                  <div class="form-check mb-4 mr-sm-4 mb-sm-2 mt-2">
                    <input class="form-check-input" type="checkbox" name="exper[current]" value="Till Now" id="current-edit" />
                    <label class="form-check-label" for="current">Current Job</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group row">
            <div class="col-md-12">
              <textarea class="form-control border-op-8 border-grey" placeholder="Some of your responsabilities, Job description" name="exper[description]">${data.description}</textarea>
            </div>
          </div>
          <input type="submit" value="Update" class="btn btn-info" />
        </form>
        <div class="row mr-0 ml-0 mt-2 mb-2 bg-op-1 bg-op-5 bg-gradient">
          <div class="col-sm-9 col-md-8 col-lg-8">
            <div class=" text-left pt-2 pb-2">
              <h5>${data.title} @
                <span class="text-blue  ">${data.company} - ${data.location}</span>
              </h5>
            </div>
          </div>
          <div class="col-sm-3 col-md-4 col-lg-4">
            <div class="float-right pt-2 pb-2">
            <h6 class="text-green">${expFrom} - ${expEnd} </h6>
            </div>
          </div>
          <div class="col-md-12">
            <div class="text-grey-dark">
              <p>${data.description}</p>
            </div>
          </div>
        </div>
        <div class="" >
        <button type="button" class="btn btn-outline-primary btn-sm edit-button">Edit</button>
        <form style="display: inline" method="POST" action="/candidate-resume/experience/${data.id}" class="delete-exp-form">
          <button type="submit" class="btn btn-outline-danger btn-sm">Delete</button>
        </form>
      </div>
          `
      )
    }
  });
});

$('#exp-list').on('submit', '.delete-exp-form', function (e) {
  e.preventDefault();

  var confirmResponse = confirm('Are you sure?');
  if (confirmResponse) {
    var actionUrl = $(this).attr('action');
    $expToDelete = $(this).closest('.list-group-item');
    $.ajax({
      url: actionUrl,
      type: 'DELETE',
      expToDelete: $expToDelete,
      success: function (data) {
        this.expToDelete.remove();
      }
    })
  } else {
    $(this).find('button').blur();
  }
});

/* Education section  start */
/* Add New Education Start*/
$('#add-educ').submit(function (e) {
  e.preventDefault();
  var educ = $(this).serializeArray();
  $.post('/candidate-resume/education', educ, function (data) {
    var educTo = $.format.date(data.to, "dd MMM yyyy");
    var educFrom = $.format.date(data.from, "dd MMM yyyy");
    if (educTo) {
      educEnd = educTo
    } else {
      educEnd = data.current
    };
    $('#educ-list').prepend(
      `
      <li class="list-group-item mt-3">
      <form method="POST" action="/candidate-resume/education/${data._id}" class="edit-educ-form">
        <div class="form-group row">
          <div class="col-md-3">
            <input type="text" class="form-control border-op-8 border-grey" value="${data.school}" name="education[school]" required />
          </div>
          <div class="col-md-3">
            <input type="text" class="form-control border-op-8 border-grey" value="${data.degree}" name="education[degree]" required />
          </div>
          <div class="col-md-3">
            <input type="text" class="form-control border-op-8 border-grey" value="${data.fieldofstudy}" name="education[fieldofstudy]" />
          </div>
          <div class="col-md-3">
            <input type="text" class="form-control border-op-8 border-grey" value="${data.location}" name="education[location]" />
          </div>
        </div>
        <div class="form-group row">
          <div class="col-md-5">
            <h6>From Date</h6>
            <input type="date" class="form-control border-op-8 border-grey" name="education[from]" 
            />
          </div>
          <div class="col-md-7">
            <h6>To Date</h6>
            <div class="row">
              <div class="col-md-7 to-date-educ">
                <input type="date" class="form-control border-op-8 border-grey" name="education[to]" />
              </div>
              <div class="col-md-5 ">
                <div class="form-check mb-4 mr-sm-4 mb-sm-2 mt-2">
                  <input class="form-check-input educ-check" type="checkbox" name="education[current]" value="Till Now" id="current-educ-edit" />
                  <label class="form-check-label" for="current">Current Job</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-group row">
          <div class="col-md-12">
            <textarea class="form-control border-op-8 border-grey" name="education[description]">${data.description}</textarea>
          </div>
        </div>
        <input type="submit" value="Update" class="btn btn-info" />
      </form>
      <div class="row mr-0 ml-0 mt-2 mb-2 bg-op-1 bg-op-5 bg-gradient">
        <div class="col-sm-9 col-md-8 col-lg-8">
          <div class=" text-left pt-2 pb-2">
            <h5>${data.school}
              <span class="text-blue  "> - ${data.degree} - ${data.fieldofstudy} - ${data.location}</span>
            </h5>
          </div>
        </div>
        <div class="col-sm-3 col-md-4 col-lg-4">
          <div class="float-right pt-2 pb-2">
            <h6 class="text-green">${educFrom} - ${educEnd} </h6>
          </div>
        </div>
        <div class="col-md-12">
          <div class="text-grey-dark">
            <p>${data.description}</p>
          </div>
        </div>
      </div>
      <div class="" >
      <button type="button" class="btn btn-outline-primary btn-sm edit-educ-button">Edit</button>
      <form style="display: inline" method="POST" action="/candidate-resume/education/${data._id}" class="delete-educ-form">
        <button type="submit" class="btn btn-outline-danger btn-sm">Delete</button>
      </form>
    </div>
    </li>
    `
    )
    $('#add-educ').find('.form-control').val('');
    $('.educ-check').prop('checked', false);
    $(".educ-new-area").toggle();
  });
});

/* Add New Education End */

/* Edit Education Start */
$('#educ-list').on('click', '.edit-educ-button', function () {
  $(this).parent().siblings('.edit-educ-form').toggle();
});

$('#educ-list').on('submit', '.edit-educ-form', function (e) {
  e.preventDefault();
  var educ = $(this).serializeArray();
  var actionUrl = $(this).attr('action');
  var $originalItem = $(this).parent('.list-group-item');
  $.ajax({
    url: actionUrl,
    data: educ,
    type: 'PUT',
    originalItem: $originalItem,
    success: function (data) {
      var educTo = $.format.date(data.to, "dd MMM yyyy");
      var educFrom = $.format.date(data.from, "dd MMM yyyy");
      if (educTo) {
        educEnd = educTo
      } else {
        educEnd = data.current
      };
      this.originalItem.html(
        `
        <form method="POST" action="/candidate-resume/education/${data._id}" class="edit-educ-form">
        <div class="form-group row">
          <div class="col-md-3">
            <input type="text" class="form-control border-op-8 border-grey" value="${data.school}" name="education[school]" required />
          </div>
          <div class="col-md-3">
            <input type="text" class="form-control border-op-8 border-grey" value="${data.degree}" name="education[degree]" required />
          </div>
          <div class="col-md-3">
            <input type="text" class="form-control border-op-8 border-grey" value="${data.fieldofstudy}" name="education[fieldofstudy]" />
          </div>
          <div class="col-md-3">
            <input type="text" class="form-control border-op-8 border-grey" value="${data.location}" name="education[location]" />
          </div>
        </div>
        <div class="form-group row">
          <div class="col-md-5">
            <h6>From Date</h6>
            <input type="date" class="form-control border-op-8 border-grey" name="education[from]" 
            />
          </div>
          <div class="col-md-7">
            <h6>To Date</h6>
            <div class="row">
              <div class="col-md-7 to-date-educ">
                <input type="date" class="form-control border-op-8 border-grey" name="education[to]" />
              </div>
              <div class="col-md-5 ">
                <div class="form-check mb-4 mr-sm-4 mb-sm-2 mt-2">
                  <input class="form-check-input educ-check" type="checkbox" name="education[current]" value="Till Now" id="current-educ-edit" />
                  <label class="form-check-label" for="current">Current Job</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="form-group row">
          <div class="col-md-12">
            <textarea class="form-control border-op-8 border-grey" name="education[description]">${data.description}</textarea>
          </div>
        </div>
        <input type="submit" value="Update" class="btn btn-info" />
      </form>
      <div class="row mr-0 ml-0 mt-2 mb-2 bg-op-1 bg-op-5 bg-gradient">
        <div class="col-sm-9 col-md-8 col-lg-8">
          <div class=" text-left pt-2 pb-2">
            <h5>${data.school}
              <span class="text-blue  "> - ${data.degree} - ${data.fieldofstudy} - ${data.location}</span>
            </h5>
          </div>
        </div>
        <div class="col-sm-3 col-md-4 col-lg-4">
          <div class="float-right pt-2 pb-2">
            <h6 class="text-green">${educFrom} - ${educEnd} </h6>
          </div>
        </div>
        <div class="col-md-12">
          <div class="text-grey-dark">
            <p>${data.description}</p>
          </div>
        </div>
      </div>
      <div class="" >
      <button type="button" class="btn btn-outline-primary btn-sm edit-educ-button">Edit</button>
      <form style="display: inline" method="POST" action="/candidate-resume/education/${data._id}" class="delete-educ-form">
        <button type="submit" class="btn btn-outline-danger btn-sm">Delete</button>
      </form>
    </div>
          `
      )
    }
  });
});

/* Edit Education End */

/* Delete Education  Starat */
$('#educ-list').on('submit', '.delete-educ-form', function (e) {
  e.preventDefault();

  var confirmResponse = confirm('Are you sure?');
  if (confirmResponse) {
    var actionUrl = $(this).attr('action');
    $expToDelete = $(this).closest('.list-group-item');
    $.ajax({
      url: actionUrl,
      type: 'DELETE',
      expToDelete: $expToDelete,
      success: function (data) {
        this.expToDelete.remove();
      }
    })
  } else {
    $(this).find('button').blur();
  }
});
/* Delete Education End */

/* End of Education */

// Job Wanted Post request
$('#add-job-wanted').submit(function (e) {
  e.preventDefault();

  var jobWantedtItem = $(this).serializeArray();

  $.post('/job-wanted', jobWantedtItem, function (data) {

    $('#msgs').html(
      `<div class="alert alert-success" id="success-alert">
      <button type="button" class="close" data-dismiss="alert">x</button>
      <strong>Success! </strong>
       message.
  </div>`

    )
    $('#add-job-wanted').find('.form-control').val('');
    $(".new-job-wanted").toggle();
    $("#success-alert").fadeTo(2000, 5000).slideUp(1000, function () {
      $("#success-alert").alert('close');
    });
  });
});

/* Job Count Update*/
setInterval("jobCount();", 5000 * 5);
function jobCount() {
  $('#jobSearch').load(location.href + ' #jobCount');
};
