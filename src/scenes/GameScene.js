export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    console.log('GameScene: 対局画面起動');

    // UIオーバーレイ（UIScene）を並行して起動・前面表示
    this.scene.launch('UIScene');

    // 背景に仮のテキストを表示
    this.add.text(20, 20, 'GameScene Active - 盤面をここに描画', {
      fontSize: '18px',
      fill: '#00ff00'
    });
  }
}
