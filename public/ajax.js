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
      if (data.published == 'false') {
        this.originalItem.html(
          `
          <p>Your resume is not yet <span class="text-warning">Published</span> , please published your resume once it is complated</p>
          <form method="post" action="/candidate-resume/${data._id}" class="published-resume-form">
            <input type="hidden" name="resume[published]" value="true">
            <input type="submit" value="Publish" class="btn btn-primary w-100" />
          </form>      
        `
        )
      } else {
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
/* Edit Resume Pic */

$('#edit-basic-pic-resume').on('click', '.edit-basic-pic-btn', function () {
  $("#basic-info-resume-pic-edit").toggle();
  $('#basic-info-resume-pic-area').toggle();
});
$('#edit-basic-pic-resume').on('click', '.cxl-pic-resume', function () {
  $("#basic-info-resume-pic-edit").toggle();
  $('#basic-info-resume-pic-area').toggle();
});


$('#edit-basic-pic-resume').on('submit', '.basic-info-resume-pic-form', function (e) {
  e.preventDefault();
  var pic = new FormData(this);
  console.log(pic)
  var actionUrl = $(this).attr('action');
  var $originalItem = $(this).parent('.list-group-item');
  $.ajax({
    url: actionUrl,
    data: pic,
    type: 'PUT',
    processData: false,
    contentType: false,
    originalItem: $originalItem,
    success: function (data) {
      $('#edit-basic-pic-resume').html(
        `
        <li class="list-group-item bg-warning bg-op-7" id="basic-info-resume-pic-edit">
        <form method="post" action="/candidate-resume/${data._id}" class="basic-info-resume-pic-form p-2" enctype="multipart/form-data">
          <div class="form-group text-center mt-2">
            <input type="file" name="picture" id="">
          </div>
          <input type="submit" value="Upload" class="btn btn-success" />
          <input type="button" value="Cancel" class="btn btn-secondary cxl-pic-resume" />
        </form>
      </li>
      <li class="list-group-item" id="basic-info-resume-pic-area">
        <div class="text-grey-dark">
          <img src="${data.pictureUrl}" alt="">
        </div>
        <button class="btn btn-outline-primary edit-basic-pic-btn">Edit</button>
      </li>
        `
      )
      $('#resume-messages').html(
        `
        <div class="alert alert-success"> <i class="fas fa-check"></i>  Your photo has been updated</div>
        `
      )
      $(".alert").fadeTo(800, 800).slideUp(800, function () {
        $(".alert").alert('close');
      });
    }
  });
});

/* Resume ic End */
/* Edit Basic Resume ( About) Start */
$('#edit-basic-about-resume').on('click', '.edit-basic-about-btn', function () {
  $("#basic-info-resume-about-area").toggle();
  $('#basic-info-resume-about-edit').toggle();
});

$('#edit-basic-about-resume').on('click', '.cxl-about-resume', function () {
  $("#basic-info-resume-about-area").toggle();
  $('#basic-info-resume-about-edit').toggle();
});
$('#edit-basic-about-resume').on('submit', '.basic-info-resume-about-form', function (e) {
  e.preventDefault();
  var basicInfo = $(this).serializeArray();
  var actionUrl = $(this).attr('action');
  var $originalItem = $(this).parent('.list-group-item');
  $.ajax({
    url: actionUrl,
    data: basicInfo,
    type: 'PUT',
    success: function (data) {
      $('#edit-basic-about-resume').html(
        `
        <li class="list-group-item bg-warning bg-op-7" id="basic-info-resume-about-edit">
        <form method="post" action="/candidate-resume/${data._id}" class="basic-info-resume-about-form p-2">
          <h4 class="text-blue-dark display-4" id="resume-heading">About</h4>
          <div class="under-heading text-blue"></div>
          <div class="form-group text-center mt-2">
            <textarea class="w-100" name="resume[bio]" rows="5">${data.bio}</textarea>
          </div>
          <input type="submit" value="Save" class="btn btn-success" />
          <input type="button" value="Cancel" class="btn btn-secondary cxl-about-resume" />
        </form>
      </li>
      <li class="list-group-item" id="basic-info-resume-about-area">
        <div class="text-grey-dark mt-3">
          <h4 class="text-blue-dark display-4" id="resume-heading">About</h4>
          <div class="under-heading text-blue"></div>
          <p>${data.bio}</p>
        </div>
        <button class="btn btn-outline-primary edit-basic-about-btn">Edit</button>
      </li>
        `
      )
      $('#resume-about-messages').html(
        `
        <div class="alert alert-success"> <i class="fas fa-check"></i>  Your Info has been updated</div>
        `
      )
      $(".alert").fadeTo(800, 800).slideUp(800, function () {
        $(".alert").alert('close');
      });
    }
  });
});

/* Edit Basic Resume ( About) End */


/* Edit Resume Basic Info */

$('#edit-basic-resume').on('click', '.edit-basic-btn', function () {
  $("#basic-info-resume-area").toggle();
  $('#basic-info-resume-area-edit').toggle();
});

$('#edit-basic-resume').on('click', '.cxl-basic-resume-info', function () {
  $("#basic-info-resume-area").toggle();
  $('#basic-info-resume-area-edit').toggle();
});

$('#edit-basic-resume').on('submit', '.basic-info-resume-form', function (e) {
  e.preventDefault();
  var basicInfo = $(this).serializeArray();
  var actionUrl = $(this).attr('action');
  var $originalItem = $(this).parent('.list-group-item');
  $.ajax({
    url: actionUrl,
    data: basicInfo,
    type: 'PUT',
    success: function (data) {
      $('#edit-basic-resume').html(
        `
        <li class="list-group-item bg-light" id="basic-info-resume-area-edit">
        <form method="post" action="/candidate-resume/${data._id}" class="basic-info-resume-form p-2">
          <div class="form-group text-center">
            <input class="border-op-8 border-grey display-4" type="text" name="resume[fullName]" value="${data.fullName}">
          </div>
          <div class="form-group text-center">
            <input class="border-op-8 border-grey display-4 text-muted" type="text" name="resume[jobTitle]" value="${data.jobTitle}">
          </div>
          <div class="form-group row text-center">
            <div class="col-md-4">
              <i class="fas fa-map-marker-alt text-muted mr-2"></i>
              <input class="border-op-8 border-grey text-muted" type="text" name="resume[location]" value="${data.location}">
            </div>
            <div class="col-md-4">
              <i class="fas fa-phone-square text-muted mr-2"></i>
              <input class="border-op-8 border-grey text-muted" type="text" name="resume[contactNumber]" value="${data.contactNumber}">
            </div>
            <div class="col-md-4">
              <i class="fas fa-at text-muted mr-2"></i>
              <input class="border-op-8 border-grey text-muted" type="text" name="resume[email]" value="${data.email}">
            </div>
          </div>
          <input type="submit" value="Save" class="btn btn-success" />
          <input type="button" value="Cancel" class="btn btn-warning cxl-basic-resume-info" />
        </form>
        </li>
        <li class="list-group-item" id="basic-info-resume-area">
        <div class="resume-title mb-3">
        <div class="pt-5 text-center rounded-bottom">
          <h3 class="display-3 text-dark mb-2">
            <strong>${data.fullName}</strong>
          </h3>
          <h6 class="display-4 text-muted">${data.jobTitle}</h6>
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <i class="fas fa-map-marker-alt text-muted"></i>
        <p class="ml-1 text-muted">${data.location}</p>
        <i class="fas fa-phone-square text-muted ml-3"></i>
        <p class="ml-1 text-muted">${data.contactNumber}</p>
        <i class="fas fa-at text-muted ml-3"></i>
        <p class="ml-1 text-muted">${data.email}</p>
      </div>
      <button style="margin-top: -5rem;" class="btn btn-outline-primary edit-basic-btn">Edit</button>
      </li>
        `
      )
    }
  });
});

/* Resume Default Style Edit Start */
$('#edit-resume-template').on('submit', '.style-resume-form', function (e) {
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
      window.location.reload(true)
    }
  });
});
/* Resume Default Style Edit End */

