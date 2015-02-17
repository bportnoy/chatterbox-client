// YOUR CODE HERE:

//get message function:
//get message from Parse
//escape message content
//display and append to body


var main = function(){
  var getMessages = function(number){
      var options = {order:'-createdAt',limit:number, where: {roomname: settings.roomName}};
      $.ajax({
        // always use this url
        url: 'https://api.parse.com/1/classes/chatterbox',
        type: 'GET',
        //data: JSON.stringify(message),
        contentType: 'application/json',
        data: options,
        success: function (data) {
          displayMessages(data);
          console.log(data);
        },
        error: function (data) {
          // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to receive message,trying again...');
          setTimeout(getMessages,2000);
        }
      });
    };

  var displayMessages = function(data){
    var $stream = $('#stream');
    var messages = data.results;

    _.each(messages,function(value){
      if (value.objectId !== settings.lastMessageReceived) {
        if (!value.username) value.username = "Anaughtymouse";
        var $message = $('<li><a href="#" class="userNameLink">' + validator.escape(value.username) +
          '</a>: "' +validator.escape(value.text)+'"</li>');
        if (settings.friends.indexOf(value.username) > -1) {
          $message.addClass('friend');
        }
        $stream.prepend($message);
        settings.lastMessageReceived = value.objectId;
      }
    });

    $('.userNameLink').on('click', function() {
      settings.friends.push($(this).text());
    });
    timerID = setTimeout(function(){getMessages(1)},1000);
  };

  var postMessage = function(message){
    var data = {
      username: settings.username,
      text: message,
      roomname: settings.roomName
    };
    $.ajax({
      // always use this url
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(data),
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

  var activateEncryption = function(passphrase){

    $('#encryption').removeClass('enc-off').addClass('enc-on');
  };

  var settings = {
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
    postMessage(input);
    $box.val('');
  });

  $('#roomButton').on('click',function(){
    var $roomBox = $('#roomBox');
    var input = $roomBox.val();
    clearTimeout(timerID);
    input = validator.escape(input);
    settings.roomName = input;
    $('#roomName').text('Curent room: ' + settings.roomName);
    $('#stream').empty();
    $roomBox.val('');
    getMessages(10);
  });

  $('#encButton').on('click',function(){
    var $encBox = $('#encBox');
    var input = $encBox.val();
    activateEncryption(input);
    $encBox.val('');
  });

  var bar = window.location.search;
  settings.username = bar.slice(bar.indexOf("=")+1);
  $('#roomName').text('Current room: ' +settings.roomName);
  $('#encryption').text('off').addClass('enc-off');
  getMessages(10);



};

$(document).ready(main);



//function: escape message content
