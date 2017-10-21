/* globals __DEV__ */
import Phaser from 'phaser'

export default class extends Phaser.State {
    init () {}
    preload () {}

    create () {
        this.game.stage.backgroundColor = 0x4488cc;


        this.map = game.add.tilemap('map', 32, 32);
        this.map.addTilesetImage('tiles', null, 32,32);
        this.layer = this.map.createLayer(0);
        this.layer.resizeWorld();

        this.map.setCollisionByExclusion([0]);
        
        // Define movement constants
        this.SPEED = 300; // pixels/second
        this.ACCELERATION = 500; // pixels/second/second

        this.player = game.add.graphics(0, 0);
        this.player.beginFill(0xFFFFFF, 1);
        this.player.drawCircle(16, 16, 32);
        this.game.physics.enable(this.player);
        this.player.body.setSize(32, 32);

        this.game.camera.follow(this.player);

        //this.player.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED);

        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN
        ]);
    }

    update () {

        game.physics.arcade.collide(this.player, this.layer);

        if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
            this.player.body.velocity.x = -this.SPEED
        } else if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
            this.player.body.velocity.x = this.SPEED
        } else {
            this.player.body.acceleration.x = 0
            this.player.body.velocity.x = 0
        }

        if (this.input.keyboard.isDown(Phaser.Keyboard.UP)) {
            this.player.body.velocity.y = -this.SPEED
        } else if (this.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
            this.player.body.velocity.y = this.SPEED
        } else {
            this.player.body.acceleration.y = 0
            this.player.body.velocity.y = 0
        }

    }

    render () {
        
    }
}
