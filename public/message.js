$('#message-list').on('click', '.read-message', function (e) {
  e.preventDefault();
  var msg = $(this).serializeArray();
  var marker = $(this).parent();
  marker.siblings().removeClass("active");
  marker.addClass("active");
  var actionUrl = $(this)[0].pathname;
  $.get(actionUrl, function (message) {
    var replies = message.replys;
    $('#message-area').html(
      `
      <small>From: ${message.userFrom.name}</small>
      <p>${message.body}</p>
      <br>
      <div id="replies">

      </div>
      <form action="/message-reply/${message._id}" method="POST" class="message-reply">
      <textarea name="replyBody" cols="30" rows="2" class = "w-100"></textarea>
      <input class= "btn btn-primary btn-sm" type="submit" value="Reply">
      </form>
      `
    )
    $.each(replies, function (i, val) {
      $('#replies').prepend('<li>' + val.replyBody + '</li>');
    });
  })
   $.ajax({
      url: actionUrl,
      data: msg,
      type: 'PUT',
      success: function (respondData) { }
    }) 
});

$('#message-area').on('submit', '.message-reply', function (e) {
  e.preventDefault();
  var reply = $(this).serializeArray();
  var actionUrl = $(this).attr('action');
  $.ajax({
    url: actionUrl,
    data: reply,
    type: 'POST',
    success: function (data) {
      console.log(data);
    }
  });
});

