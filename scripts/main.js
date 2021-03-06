var tootsieRollSpider = tootsieRollSpider || {};

tootsieRollSpider.game = new Phaser.Game(800, 600, Phaser.AUTO, '');

var gameWorld = [];
var gameState = { color: "", position: 0 };
//Declare all variables
var player;
var cursors;
var tootsieRolls;
var spiders;
var score = 0;
var scoreText;
var healthText;
var timerText = 0;
var gameover;
var layer1;
var layer2;
var goldenFan;
var time;
var winner;
var scoreSent = false;
var music;
var ouch;
var mmm;
var die;
var end;

var nBack_frames = 0;
var nBack_colors = 0;

tootsieRollSpider.game.state.add('Preload', tootsieRollSpider.Preload);
tootsieRollSpider.game.state.add('MainMenu', tootsieRollSpider.MainMenu);
tootsieRollSpider.game.state.add('Game', tootsieRollSpider.Game);
tootsieRollSpider.game.state.add('End', tootsieRollSpider.End);
tootsieRollSpider.game.state.add('Win', tootsieRollSpider.Win);

tootsieRollSpider.game.state.start('Preload');
