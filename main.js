var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update});

function preload() {

  game.load.image('sky', 'assets/sky.png');
  game.load.image('background','assets/debug-grid-1920x1920.png');
  game.load.image('ground', 'assets/platform.png');
  game.load.image('star', 'assets/tootsieRoll.png');
  game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  game.load.image('spider', 'assets/spider-icon.png');

  game.load.tilemap('map', 'NSS.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tiles', 'simples_pimples.png');
  game.load.image('Steve', 'assets/Steve.png');
}

var player;
var platforms;
var cursors;

var stars;
var spiders;
var score = 0;
var scoreText;

var layer1;
var layer2;
var layer3;

function create() {

  //  We're going to be using physics, so enable the Arcade Physics system
  game.physics.startSystem(Phaser.Physics.ARCADE);

  //  A simple background for our game
  game.add.sprite(0, 0, 'sky');

  //  Add json tilemap and create 3 layers 
  map = game.add.tilemap('map');
  map.addTilesetImage('NSS', 'tiles');


  layer1 = map.createLayer('backgroundLayer');
  layer2 = map.createLayer('blockedLayer');
  layer3 = map.createLayer('objectsLayer');

  map.setCollisionByExclusion([], true, 'blockedLayer');

  layer1.resizeWorld();
  layer2.resizeWorld();
  // layer3.resizeWorld();

  // The player and its settings
  player = game.add.sprite(80, 600, 'Steve');

  //  We need to enable physics on the player
  game.physics.arcade.enable(player);

  //  Player physics properties. Give the little guy a slight bounce.
  // player.body.bounce.y = 0.2;
  // player.body.gravity.y = 300;
  player.body.collideWorldBounds = true;



  // Make spiders

  spiders = game.add.group();
  spiders.enableBody = true;

  for (var i = 0; i < 20; i++)
  {
    var y = Math.random();
    var x = Math.random();

    //  Create a star inside of the 'stars' group
    var spider = spiders.create(game.world.randomX, game.world.randomY, 'spider');


    //  Let gravity do its thing
    // spider.body.gravity.y = 300;

    //  This just gives each spider a slightly random bounce value
    // spider.body.bounce.y = 0.7 + Math.random() * 0.2;

    spider.body.collideWorldBounds = true;
  }






  //  Finally some stars to collect
  stars = game.add.group();

  //  We will enable physics for any star that is created in this group
  stars.enableBody = true;



  //  Here we'll create 12 of them evenly spaced apart
  for (var i = 0; i < 12; i++)
  {
    //  Create a star inside of the 'stars' group
    var star = stars.create(i * 70, 0, 'star');

    //  Let gravity do its thing
    star.body.gravity.y = 300;

    //  This just gives each star a slightly random bounce value
    star.body.bounce.y = 0.7 + Math.random() * 0.2;
  }

  //  The score
  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

  //  Our controls.
  cursors = game.input.keyboard.createCursorKeys();

  // Camera view that follows player
  game.camera.follow(player);
    
}

function update() {

  // Debug info
  game.debug.cameraInfo(game.camera, 32, 32);
  game.debug.spriteCoords(player, 32, 500);

  //  Collide the player and the stars with the platforms
  game.physics.arcade.collide(stars, layer2);
  game.physics.arcade.collide(player, spiders);
  game.physics.arcade.collide(spiders, player);    
  game.physics.arcade.collide(spiders, layer2);    
  game.physics.arcade.collide(player, layer2);

  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  game.physics.arcade.overlap(player, stars, collectStar, null, this);

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

function collectStar (player, star) {
  
  // Removes the star from the screen
  star.kill();

  //  Add and update the score
  score += 10;
  scoreText.text = 'Score: ' + score;

}

function spiderDamage(player, spider){
  spider.kill();
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