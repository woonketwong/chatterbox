
$(document).ready(function(){
  getMessages();
  var cycleNewMessages = setInterval(getMessages, 2000);

  var search = location.search.substring(1);
  var URLparams = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');

  $('#submitChat').on('click', function(e){
    e.preventDefault();
    var chatMessage = $('#chatText').val();
    $('#chatText').val("");
    var newChatMessage = {
     'username': URLparams.username,
     'text': chatMessage,
     'roomname': 'lobby'
    };
    sendMessages(newChatMessage);
  });
});

var lastRecordedTime = 0;

var sendMessages = function(newChatMessage){
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
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    data: {
      order: '-createdAt'
    },
    contentType: 'application/json',
//    data: encodeURI({where: {"created_at": {$gt: lastRecordedTime}}}),
    success: function (data) {
//      lastRecordedTime = data.results[data.results.length-1].createdAt;
      addNewMessages(data.results);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

var addNewMessages = function(messages) {
  $('.chat-container').remove();
  for (var i=messages.length-1; i >= 0; i--) {
    if (messages[i].text !== undefined) {
      if (messages[i].text[0] === "<") {
        continue;
      } else {
        var thisDate = convertTime(messages[i].createdAt);
        $('#chat-box').prepend("<div class='chat-container'><p class='chat-user'>On "+ thisDate + " " + messages[i].username + " says:</p><p>"+ messages[i].text + "</p>" );
      }
    } else {
      continue;
    }
  }
};

var convertTime = function(time) {
  thisDate = new Date(time);
  var month  = (thisDate.getMonth() + 1);
  var day = thisDate.getDate();
  var year = thisDate.getFullYear();
  var hour = thisDate.getHours();
  var amPm = (hour > 12) ? "PM" : "AM";
  if (hour !== 12) {
    hour = (hour > 12) ? hour-12 : hour;
  }
  var minutes = thisDate.getMinutes();

  minutes = ('0' + minutes).slice(-2);
  var seconds = thisDate.getSeconds();
  thisDate = day + " / " + month + " / " + year + " at " + hour + ":" + minutes + ":" + seconds + " " + amPm;
  return thisDate;
}