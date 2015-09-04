window.onload = function() {

    var game = new Phaser.Game(1200, 800, Phaser.AUTO, '', { preload: preload, create: create });

    function preload () {
        this.load.tilemap('map', 'NSS.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('logo', 'phaser.png');

    }

    function create () {

        var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
        logo.anchor.setTo(0.5, 0.5);

    }

};


