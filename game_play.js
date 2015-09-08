var tootsieRollSpider = tootsieRollSpider || {};

tootsieRollSpider.Game = function() {};

tootsieRollSpider.Game.prototype = {
  create: function() {

    // Reset the timer that started when the menu displayed
    this.time.reset();


    //  Enable the Arcade Physics system
    this.physics.startSystem(Phaser.Physics.ARCADE);

    //  Add json tilemap and create 2 layers 
    map = this.add.tilemap('map');
    map.addTilesetImage('NSS', 'tiles');

    layer1 = map.createLayer('backgroundLayer');
    layer2 = map.createLayer('blockedLayer');

    //Set 'blackedLayer' so that player cannot pass through walls
    map.setCollisionByExclusion([], true, 'blockedLayer');

    layer1.resizeWorld();
    layer2.resizeWorld();

    // Load Steve and his starting position
    player = this.add.sprite(80, 600, 'Steve');

    //  We need to enable physics on the player
    this.physics.arcade.enable(player);

    //  Player physics properties. 
    player.body.collideWorldBounds = true;

    // Give player health
    player.health = 3;

    // Make spiders
    spiders = this.add.group();
    spiders.enableBody = true;

    for (var i = 0; i < 20; i++) {
      var y = Math.random();
      var x = Math.random();

      var spider = spiders.create(this.world.randomX, this.world.randomY, 'spider');

      spider.body.collideWorldBounds = true;
    }

    //  Add tootsieRolls to collect
    tootsieRolls = this.add.group();

    //  Enable physics for any tootsieRoll that is created in this group
    tootsieRolls.enableBody = true;

    //  Create 12 tootsieRolls
    for (var i = 0; i < 12; i++) {
      //  Random placement of tootsieRolls group
      var tootsieRoll = tootsieRolls.create(this.world.randomX, this.world.randomY, 'tootsieRoll');
      tootsieRoll.body.collideWorldBounds = true;
    }

    //  The score
    scoreText = this.add.text(16, 16, 'Hacker Points: 0', { fontSize: '32px', fill: '#FFF' });

    // Health and Timer Text
    healthText = this.add.text(600, 16, 'Lives: 3', { fontSize: '32px', fill: '#FFF' });
    timerText = this.add.text(400, 16, 'Time: 0 Seconds', { fontSize: '32px', fill: '#FFF' });
    healthText.fixedToCamera = true;
    scoreText.fixedToCamera = true; 
    timerText.fixedToCamera = true; 

    //  Our controls
    cursors = this.input.keyboard.createCursorKeys();

    // Camera view that follows player
    this.camera.follow(player);


    // Uncomment if Stretch to fill is prefered
    // this.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

    // Maintain aspect ratio
    this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.input.onDown.add(gofull, this);

    music = this.add.audio('Kashmir');
    ouch = this.add.audio('ouch');
    mmm = this.add.audio('mmm');

    music.play();
   
  },
  update: function() {

    updateTime();
    // Debug info
    // this.debug.cameraInfo(this.camera, 32, 32);
    // this.debug.spriteCoords(player, 32, 500);


    //  Collide the player and the walls
    this.physics.arcade.collide(player, layer2);
    this.physics.arcade.collide(tootsieRolls, layer2);

    //  Checks to see if the player overlaps with any of the tootsieRolls, if he does call the collectTootsieRoll function
    this.physics.arcade.overlap(player, tootsieRolls, collectTootsieRoll, null, this);
    

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    // Player spiders collision
    this.physics.arcade.overlap(player, spiders, spiderDamage, null, this);


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
    spiders.forEach(followSteve, this.physics.arcade, false, 200);

    if(score >= 120){
      this.physics.arcade.overlap(player, winner, gameOver, null, this);
    }
  },
    
};


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
    this.physics.arcade.enable(winner);
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

  if (this.scale.isFullScreen) {
    this.scale.stopFullScreen();
  }
  else {
    this.scale.startFullScreen(false);
  }
}

function updateTime(){
  timerText.text = "Time: " + Math.floor(this.Phaser.GAMES[0].time.totalElapsedSeconds()) + "s";
}

function gameOver() {
 if(!scoreSent){
   var ref = new Firebase("https://spider-game.firebaseio.com/scores");
   time = this.game.time.totalElapsedSeconds();
   userName = ref.getAuth().facebook.displayName;
   uid = ref.getAuth().uid;
   profPic = ref.getAuth().facebook.profileImageURL;
   scores = 
     {
       user: userName,
       uId: uid,
       score: time.toFixed(2),
       remainingLives: player.health,
       pic: profPic
     };
   console.log("scores", scores);
   ref.push(scores)
   scoreSent = true; 
 }
}