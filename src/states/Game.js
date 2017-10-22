/* global game */
import Phaser from 'phaser'

export default class extends Phaser.State {
    init () {
        this.maxHealth = 300
        this.barLength = 300
    }
    preload () {}


    create () {
        this.game.stage.backgroundColor = 0x4488cc

        this.map = game.add.tilemap('map', 32, 32)
        this.map.addTilesetImage('tiles', null, 32, 32)
        this.layer = this.map.createLayer(0)
        this.layer.resizeWorld()


        this.healthBar = game.add.graphics(game.width - this.barLength - 20, 20)


        //this.layer.debug = true

        this.map.setCollisionByExclusion([0])

        // player
        this.SPEED = 300 // pixels/second
        this.ACCELERATION = 500 // pixels/second/second
        this.player = game.add.graphics(0, 0)
        this.player.beginFill(0xFFFFFF, 1)
        this.player.drawCircle(0, 0, 32)
        this.player.anchor.setTo(0.5, 0.5)
        this.player.position.x = 48
        this.player.position.y = 48
        this.game.physics.enable(this.player)
        this.player.body.setSize(32, 32)
        this.player.health = this.maxHealth;
        this.game.camera.follow(this.player)

        // Guards
        this.guards = this.game.add.group();
        for (let i = 0; i < 6; i++) {
            let x = this.game.rnd.integerInRange(32, 900)
            let y = this.game.rnd.integerInRange(32, 900)

            let guard = this.game.add.graphics(0, 0)
            guard.beginFill(0xFFAAAAAA, 1)
            guard.drawCircle(0, 0, 32)
            guard.position.x = x;
            guard.position.y = y;
            guard.anchor.setTo(0.5, 0.5)

            guard.angle = this.getAngle()
            game.physics.enable(guard, Phaser.Physics.ARCADE)
            this.guards.add(guard);

        }

        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN
        ])

    }

    getAngle() {
        return this.game.rnd.integerInRange(0, 8) * 45
    }


    update () {
        let guardNumber = 0


        this.layer.getTiles(0, 0, this.game.width, this.game.height, false, true).forEach(function(tile) {
            tile.debug = false;
        }, this);

        game.physics.arcade.collide(this.player, this.layer)

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

        this.guards.forEach(function(guard) {
            game.physics.arcade.collide(guard, this.layer, function(guard){

                guard.angle = this.getAngle()
            }, null, this)
            game.physics.arcade.velocityFromAngle(guard.angle, 80, guard.body.velocity);
            guard.line = new Phaser.Line(guard.x, guard.y, this.player.x, this.player.y)

            let tileHits = this.layer.getRayCastTiles(guard.line, 4, true, false);
            if(tileHits.length === 0) {
                guard.tint = 0xff00ffff
                guardNumber += 1
            } else {
                guard.tint = 0xffffffff
            }

            if (tileHits.length > 0) {
                //  Just so we can visually see the tiles
                for (var i = 0; i < tileHits.length; i++) {
                    tileHits[i].debug = true;
                }

                this.layer.dirty = true;
            }

        }, this)

        this.updatePlayerHealth(guardNumber)
        this.drawHealthBar()
    }

    updatePlayerHealth (guardNumber) {

        if (guardNumber) {
            this.player.health -= guardNumber
        } else {
            this.player.health += 1
        }

        if (this.player.health > this.maxHealth) {
            this.player.health = this.maxHealth
        } else if (this.player.health < 0) {
            this.state.start('GameOver')
        }

    }

    drawHealthBar () {
        this.healthBar.clear()

        // red bar
        this.healthBar.beginFill(0xFF3300);
        this.healthBar.drawRect(0, 0, this.barLength, 20);

        // green bar
        this.healthBar.beginFill(0x28d63f);
        this.healthBar.drawRect(0, 0, Math.round((this.player.health / this.maxHealth) * this.barLength) , 20);

        // border
        this.healthBar.endFill();
        this.healthBar.lineStyle(2, 0xFFFFFF, 1);
        this.healthBar.drawRect(0, 0, this.barLength, 20);
        this.healthBar.dirty = true;
    }

    render () {
        this.guards.forEach(function(guard) {
            game.debug.geom(guard.line);
        })
    }
}
