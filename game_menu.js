var tootsieRollSpider = tootsieRollSpider || {};

tootsieRollSpider.MainMenu = function() {};

tootsieRollSpider.MainMenu.prototype = {
    create: function() {
        this.game.stage.backgroundColor = '#707070';
        this.game.add.text(100,20, 'Tootsie Roll Spider\n', {font:'40px Arial', fill: '#fff'});
        this.game.add.text(100, 90, 'Welcome to NSS, home to spiders, opressive heat, and the fearless Steve.\n', {font: '14px Arial', fill: '#fff'}); 
        this.game.add.text(100,130, 'Your mission is to collect all of the tootsie rolls scattered around the school.\nBe sure to avoid the nasty spiders, 3 bites and you are finished!\n', {font: '14px Arial', fill: '#fff'});
        this.game.add.text(100,170, 'If you fail to get all of the tootsie rolls, NSS will remain a perpetual oven.\nBut if you do get all of the tootsie rolls a golden fan awaits!\n', {font: '14px Arial', fill: '#fff'});
        this.game.add.text(100,210, 'Good luck, use the arrow keys to navigate. \n', {font: '14px Arial', fill: '#fff'});                
        this.game.add.text(100,510, 'Created by: Mary Kergosien, Deric Bunch, Jesse Turner, Brendon Pierson. \n', {font: '14px Arial', fill: '#fff'});                
        
        button_2back1 = this.game.add.button(100, 250, 'play_button', this.set2Back1, this);
    },
    update: function() {
        if( nBack_frames > 0) {
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