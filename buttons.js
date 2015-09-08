$('#restart').click(function(){
  location.reload();
});

$('#scores').click(function(){
  var fb = new Firebase("https://spider-game.firebaseio.com/scores");
  fb.orderByChild("user").on("value", function(snapshot) {
    var data = snapshot.val();
    var users = [];
    var scores = [];
    for (key in data) {
      users[users.length] = data[key].score;
      scores[scores.length] = data[key].user;
    }
    console.log(users);
    console.log(scores);
  });
});