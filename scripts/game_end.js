var tootsieRollSpider = tootsieRollSpider || {};

tootsieRollSpider.End = function() {};

tootsieRollSpider.End.prototype = {
    create: function() {
        this.game.stage.backgroundColor = '#707070';
        this.game.add.text(100,20, 'Game Over\n', {font:'40px Arial', fill: '#fff'});
        this.game.add.text(100, 90, 'You were able to get ' + score / 10 + ' tootsie roll(s) out of 12 total.\n', {font: '14px Arial', fill: '#fff'}); 
        this.game.add.text(100,130, 'You failed and now it will forever be hot.\n', {font: '14px Arial', fill: '#fff'});
        this.game.add.text(100,170, 'The only thing you have earned is this error message. Click restart to try again.\n', {font: '14px Arial', fill: '#fff'});
        // this.game.add.text(100,210, 'Good luck, use the arrow keys to navigate. \n', {font: '14px Arial', fill: '#fff'});                
        this.game.add.text(100,510, 'Created by: Mary Kergosien, Deric Bunch, Jesse Turner, Brendon Pierson. \n', {font: '14px Arial', fill: '#fff'});                
        var gameOverTitle = this.game.add.sprite(425,450,"gameover");
        gameOverTitle.anchor.setTo(0.5,0.5);
        // button_2back1 = this.game.add.button(100, 250, 'play_button', this.set2Back1, this);
    },
    update: function() {
        if( nBack_frames > 3) {
            this.game.state.start('Game');
        }
    },
    set2Back1: function() {
        nBack_frames = 2;
        nBack_colors = 1;
    },
    set2Back2: function() {
        nBack_frames = 2;
        nBack_colors = 2;
    },
    set3Back1: function() {
        nBack_frames = 3;
        nBack_colors = 1;
    },
    set3Back2: function() {
        nBack_frames = 3;
        nBack_colors = 2;
    },
    set4Back1: function() {
        nBack_frames = 4;
        nBack_colors = 1;
    },
    set4Back2: function() {
        nBack_frames = 4;
        nBack_colors = 2;
    }
};