/* Experiance section  start */

$('#exp-list').on('click', '.exp-cxl-edit-btn', function () {
  $(".edit-exp-form").hide();
});

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
    $('#exp-list').prepend(
      `
      <li class="list-group-item">
      <div class="row m-2">
        <div class="col-sm-9 col-md-8 col-lg-8">
          <div class=" text-left pt-2 pb-2">
            <h5>${data.title} @
              <span class="text-blue  ">${data.company} - ${data.location}</span>
            </h5>
          </div>
        </div>
        <div class="col-sm-3 col-md-4 col-lg-4">
          <div class="float-right pt-2 pb-2">
            <h6 class="text-green">${expFrom} - ${expEnd}</h6>
          </div>
        </div>
        <div class="col-md-12">
          <div class="text-grey-dark">
            <p>${data.description}</p>
          </div>
        </div>
      </div>
      <div class="m-4">
        <button type="button" class="btn btn-outline-primary btn-sm edit-button">Edit</button>
        <form style="display: inline" method="POST" action="/candidate-resume/experience/${data._id}" class="delete-exp-form">
          <button type="submit" class="btn btn-outline-danger btn-sm">Delete</button>
        </form>
      </div>
      <form method="POST" action="/candidate-resume/experience/${data._id}" class="edit-exp-form p-4 bg-op-5 bg-lime rounded m-2">
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
            <input type="date" class="form-control border-op-8 border-grey" name="exper[from]" />
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
            <textarea class="form-control border-op-8 border-grey" name="exper[description]">$${data.description}</textarea>
          </div>
        </div>
        <input type="submit" value="Update" class="btn btn-success" />
        <input type="button" value="cancel" class="btn btn-warning exp-cxl-edit-btn" />
      </form>
    </li>
    `
    )
    $('#exp-msg').html(
      `
      <div class="alert alert-success float-right w-25"> <i class="fas fa-check"></i>  Success! Experience Added</div>
      `
    )
    $(".alert").fadeTo(800, 800).slideUp(800, function () {
      $(".alert").alert('close');
    });
    $('#add-exp').find('.form-control').val('');
    $('#add-exp').find('.form-check-input').prop("checked", false);
    $(".exp-new-area").toggle();
  });
});

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
        <div class="row m-2">
        <div class="col-sm-9 col-md-8 col-lg-8">
          <div class=" text-left pt-2 pb-2">
            <h5>${data.title} @
              <span class="text-blue  ">${data.company} - ${data.location}</span>
            </h5>
          </div>
        </div>
        <div class="col-sm-3 col-md-4 col-lg-4">
          <div class="float-right pt-2 pb-2">
            <h6 class="text-green">${expFrom} - ${expEnd}</h6>
          </div>
        </div>
        <div class="col-md-12">
          <div class="text-grey-dark">
            <p>${data.description}</p>
          </div>
        </div>
      </div>
      <div class="m-4">
        <button type="button" class="btn btn-outline-primary btn-sm edit-button">Edit</button>
        <form style="display: inline" method="POST" action="/candidate-resume/experience/${data._id}" class="delete-exp-form">
          <button type="submit" class="btn btn-outline-danger btn-sm">Delete</button>
        </form>
      </div>
      <form method="POST" action="/candidate-resume/experience/${data._id}" class="edit-exp-form p-4 bg-op-5 bg-lime rounded m-2">
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
            <input type="date" class="form-control border-op-8 border-grey" name="exper[from]" />
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
        <input type="submit" value="Update" class="btn btn-success" />
        <input type="button" value="cancel" class="btn btn-warning exp-cxl-edit-btn" />
      </form>
        `

      )
      $('#exp-msg').html(
        `
        <div class="alert alert-success float-right w-25"> <i class="fas fa-check"></i>  Success! Experience Updated</div>
        `
      )
      $(".alert").fadeTo(800, 800).slideUp(800, function () {
        $(".alert").alert('close');
      });
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
/* Experiance section  End */

/* Education section  start */
$('#educ-list').on('click', '.educ-cxl-edit-btn', function () {
  $(".edit-educ-form").hide();
});

$('#educ-list').on('click', '.edit-educ-button', function () {
  $(this).parent().siblings('.edit-educ-form').toggle();
});

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
      <li class="list-group-item">
      <div class="row m-2">
        <div class="col-sm-9 col-md-8 col-lg-8">
          <div class=" text-left pt-2 pb-2">
            <h5>${data.school}-
              <span class="text-blue"> ${data.degree} Degree - ${data.fieldofstudy} - ${data.location}</span>
            </h5>
          </div>
        </div>
        <div class="col-sm-3 col-md-4 col-lg-4">
          <div class="float-right pt-2 pb-2">
            <h6 class="text-green">${educFrom} - ${educEnd}</h6>
          </div>
        </div>
        <div class="col-md-12">
          <div class="text-grey-dark">
            <p>${data.description}</p>
          </div>
        </div>
      </div>
      <div class="m-4">
        <button type="button" class="btn btn-outline-primary btn-sm edit-educ-button">Edit</button>
        <form style="display: inline" method="POST" action="/candidate-resume/education/${data._id}" class="delete-educ-form">
          <button type="submit" class="btn btn-outline-danger btn-sm">Delete</button>
        </form>
      </div>
      <form method="POST" action="/candidate-resume/education/${data._id}" class="edit-educ-form p-4 bg-op-5 bg-lime rounded m-2">
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
          <input type="date" class="form-control border-op-8 border-grey" name="education[from]" />
        </div>
        <div class="col-md-7">
          <h6>To Date</h6>
          <div class="row">
            <div class="col-md-7 to-date-exp">
              <input type="date" class="form-control border-op-8 border-grey" name="education[to]" />
            </div>
            <div class="col-md-5 ">
              <div class="form-check mb-4 mr-sm-4 mb-sm-2 mt-2">
                <input class="form-check-input" type="checkbox" name="education[current]" value="Till Now" id="current-educ" />
                <label class="form-check-label" for="current">Current Study</label>
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
      <input type="submit" value="Update" class="btn btn-success" />
      <input type="button" value="cancel" class="btn btn-warning educ-cxl-edit-btn" />
    </form>
    </li>
    `
    )
    $('#educ-msg').html(
      `
      <div class="alert alert-success float-right w-25"> <i class="fas fa-check"></i>  Success! Education Added</div>
      `
    )
    $(".alert").fadeTo(800, 800).slideUp(800, function () {
      $(".alert").alert('close');
    });
    $('#add-educ').find('.form-control').val('');
    $('#add-educ').find('.form-check-input').prop("checked", false);
    $(".educ-new-area").toggle();
  });
});

