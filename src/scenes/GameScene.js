import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../utils/constants.js';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super({ key: 'TitleScene' });
  }

  create() {
    console.log('TitleScene: 起動');

    // タイトルテキスト
    this.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 3, 'SHOGI ONLINE', {
      fontSize: '48px',
      fill: '#ffffff',
      fontStyle: 'bold'
    }).setOrigin(0.5);

    const startText = this.add.text(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2 + 50, '[ SPACE ] キー または クリック で対局開始', {
      fontSize: '24px',
      fill: '#ffff00'
    }).setOrigin(0.5);

    // 点滅エフェクト
    this.tweens.add({
      targets: startText,
      alpha: 0,
      duration: 800,
      ease: 'Power2',
      yoyo: true,
      repeat: -1
    });

    // 入力イベントでGameSceneへ遷移
    this.input.keyboard.once('keydown-SPACE', () => this.startGame());
    this.input.once('pointerdown', () => this.startGame());
  }

  startGame() {
    console.log('TitleScene: GameSceneを開始');
    this.scene.start('GameScene');
  }
}
