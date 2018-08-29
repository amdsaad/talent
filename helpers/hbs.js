const moment = require('moment');

module.exports = {
  truncate: function(text, len){
    if (text.length > len && text.length > 0) {
			var new_str = text + " ";
			new_str = text.substr(0, len);
			new_str = text.substr(0, new_str.lastIndexOf(" "));
			new_str = (new_str.length > 0) ? new_str : text.substr(0, len);
			return new_str + '...';
		}
		return text;
  },
  stripTags: function(input){
    return input.replace(/<(?:.|\n)*?>/gm, '');
  },
  formatDate: function(date, format){
    return moment(date).format(format);
  },
  select: function(selected, options){
    return options.fn(this).replace( new RegExp(' value=\"' + selected + '\"'), '$& selected="selected"').replace( new RegExp('>' + selected + '</option>'), ' selected="selected"$&');
  },
  editIcon: function(storyUser, loggedUser, storyId, floating = true){
    if(storyUser == loggedUser){
      if(floating){
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab red"><i class="fa fa-pencil"></i></a>`;
      } else {
        return `<a href="/stories/edit/${storyId}"><i class="fa fa-pencil"></i></a>`;
      }
    } else {
      return '';
    }
  }
}