$('#educ-list').on('submit', '.edit-educ-form', function (e) {
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
      var educTo = $.format.date(data.to, "dd MMM yyyy");
      var educFrom = $.format.date(data.from, "dd MMM yyyy");
      if (educTo) {
        educEnd = educTo
      } else {
        educEnd = data.current
      };
      this.originalItem.html(
        `
      <div class="row m-2">
        <div class="col-sm-9 col-md-8 col-lg-8">
          <div class=" text-left pt-2 pb-2">
            <h5>${data.school}-
              <span class="text-blue"> ${data.degree} Degree - ${data.fieldofstudy} - ${data.location}</span>
            </h5>
          </div>
        </div>
        <div class="col-sm-3 col-md-4 col-lg-4">
          <div class="float-right pt-2 pb-2">
            <h6 class="text-green">${educFrom} - ${educEnd}</h6>
          </div>
        </div>
        <div class="col-md-12">
          <div class="text-grey-dark">
            <p>${data.description}</p>
          </div>
        </div>
      </div>
      <div class="m-4">
        <button type="button" class="btn btn-outline-primary btn-sm edit-educ-button">Edit</button>
        <form style="display: inline" method="POST" action="/candidate-resume/education/${data._id}" class="delete-educ-form">
          <button type="submit" class="btn btn-outline-danger btn-sm">Delete</button>
        </form>
      </div>
      <form method="POST" action="/candidate-resume/education/${data._id}" class="edit-educ-form p-4 bg-op-5 bg-lime rounded m-2">
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
          <input type="date" class="form-control border-op-8 border-grey" name="education[from]" />
        </div>
        <div class="col-md-7">
          <h6>To Date</h6>
          <div class="row">
            <div class="col-md-7 to-date-exp">
              <input type="date" class="form-control border-op-8 border-grey" name="education[to]" />
            </div>
            <div class="col-md-5 ">
              <div class="form-check mb-4 mr-sm-4 mb-sm-2 mt-2">
                <input class="form-check-input" type="checkbox" name="education[current]" value="Till Now" id="current-educ" />
                <label class="form-check-label" for="current">Current Study</label>
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
      <input type="submit" value="Update" class="btn btn-success" />
      <input type="button" value="cancel" class="btn btn-warning educ-cxl-edit-btn" />
    </form>
          `
      )
      $('#educ-msg').html(
        `
        <div class="alert alert-success float-right w-25"> <i class="fas fa-check"></i>  Success! Education Updated</div>
        `
      )
      $(".alert").fadeTo(800, 800).slideUp(800, function () {
        $(".alert").alert('close');
      });
    }
  });
});

