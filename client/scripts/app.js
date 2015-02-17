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
          // console.log(data);
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
      if (!value.username) value.username = "Anaughtymouse";
      var $message = $('<li><a href="#" class="userNameLink">' + validator.escape(value.username) +
        '</a>: "' +validator.escape(value.text)+'"</li>');
      if (settings.friends.indexOf(value.username) > -1) {
        $message.addClass('friend');
      }
      $stream.prepend($message);
    });

    $('.userNameLink').on('click', function() {
      settings.friends.push($(this).text());
    });
    setTimeout(function(){getMessages(1)},1000);
  };

  var postMessage = function(name,message){
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

  var settings = {
  friends: [],
  roomName: 'lobby',
  username: 'Anonymous'
  };

  var $send = $('#sendButton');
  var $box = $('#writeMessageBox');
  $send.on('click',function(){
    var input = $box.val();
    postMessage("testname",input,"lobby");
    $box.val('');
  });

  $('#roomButton').on('click',function(){
    var $box = $('#roomBox');
    var input = $box.val();
    input = validator.escape(input);
    settings.roomName = input;
    postMessage("testname",input,"lobby");
    $('#roomName').text('You are in the ' +roomName);
    $('#stream').empty();
    $box.val('');
  });

      // settings.friends = [];
      var bar = window.location.search;
      settings.username = bar.slice(bar.indexOf("=")+1);
      $('#roomName').text('Current room: ' +settings.roomName);
      getMessages(1);
};

$(document).ready(main);



//function: escape message content
