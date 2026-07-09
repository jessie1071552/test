import { Board } from '../game/Board.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    console.log('GameScene: 対局画面起動');

    // UIオーバーレイ（UIScene）を並行して起動・前面表示
    this.scene.launch('UIScene');

    // 盤面インスタンスの生成（これだけで画面中央に9x9の将棋盤が描画される）
    this.board = new Board(this);

    // デバッグ用: マスをクリックしたときにグリッド座標をコンソールに出力する
    this.input.on('pointerdown', (pointer) => {
      const gridCoords = this.board.worldToGrid(pointer.x, pointer.y);
      if (gridCoords) {
        console.log(`盤面クリック: [${gridCoords.gridX}, ${gridCoords.gridY}]`);
      } else {
        console.log('盤外をクリック');
      }
    });
  }
}
