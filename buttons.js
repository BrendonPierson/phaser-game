$('#restart').click(function(){
  location.reload();
});

$('#scores').click(function(){
  var fb = new Firebase("https://spider-game.firebaseio.com/scores");
  fb.orderByChild("user").on("value", function(snapshot) {
    var data = snapshot.val();
    var scoreObj = {
      scores: data
    };
    var source = $('#displayScores').html();
    var template = Handlebars.compile(source);
    var toDom = template(scoreObj);
    $('#toDom').append(toDom);
  });
});