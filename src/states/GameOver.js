/* global game */
import Phaser from 'phaser'

export default class extends Phaser.State {
    init () {}

    create () {
        this.game.stage.backgroundColor = 0xcc4444

        this.title = game.add.sprite(game.width / 2, 180, 'game-over')
        this.title.scale.x = 3
        this.title.scale.y = 3
        this.title.anchor.set(0.5, 0.5)
        this.title.smoothed = false

        this.cat = this.game.add.group()
        this.cat.x = game.width / 2
        this.cat.y = game.height / 2

        this.head = game.add.sprite(0, 0, 'cat-head')
        this.head.scale.x = 20
        this.head.scale.y = 20
        this.head.smoothed = false
        this.head.anchor.set(0.5, 0.5)
        this.cat.add(this.head)

        this.leftEye = game.add.sprite(70, 70, 'cat-eye')
        this.leftEye.scale.x = 20
        this.leftEye.scale.y = 20
        this.leftEye.anchor.set(0.5, 0.5)
        this.leftEye.smoothed = false
        this.cat.add(this.leftEye)

        this.rightEye = game.add.sprite(-140, 60, 'cat-eye')
        this.rightEye.scale.x = 20
        this.rightEye.scale.y = 20
        this.rightEye.angle = 200
        this.rightEye.anchor.set(0.5, 0.5)
        this.rightEye.smoothed = false
        this.cat.add(this.rightEye)

        this.tween = game.add.tween(this.cat).to({angle: 5}, 300, Phaser.Easing.Bounce.InOut, true, 0, -1, true)

        this.button = game.add.button(game.width / 2, game.height / 2 + 400, 'replay', function () {
            this.state.start('Game')
        }, this)
        this.button.anchor.set(0.5, 0.5)
    }

    update () {
        this.leftEye.angle += 4
        this.rightEye.angle += 4
    }
}
