import { SCREEN_WIDTH, SCREEN_HEIGHT } from './utils/constants.js';
import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { GameScene } from './scenes/GameScene.js';
import { UIScene } from './scenes/UIScene.js';

const config = {
  type: Phaser.AUTO,
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  parent: 'game-container',
  backgroundColor: '#2b2b2b',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  // 将棋ゲームでは物理エンジンは不要なため設定しない
  scene: [
    BootScene,
    TitleScene,
    GameScene,
    UIScene
  ]
};

// ゲームインスタンスの生成
const game = new Phaser.Game(config);
