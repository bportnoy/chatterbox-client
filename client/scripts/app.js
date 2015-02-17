// YOUR CODE HERE:

//get message function:
//get message from Parse
//escape message content
//display and append to body


var app = {
  server: 'https://api.parse.com/1/classes/chatterbox'
};

app.fetch = function(number){
    var options = {order:'-createdAt',limit:number,
    where: {roomname: app.settings.roomName}};
    $.ajax({
      // always use this url
      url: app.server,
      type: 'GET',
      //data: JSON.stringify(message),
      contentType: 'application/json',
      data: options,
      success: function (data) {
        app.addMessage(data.results);
        console.log(data);
      },
      error: function (data) {
        // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to receive message,trying again...');
        setTimeout(app.fetch,2000);
      }
    });
  };

app.addMessage = function(messages){
  console.log(messages);
  var $stream = $('#chats');

  _.each(messages,function(value){
    if (value.objectId !== app.settings.lastMessageReceived) {
      if (!value.username) value.username = "Anaughtymouse";
      var $message = $('<li><a href="#" class="userNameLink">' + validator.escape(value.username) +
        '</a>: "' +validator.escape(value.text)+'"</li>');
      if (app.settings.friends.indexOf(value.username) > -1) {
        $message.addClass('friend');
      }
      $stream.prepend($message);
      app.settings.lastMessageReceived = value.objectId;
    }
  });

  $('.userNameLink').on('click', function() {
    this.settings.friends.push($(this).text());
  });
  timerID = setTimeout(function(){app.fetch(1)},1000);
};

app.send = function(message){
  // var data = {
  //   username: this.settings.username,
  //   text: message,
  //   roomname: this.settings.roomName
  // };
  $.ajax({
    // always use this url
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
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

app.activateEncryption = function(passphrase){

  $('#encryption').removeClass('enc-off').addClass('enc-on');
};

app.settings = {
  friends: [],
  roomName: 'lobby',
  username: 'Anonymous',
  lastMessageReceived: null,
  timerID: null,
  encryption: false
};

app.clearMessages = function(){
  $('#chats').empty();
}

app.init = function(){
  this.settings = {
  friends: [],
  roomName: 'lobby',
  username: 'Anonymous',
  lastMessageReceived: null,
  timerID: null,
  encryption: false
  };

  var $send = $('#sendButton');
    var $box = $('#writeMessageBox');
    $send.on('click',function(){
      var input = $box.val();
      app.send({
        username: app.settings.username,
        text: input,
        roomname: app.settings.roomName
      });
      $box.val('');
    });

    $('#roomButton').on('click',function(){
      var $roomBox = $('#roomBox');
      var input = $roomBox.val();
      clearTimeout(timerID);
      input = validator.escape(input);
      app.settings.roomName = input;
      $('#roomName').text('Curent room: ' + app.settings.roomName);
      $('#chats').empty();
      app.clearMessages();
      app.fetch(10);
    });

    $('#encButton').on('click',function(){
      var $encBox = $('#encBox');
      var input = $encBox.val();
      this.activateEncryption(input);
      $encBox.val('');
    });

    var bar = window.location.search;
    app.settings.username = bar.slice(bar.indexOf("=")+1);
    $('#roomName').text('Current room: ' +app.settings.roomName);
    $('#encryption').text('off').addClass('enc-off');
    // console.log(this)
    app.fetch(10);
};

$(document).ready(app.init);



//function: escape message content
