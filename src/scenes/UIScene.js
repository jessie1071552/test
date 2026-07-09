export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  create() {
    console.log('UIScene: UIオーバーレイ起動');

    // 画面上部に固定表示する手番・タイマーUIのダミー
    this.add.text(10, 10, '[UIScene] 手番: 先手(▲) | 持ち時間: 10:00', {
      fontSize: '16px',
      fill: '#ffffff',
      backgroundColor: '#00000088',
      padding: { x: 10, y: 5 }
    });
  }
}
