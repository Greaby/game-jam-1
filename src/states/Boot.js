import Phaser from 'phaser'
import WebFont from 'webfontloader'

export default class extends Phaser.State {
  init () {
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.pageAlignVertically = true;
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

  }

  preload () {
    this.load.tilemap('map', 'assets/map.csv', null, Phaser.Tilemap.CSV);
    this.load.spritesheet("tiles", "assets/tiles.png", 16, 16);
    
    this.load.onLoadComplete.add(this.loadComplete, this);
  }

  loadComplete() {
      this.state.start('Game');
    }
}