$('#educ-list').on('submit', '.delete-educ-form', function (e) {
  e.preventDefault();

  var confirmResponse = confirm('Are you sure?');
  if (confirmResponse) {
    var actionUrl = $(this).attr('action');
    $educToDelete = $(this).closest('.list-group-item');
    $.ajax({
      url: actionUrl,
      type: 'DELETE',
      educToDelete: $educToDelete,
      success: function (data) {
        this.educToDelete.remove();
      }
    })
  } else {
    $(this).find('button').blur();
  }
});
/* End of Education */

$('#job-wanted-list').on('click', '.job-wanted-btn', function () {
  $(this).parent().siblings('.add-job-wanted').toggle();
});
// Job Wanted Post request
$('#job-wanted-list').on('submit', '.add-job-wanted', function (e) {
  e.preventDefault();

  var jobWantedtItem = $(this).serializeArray();
  $.post('/job-wanted', jobWantedtItem, function (data) {
    if (data.msg) {
      $('#msgs').html(
        `<div class="alert alert-danger" id="danger-alert">
        <button type="button" class="close" data-dismiss="alert">x</button>
        <strong>${data.msg}</strong>
    </div>`

      )
      $('.add-job-wanted').find('.form-control').val('');
      $(".add-job-wanted").toggle();
      $("#danger-alert").fadeTo(2000, 5000).slideUp(1000, function () {
        $("#danger-alert").alert('close');
      });
    } else {
      $('#msgs').html(
        `<div class="alert alert-success" id="success-alert">
        <button type="button" class="close" data-dismiss="alert">x</button>
        <strong>Success! </strong>
         message.
    </div>`

      )
      $('.add-job-wanted').find('.form-control').val('');
      $(".add-job-wanted").hide();
      $("#success-alert").fadeTo(2000, 5000).slideUp(1000, function () {
        $("#success-alert").alert('close');
      });
    }
  });
});

