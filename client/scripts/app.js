
$(document).ready(function(){
  getMessages();
  var search = location.search.substring(1);
  var URLparams = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');

  $('#submitChat').on('click', function(e){
    e.preventDefault();
    var chatMessage = $('#chatText').val();
    var newChatMessage = {
     'username': URLparams.username,
     'text': chatMessage,
     'roomname': 'lobby'
    };
    sendMessages(newChatMessage);
  });
});

var sendMessages = function(newChatMessage){
  console.log(newChatMessage);
  $.ajax({
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(newChatMessage),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

var getMessages = function(){
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
       addNewMessages(data.results);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

var addNewMessages = function(messages) {
  for (var i=0; i < messages.length; i++) {
    if (messages[i].text !== undefined) {
      if (messages[i].text[0] === "<") {
        continue;
      } else {
        $('#chat-box').append("<div class='chat-container'><p class='chat-user'>" + messages[i].username + " says:</p><p>"+ messages[i].text + "</p>" );
      }
    } else {
      continue;
    }
  }
};