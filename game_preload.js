var tootsieRollSpider = tootsieRollSpider || {};

tootsieRollSpider.Preload = function() {};

tootsieRollSpider.Preload.prototype = {
  preload: function() {
  
        //Preload all assets
    this.load.image('background','assets/debug-grid-1920x1920.png');
    this.load.image('tootsieRoll', 'assets/tootsieRoll2.png');
    this.load.image('spider', 'assets/spider-icon.png');
    this.load.tilemap('map', 'NSS.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('tiles', 'simples_pimples.png');
    this.load.image('Steve', 'assets/Steve.png');
    this.load.image('gameover', 'assets/Error1.png');
    this.load.image('goldenFan', 'assets/goldenFan.png');
    this.load.image('play_button', 'assets/play_button.png');
    this.load.audio('Kashmir', 'assets/Kashmir.mp3');
    this.load.audio('ouch', 'assets/ouch.wav');
    this.load.audio('mmm', 'assets/mmm.mp3');
  },
  create: function() {
    this.state.start('MainMenu');
  }
};