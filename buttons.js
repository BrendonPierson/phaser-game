var sortedScores =[];
var fb = new Firebase("https://spider-game.firebaseio.com/scores");
fb.orderByChild("user").on("value", function(snapshot) {
  var data = snapshot.val();
  var scoresArr = [];
  var userScores = [];
  for(obj in data){
    data[obj].score = Number(data[obj].score);
    scoresArr[scoresArr.length] = data[obj];
  }
  sortedScores = _.chain(scoresArr).sortBy('score').value();
  var scoreObj = {
    scores: sortedScores.slice(0,10)
  };
  var source = $('#displayScores').html();
  var template = Handlebars.compile(source);
  var toDom = template(scoreObj);
  $('#toDom').html(toDom);

userStats();
});
  
$('#restart').click(function(){
  location.reload();
});

$('#scores').click(function(){
    $('#toDom').slideToggle('slow');
});

$('#stats').click(function(){
    $('#userStats').slideToggle('slow');
});



function userStats(){
  var ref = new Firebase("https://spider-game.firebaseio.com/");
  userScores = _.chain(sortedScores).filter(function(obj){return obj.uId === ref.getAuth().uid}).value();
  console.log("userScores", userScores);

  var totalScore = 0;
  for(var i = 0; i < userScores.length; i++){
    totalScore += userScores[i].score;
  }
  console.log("totalScore", totalScore);
  var averageUserScore = totalScore/ userScores.length;
  console.log("avg", averageUserScore.toFixed(2));
  $("#userStats").html("<h2>Average time for " + ref.getAuth().facebook.displayName + " is: " + averageUserScore.toFixed(2));
}