import Phaser from 'phaser'

export default class extends Phaser.State {
    init () {
        this.game.scale.pageAlignHorizontally = true
        this.game.scale.pageAlignVertically = true
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL
    }

    preload () {
        this.load.tilemap('map', 'assets/map.csv', null, Phaser.Tilemap.CSV)
        this.load.tilemap('map-coin', 'assets/map-coin.csv', null, Phaser.Tilemap.CSV)
        this.load.spritesheet('tiles', 'assets/tiles.png', 16, 16)

        this.load.image('cat-head', 'assets/cat-head.png')
        this.load.image('cat-eye', 'assets/cat-eye.png')
        this.load.image('heart', 'assets/heart.png')
        this.load.image('cat-heart', 'assets/cat-heart.png')

        this.load.image('game-over', 'assets/game-over.png')
        this.load.image('win', 'assets/win.png')
        this.load.image('replay', 'assets/replay.png')

        this.load.onLoadComplete.add(this.loadComplete, this)
    }

    loadComplete () {
        this.state.start('Game')
    }
}