$('#job-cont-sidebar').on('submit', '.application-form', function (e) {
  e.preventDefault();
  var application = $(this).serializeArray();
  var actionUrl = $(this).attr('action');
  $.ajax({
    url: actionUrl,
    data: application,
    type: 'POST',
    success: function (data) {
      $('#application-area').html(
        `<div class="alert alert-success" id="success-alert">
        <button type="button" class="close" data-dismiss="alert">x</button>
        <strong>Success! </strong>
         Your application sent to the epmloyer.
    </div>`
      )
    }
  });
});

$('#job-cont-main').on('submit', '.save-job-form', function (e) {
  e.preventDefault();
  var savedJob = $(this).serializeArray();
  var actionUrl = $(this).attr('action');

  $.ajax({
    url: actionUrl,
    data: savedJob,
    type: 'POST',
    success: function (data) {
      if (data.msg) {
        $('.fav-job').html(
          `<div class="alert alert-danger" id="danger-alert">
          <button type="button" class="close" data-dismiss="alert">x</button>
          <strong>${data.msg}</strong>
           </div>
            <form action="/jobs/${data.jobHandle}/saved-jobs" method="post" class="save-job-form float-right">
            <button type="submit" id="save-job" class="fabutton">
           <i class="fa fa-heart text-muted"></i>
            </button>
          </form>      
      `
        )
      } else {
        $('.fav-job').html(
          `<div class="alert alert-success" id="success-alert">
          <button type="button" class="close" data-dismiss="alert">x</button>
          <strong>Success! : Job Add to favorites</strong>
           </div>
            <form action="/jobs/${data.jobHandle}/saved-jobs/${data._id}" method="post" class="edit-save-job-form float-right">
            <button type="submit" id="edit-save-job" class="fabutton">
           <i class="fa fa-heart text-danger"></i>
            </button>
          </form>      
      `)
        $("#success-alert").fadeTo(2000, 5000).slideUp(1000, function () {
          $("#success-alert").alert('close');
        });
      }
    }
  })
});

