$(document).ready(function() {
  getNewChats();
});

var getNewChats = function() {
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      writeNewChats(data);
    },
    error: function (data) {
      // see https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

var writeNewChats = function(chatData) {
  var messages = chatData.results;
  for (var i = 0; i < messages.length; i++){
    if (messages[i].text[0] === '<'){
      continue;
    } else {
      var chatString = "<li class='single-chat-box'>";
      chatString += "<p class='chatter-name'>" + messages[i].username + "</p>";
      chatString += "<p class='chat-time'>" + messages[i].createdAt + "</p>";
      chatString += "<p class='chat-message'>" + messages[i].text + "</p>";
      $('.chatBox > ul').append(chatString);
    }
  }
};


