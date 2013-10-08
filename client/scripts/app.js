var thisUser = {
  username: "",
  room: "lobby",
  friends: []
};

$(document).ready(function(){
  getUserName();
  getMessages();
//  var cycleNewMessages = setInterval(getMessages, 7000);

  $('#submitChat').on('click', function(e){
    e.preventDefault();
    var chatMessage = $('#chatText').val();
    $('#chatText').val("");
    var newChatMessage = {
     'username': thisUser.username,
     'text': chatMessage,
     'roomname': thisUser.room
    };
    sendMessages(newChatMessage);
  });

  $('.chat-box').on('click',function(e){
    e.preventDefault();
    console.log($(this));
  });

});

var getUserName = function() {
  var search = location.search.substring(1);
  var URLparams = JSON.parse('{"' + decodeURI(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g,'":"') + '"}');
  thisUser.username = URLparams.username;
  $('.userName').text(thisUser.username);
};

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
  $('.chat-container').remove();
  for (var i=messages.length-1; i >= 0; i--) {
    if (messages[i].text !== undefined) {
        var safeString = makeSafeString(messages[i].text);
        var thisDate = convertTime(messages[i].createdAt);
        $('#chat-box').prepend("<div class='chat-container'><p class='chat-user'>On "+ thisDate + " <a href='#' class='chatterName'>" + messages[i].username + "</a> says:</p><p>"+ safeString + "</p>" );
    } else {
      continue;
    }
  }
};

var makeSafeString = function(string) {
  var newSafeString = "";
  for (var i = 0; i < string.length; i++){
    if(string[i] === '&') {
      newSafeString += '&amp';
    } else if (string[i] === '<') {
      newSafeString += '&lt';
    } else if (string[i] === '>') {
      newSafeString += '&gt';
    } else if (string[i] === '"') {
      newSafeString += '&quot';
    } else if (string[i] === "'") {
      newSafeString += '&#x27';
    } else if (string[i] === '/') {
      newSafeString += '&#x2F';
    } else {
      newSafeString += string[i];
    }
  }
  return newSafeString;
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