$('#job-cont-main').on('submit', '.edit-save-job-form', function (e) {
  e.preventDefault();
  var savedJob = $(this).serializeArray();
  var actionUrl = $(this).attr('action');

  $.ajax({
    url: actionUrl,
    data: savedJob,
    type: 'DELETE',
    success: function (data) {
      $('.fav-job').html(
        `<div class="alert alert-success" id="success-alert">
          <button type="button" class="close" data-dismiss="alert">x</button>
          <strong>Success! : Job removed from favorites</strong>
           </div>
            <form action="/jobs/${data.jobHandle}/saved-jobs" method="post" class="save-job-form float-right">
            <button type="submit" id="save-job" class="fabutton">
           <i class="fa fa-heart text-muted"></i>
            </button>
          </form>      
      `)
      $("#success-alert").fadeTo(2000, 5000).slideUp(1000, function () {
        $("#success-alert").alert('close');
      });
    }
  })
});

//appliation comment
$('#page-applications').on('submit', '.application-comment-form', function (e) {
  e.preventDefault();
  var application = $(this).serializeArray();
  var actionUrl = $(this).attr('action');
  var $originalItem = $(this).parent('.application-comments');
  $.ajax({
    url: actionUrl,
    data: application,
    type: 'POST',
    originalItem: $originalItem,
    success: function (data) {
      var commnetDate = $.format.date(data.comments[0].commentDate, "dd MMM yyyy");
      this.originalItem.prepend(`
      <li class="media mb-3 pos-relative">
      <div class="media-body">
        <ul class="list-inline blog-meta text-muted">
          <li class="list-inline-item">
            <i class="fa fa-calendar"></i> ${commnetDate}</li>
        </ul>
        <p class="mb-1">${data.comments[0].commentBody}</p>
      </div>
    </li>
      `
      )
      $('.application-comment-form').find('.form-control').val('');


    }
  });
});

//appliation status
$('#page-applications').on('submit', '.application-shorlist-form', function (e) {
  e.preventDefault();
  var application = $(this).serializeArray();
  var actionUrl = $(this).attr('action');
  var $originalItem = $(this).parent('.application-stat');
  $.ajax({
    url: actionUrl,
    data: application,
    type: 'PUT',
    originalItem: $originalItem,
    success: function (data) {
      if (data.status === "shortlisted") {
        this.originalItem.html(
          `
          <div class="alert alert-success"> <i class="fas fa-check"></i>  Success! Application Status Updated</div>
          <form action="/jobs/application/${data._id}" class="d-inline-block application-shorlist-form" method="post" enctype="multipart/form-data">
          <input type="hidden" name="status" value="sent">
          <button type="submit" class="btn btn-outline-primary d-inline-block" id="application-shortlist">
            <i class="em em-heart mr-2"></i>Shortlisted</button>
        </form>        
          `
        )
        $(".alert").fadeTo(800, 800).slideUp(800, function () {
          $(".alert").alert('close');
        });

      } else if (data.status === "sent") {
        this.originalItem.html(
          `
          <div class="alert alert-success"> <i class="fas fa-check"></i>  Success! Application Status Updated</div>
          <form action="/jobs/application/${data._id}" class="d-inline-block application-shorlist-form" method="post" enctype="multipart/form-data">
          <input type="hidden" name="status" value="shortlisted">
          <button type="submit" class="btn btn-outline-primary d-inline-block" id="application-shortlist">
            <i class="em em-yellow_heart mr-2"></i>Shortlist</button>
        </form>        
          `
        )
        $(".alert").fadeTo(800, 800).slideUp(800, function () {
          $(".alert").alert('close');
        });
      }

    }
  });
});