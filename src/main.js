
import 'pixi'
import 'p2'
import Phaser from 'phaser'
import BootState from './states/Boot'
import GameState from './states/Game'
import GameOverState from './states/GameOver'

import config from './config'

class Game extends Phaser.Game {
    constructor () {
        super(config.gameWidth, config.gameHeight)

        this.state.add('Game', GameState, false)
        this.state.add('GameOver', GameOverState, false)
        this.state.add('Boot', BootState, true)
    }
}

window.game = new Game()
