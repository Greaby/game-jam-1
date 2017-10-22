/* global game */
import Phaser from 'phaser'

export default class extends Phaser.State {
    init () {
        this.maxHealth = 300
        this.barLength = 300
        this.guardPositions = [
            [9, 21],
            [53, 10],
            [81, 27],
            [10, 63],
            [52, 50],
            [77, 46],
            [13, 88],
            [39, 81],
            [57, 69]
        ]
    }
    preload () {}

    create () {
        this.game.stage.backgroundColor = 0x4488cc

        this.map = game.add.tilemap('map', 32, 32)
        this.map.addTilesetImage('tiles', null, 32, 32)
        this.layer = this.map.createLayer(0)
        this.layer.resizeWorld()

        this.healthBar = game.add.graphics(game.width - this.barLength - 20, 20)
        this.healthBar.fixedToCamera = true

        // this.layer.debug = true

        this.map.setCollisionByExclusion([0, 1, 2, 3, 4, 21])

        // player
        this.SPEED = 600 // pixels/second
        this.ACCELERATION = 500 // pixels/second/second
        this.player = game.add.graphics(0, 0)
        this.player.beginFill(0xFFFFFF, 1)
        this.player.drawCircle(0, 0, 32)
        this.player.anchor.setTo(0.5, 0.5)
        this.player.position.x = 1792
        this.player.position.y = 832
        this.game.physics.enable(this.player)
        this.player.body.setSize(32, 32)
        this.player.health = this.maxHealth
        this.game.camera.follow(this.player)

        // Guards
        this.guards = this.game.add.group()
        for (let i = 0; i < this.guardPositions.length; i++) {
            let guard = this.game.add.graphics(0, 0)
            guard.beginFill(0xFFAAAAAA, 1)
            guard.drawCircle(0, 0, 64)
            guard.position.x = this.guardPositions[i][0] * 32
            guard.position.y = this.guardPositions[i][1] * 32
            guard.anchor.setTo(0.5, 0.5)

            guard.angle = this.getAngle()
            game.physics.enable(guard, Phaser.Physics.ARCADE)

            guard.emitter = game.add.emitter(0, 0, 100)

            guard.emitter.makeParticles('cat-heart')
            guard.emitter.gravity = -200

            this.guards.add(guard)
        }

        this.game.input.keyboard.addKeyCapture([
            Phaser.Keyboard.LEFT,
            Phaser.Keyboard.RIGHT,
            Phaser.Keyboard.UP,
            Phaser.Keyboard.DOWN
        ])
    }

    getAngle () {
        return this.game.rnd.integerInRange(0, 360)
    }

    update () {
        let guardNumber = 0

        /* this.layer.getTiles(0, 0, this.game.width, this.game.height, false, true).forEach(function(tile) {
            tile.debug = false;
        }, this); */

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

        this.guards.forEach(function (guard) {
            game.physics.arcade.collide(guard, this.layer, function (guard) {
                guard.angle = this.getAngle()
            }, null, this)
            game.physics.arcade.velocityFromAngle(guard.angle, guard.speed, guard.body.velocity)
            guard.line = new Phaser.Line(guard.x, guard.y, this.player.x, this.player.y)

            let tileHits = this.layer.getRayCastTiles(guard.line, 4, true, false)

            guard.tint = 0xffffffff
            guard.speed = 120
            if (tileHits.length === 0) {
                let angleBetween = game.math.radToDeg(game.physics.arcade.angleBetween(guard, this.player))

                if (guard.angle <= angleBetween + 60 && guard.angle >= angleBetween - 60) {
                    guard.angle = angleBetween
                    guard.speed = 260
                    guard.tint = 0xff00ffff
                    guard.emitter.x = guard.x
                    guard.emitter.y = guard.y
                    guard.emitter.start(true, 2000, null, 1)
                    guardNumber += 1
                }
            }

            /* if (tileHits.length > 0) {
                //  Just so we can visually see the tiles
                for (var i = 0; i < tileHits.length; i++) {
                    tileHits[i].debug = true;
                }

                this.layer.dirty = true;
            } */
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
        this.healthBar.beginFill(0xFF3300)
        this.healthBar.drawRect(0, 0, this.barLength, 20)

        // green bar
        this.healthBar.beginFill(0x28d63f)
        this.healthBar.drawRect(0, 0, Math.round((this.player.health / this.maxHealth) * this.barLength), 20)

        // border
        this.healthBar.endFill()
        this.healthBar.lineStyle(2, 0xFFFFFF, 1)
        this.healthBar.drawRect(0, 0, this.barLength, 20)
        this.healthBar.dirty = true
    }

    render () {
        /* this.guards.forEach(function(guard) {
            game.debug.geom(guard.line);
        }) */
    }
}
