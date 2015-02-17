// YOUR CODE HERE:

//get message function:
//get message from Parse
//escape message content
//display and append to body

var getMessages = function(number){
  var options = {order:'-createdAt',limit:number};
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
    if (!value.username) value.username = "Anaughtymouse";
    $stream.prepend('<li>' + validator.escape(value.username) + ': "' +validator.escape(value.text)+'"</li>');
  });
  setTimeout(function(){getMessages(1)},1000);
};

var displayOurMessage = function(text){
  var $stream = $('#stream');
  var text = validator.escape(text);
  $stream.append('<li>'+document.createTextNode(text).nodeValue+'</li>');
};

var postMessage = function(name,message,room){
  var data = {
    username: window.username,
    text: message,
    roomname: room
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

$(document).ready(function(){
  $send = $('#sendButton');
  $box = $('#writeMessageBox');
  $send.on('click',function(){
    var input = $box.val();
    // console.log('test');
    postMessage("testname",input,"lobby");
    $box.val('');
  });
  var bar = window.location.search;
  window.username = bar.slice(bar.indexOf("=")+1);
  window.roomName = 'lobby';
  $('#roomName').text('You are in the ' +roomName);
  getMessages(1);
});



//function: escape message content
