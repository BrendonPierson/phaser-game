$('#restart').click(function(){
  location.reload();
});

$('#scores').click(function(){
  var fb = new Firebase("https://spider-game.firebaseio.com/scores");
  fb.orderByChild("user").on("value", function(snapshot) {
    var data = snapshot.val();
    console.log("data", data);
    var scoresArr = [];
    for(obj in data){
      data[obj].score = Number(data[obj].score);
      scoresArr[scoresArr.length] = data[obj];
    }
    console.log("scoresArr", scoresArr);
    var sortedScores = _.chain(scoresArr).sortBy('score').value();
    console.log("sortedUniqueScores", sortedScores);
    var scoreObj = {
      scores: sortedScores.slice(0,10)
    };
    var source = $('#displayScores').html();
    var template = Handlebars.compile(source);
    var toDom = template(scoreObj);
    $('#toDom').append(toDom);
  });
});