var MIN_DELAY = 1500;
var MAX_DELAY = 5000;
var i = 0;
var j = 0;
var username;
var send = new Audio('media/send.m4a');
var receive = new Audio('media/receive.m4a');
send.preload, receive.preload = 'auto';
var poem, response;

function main() {

  $('#status-box').hide();
  $('#info-panel').addClass('hide');
  $('#name-box').focus();
  $('#welcome-panel').keyup(function(e) {
      if(e.which === 13){
        username = $('#name-box').val().toLowerCase();
        if(username.length < 8)
          poem[ 17 ].string = "\"welcome, " + username + "\"";
        $(this).addClass('hide');
        $("#status-box").show();
        $('#status-box').focus();
      }
    });

  $('input').on('keydown', function(e) {
   if (e.which === 13 && $('#welcome-panel').hasClass('hide')) {
       e.preventDefault();
       message();
   }
  });

  $(document).keyup(function(e) {
       if (e.keyCode == 27) {//escape key event
        $('#info-panel').toggleClass('hide');
        if($('#info-panel').hasClass('hide'))
          $('#status-box').focus();
        else {
          $('#status-box').blur();
        }
      }
  });
  $('#status-box').keyup(function() {
    var postLength = $(this).val().length; //do something with this later
  });
}

function message(){
  if(i < poem.length){
  $('<li id="right">').text(poem[ i ].string).prependTo('.posts');
  window.connect( i % 4 );
    if(poem[i].rp && j < response.length) { respond(); }
  }
  else{ //type what you want
    $('#status-box').addClass('live');
    $('<li id="right">').text($('#status-box').val()).prependTo('.posts');
    $('.posts').empty();
    window.slow = true;
  }
  send.play();
  $('#status-box').val('');
  console.log("i = ",i);
  i++;
}

function respond(){
  var say;
  var reply = response[ j ].string;
  var delay = reply.length * 30;
  if (delay > MAX_DELAY) delay = MAX_DELAY;
  else if(delay < MIN_DELAY) delay = MIN_DELAY;
  setTimeout(function(){
    //$('.typing').show();
    say = $('<li class="typer">').prependTo('.posts');
    $('#status-box').blur(); //wait for me to finish typing
  },1000);
  setTimeout(function() {
    //$('.typing').hide();
    window.create( j );
    say.text(reply).removeClass('typer').addClass('left');
    receive.play();
    $('#status-box').show().focus();
    console.log("j = ",j);
    if(!response[ j++ ].rp) //recurse the rant
      respond();
  },delay);
}
function hesitate() {
  var stall = $('<li class="typer">').prependTo('.posts');
  setTimeout(function() {
    $('.posts li').first().remove();
  },1000);

}
$(document).ready(main);
