var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update});

function preload() {

  game.load.image('background','assets/debug-grid-1920x1920.png');
  game.load.image('tootsieRoll', 'assets/tootsieRoll.png');
  game.load.image('spider', 'assets/spider-icon.png');

  game.load.tilemap('map', 'NSS.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tiles', 'simples_pimples.png');
  game.load.image('Steve', 'assets/Steve.png');
}

var player;
var platforms;
var cursors;

var tootsieRolls;
var spiders;
var score = 0;
var scoreText;
var healthText;

var layer1;
var layer2;

function create() {

  //  We're going to be using physics, so enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  //  Add json tilemap and create 3 layers 
  map = game.add.tilemap('map');
  map.addTilesetImage('NSS', 'tiles');


  layer1 = map.createLayer('backgroundLayer');
  layer2 = map.createLayer('blockedLayer');

  map.setCollisionByExclusion([], true, 'blockedLayer');

  layer1.resizeWorld();
  layer2.resizeWorld();

  // The player and its settings
  player = game.add.sprite(80, 600, 'Steve');

  //  We need to enable physics on the player
  game.physics.arcade.enable(player);

  //  Player physics properties. Give the little guy a slight bounce.
  // player.body.bounce.y = 0.2;
  // player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;

  // Give player health
  player.health = 3;



  // Make spiders

  spiders = game.add.group();
  spiders.enableBody = true;

  for (var i = 0; i < 20; i++)
  {
    var y = Math.random();
    var x = Math.random();

    var spider = spiders.create(game.world.randomX, game.world.randomY, 'spider');


    //  Let gravity do its thing
    // spider.body.gravity.y = 300;

    spider.body.collideWorldBounds = true;
  }






  //  Finally some tootsoeRolls to collect
  tootsieRolls = game.add.group();

  //  We will enable physics for any tootsieRoll that is created in this group
  tootsieRolls.enableBody = true;



  //  Here we'll create 12 of them evenly spaced apart
  for (var i = 0; i < 12; i++)
  {
    //  Create a star inside of the 'tootsieRolls' group
    var tootsieRoll = tootsieRolls.create(i * 70, 0, 'tootsieRoll');

    //  Let gravity do its thing
    tootsieRoll.body.gravity.y = 300;

    //  This just gives each tootsieRoll a slightly random bounce value
    tootsieRoll.body.bounce.y = 0.7 + Math.random() * 0.2;
  }

  //  The score
  scoreText = game.add.text(16, 16, 'Hacker Points: 0', { fontSize: '32px', fill: '#000' });

  // Health
  healthText = game.add.text(500, 16, 'Lives: 3', { fontSize: '32px', fill: '#992d2d' });
  healthText.fixedToCamera = true;
  scoreText.fixedToCamera = true; 

  //  Our controls.
  cursors = game.input.keyboard.createCursorKeys();

  // Camera view that follows player
  game.camera.follow(player);


  // Uncomment if Stretch to fill is preffered
  // game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

  // Maintain aspect ratio
  game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.input.onDown.add(gofull, this);
    
}

function update() {

  // Debug info
  game.debug.cameraInfo(game.camera, 32, 32);
  game.debug.spriteCoords(player, 32, 500);


  //  Collide the player and the tootsieRoll with the platforms
  game.physics.arcade.collide(tootsieRolls, layer2);    
  game.physics.arcade.collide(player, layer2);

  //  Checks to see if the player overlaps with any of the tootsieRolls, if he does call the collectTootsieRoll function
  game.physics.arcade.overlap(player, tootsieRolls, collectTootsieRoll, null, this);

  //  Reset the players velocity (movement)
  player.body.velocity.x = 0;
  player.body.velocity.y = 0;

  // Player spiders collision
  game.physics.arcade.overlap(player, spiders, spiderDamage, null, this);


  if (cursors.left.isDown)
  {
    //  Move to the left
    player.body.velocity.x = -150;

    player.animations.play('left');
  }
  else if (cursors.right.isDown)
  {
    //  Move to the right
    player.body.velocity.x = 150;

    player.animations.play('right');
  }
  else if (cursors.up.isDown)
  {
    player.body.velocity.y = -150;
  }
  else if (cursors.down.isDown)
  {
    player.body.velocity.y = 150;
  }
  else
  {
    //  Stand still
    player.animations.stop();

    player.frame = 4;
  }

  // Spider follow steve function
  spiders.forEach(followSteve, game.physics.arcade, false, 200);

}


function collectTootsieRoll (player, tootsieRoll) {
  
  // Removes the tootsieRoll from the screen
  tootsieRoll.kill();

  //  Add and update the score
  score += 10;
  scoreText.text = 'Hacker Points: ' + score;
}

function spiderDamage(player, spider){
  player.health -= 1;
  if (player.health <= 0) {
    player.kill();
    healthText.text = "Game Over";
  }
  spider.kill();
  healthText.text = "Lives: " + player.health;
}

function followSteve(spider){
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

  if (game.scale.isFullScreen)
  {
    game.scale.stopFullScreen();
  }
  else
  {
    game.scale.startFullScreen(false);
  }

}