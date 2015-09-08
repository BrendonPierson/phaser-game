var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render});

function preload() {

  //Preload all assets
  game.load.image('background','assets/debug-grid-1920x1920.png');
  game.load.image('tootsieRoll', 'assets/tootsieRoll2.png');
  game.load.image('spider', 'assets/spider-icon.png');
  game.load.tilemap('map', 'NSS.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tiles', 'simples_pimples.png');
  game.load.image('Steve', 'assets/Steve.png');
  game.load.image('gameover', 'assets/Error1.png');
  game.load.image('goldenFan', 'assets/goldenFan.png');
  game.load.audio('Kashmir', 'assets/Kashmir.mp3');
  game.load.audio('ouch', 'assets/ouch.wav');
  game.load.audio('mmm', 'assets/mmm.mp3');
}

//Declare all variables
var player;
var cursors;
var tootsieRolls;
var spiders;
var score = 0;
var scoreText;
var healthText;
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

function create() {

  //  Enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  //  Add json tilemap and create 2 layers 
  map = game.add.tilemap('map');
  map.addTilesetImage('NSS', 'tiles');

  layer1 = map.createLayer('backgroundLayer');
  layer2 = map.createLayer('blockedLayer');

  //Set 'blackedLayer' so that player cannot pass through walls
  map.setCollisionByExclusion([], true, 'blockedLayer');

  layer1.resizeWorld();
  layer2.resizeWorld();

  // Load Steve and his starting position
  player = game.add.sprite(80, 600, 'Steve');

  //  We need to enable physics on the player
  game.physics.arcade.enable(player);

  //  Player physics properties. 
  player.body.collideWorldBounds = true;

  // Give player health
  player.health = 3;

  // Make spiders
  spiders = game.add.group();
  spiders.enableBody = true;

  for (var i = 0; i < 20; i++) {
    var y = Math.random();
    var x = Math.random();

    var spider = spiders.create(game.world.randomX, game.world.randomY, 'spider');

    spider.body.collideWorldBounds = true;
  }

  //  Add tootsieRolls to collect
  tootsieRolls = game.add.group();

  //  Enable physics for any tootsieRoll that is created in this group
  tootsieRolls.enableBody = true;

  //  Create 12 tootsieRolls
  for (var i = 0; i < 12; i++) {
    //  Random placement of tootsieRolls group
    var tootsieRoll = tootsieRolls.create(game.world.randomX, game.world.randomY, 'tootsieRoll');
    tootsieRoll.body.collideWorldBounds = true;
  }

  //  The score
  scoreText = game.add.text(16, 16, 'Hacker Points: 0', { fontSize: '32px', fill: '#000' });

  // Health
  healthText = game.add.text(500, 16, 'Lives: 3', { fontSize: '32px', fill: '#992d2d' });
  healthText.fixedToCamera = true;
  scoreText.fixedToCamera = true; 

  //  Our controls
  cursors = game.input.keyboard.createCursorKeys();

  // Camera view that follows player
  game.camera.follow(player);


  // Uncomment if Stretch to fill is prefered
  // game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

  // Maintain aspect ratio
  game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.input.onDown.add(gofull, this);

  music = game.add.audio('Kashmir');
  ouch = game.add.audio('ouch');
  mmm = game.add.audio('mmm');

  music.play();
    
}

function update() {

  // Debug info
  // game.debug.cameraInfo(game.camera, 32, 32);
  // game.debug.spriteCoords(player, 32, 500);


  //  Collide the player and the walls
  game.physics.arcade.collide(player, layer2);
  game.physics.arcade.collide(tootsieRolls, layer2);

  //  Checks to see if the player overlaps with any of the tootsieRolls, if he does call the collectTootsieRoll function
  game.physics.arcade.overlap(player, tootsieRolls, collectTootsieRoll, null, this);
  

  //  Reset the players velocity (movement)
  player.body.velocity.x = 0;
  player.body.velocity.y = 0;

  // Player spiders collision
  game.physics.arcade.overlap(player, spiders, spiderDamage, null, this);


  if (cursors.left.isDown) {
    //  Move to the left
    player.body.velocity.x = -150;
    player.animations.play('left');
  }
  else if (cursors.right.isDown) {
    //  Move to the right
    player.body.velocity.x = 150;
    player.animations.play('right');
  }
  else if (cursors.up.isDown) {
    player.body.velocity.y = -150;
  }
  else if (cursors.down.isDown) {
    player.body.velocity.y = 150;
  }
  else {
    //  Stand still
    player.animations.stop();
    player.frame = 4;
  }

  // Spider follow steve function
  spiders.forEach(followSteve, game.physics.arcade, false, 200);

  if(score >= 120){
    game.physics.arcade.overlap(player, winner, gameOver, null, this);
  }
}

function render() {
  game.debug.text('Elapsed seconds: ' + Math.floor(this.game.time.totalElapsedSeconds()), 200, 20);
}

function collectTootsieRoll (player, tootsieRoll) {
  mmm.play();
  // Removes the tootsieRoll from the screen
  tootsieRoll.kill();
  //  Add and update the score
  score += 10;
  scoreText.text = 'Hacker Points: ' + score;

  //SET UP IF CONDITION FOR WIN!
  if (score >= 120) {
    winner = this.game.add.sprite(425,450,"goldenFan");
    winner.anchor.setTo(0.5,0.5);
    game.physics.arcade.enable(winner);
    winner.enableBody = true;
  }
}

function spiderDamage(player, spider) {
  ouch.play();
  player.health -= 1;
  if (player.health <= 0) {
    player.kill();

    //Load gameover screen on player death
    var gameOverTitle = this.game.add.sprite(425,450,"gameover");
    gameOverTitle.anchor.setTo(0.5,0.5);
    //Temp reload page after 10 sec
    // setTimeout(function(){
    //     location.reload();
    // }, 10000);
  }
  spider.kill();
  healthText.text = "Lives: " + player.health;
}

function followSteve(spider) {
  if (player.body.x < spider.body.x){
    spider.body.velocity.x = -10;
  } else {
    spider.body.velocity.x = 10;
  }
  if (player.body.y < spider.body.y){
    spider.body.velocity.y = -10;
  } else {
    spider.body.velocity.y = 10;
  } 
}

function gofull() {

  if (game.scale.isFullScreen) {
    game.scale.stopFullScreen();
  }
  else {
    game.scale.startFullScreen(false);
  }
}

function gameOver() {
  if(!scoreSent){
    var ref = new Firebase("https://spider-game.firebaseio.com/scores");
    time = this.game.time.totalElapsedSeconds();
    userName = ref.getAuth().facebook.displayName;
    uid = ref.getAuth().uid;
    scores = [
      {
        user: userName,
        uId: uid,
        score: time,
      }
    ];
    console.log("scores", scores);
    ref.push(scores)
    scoreSent = true; 
  }
}