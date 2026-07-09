import { 
  BOARD_COLS, 
  BOARD_ROWS, 
  CELL_SIZE, 
  BOARD_WIDTH, 
  BOARD_HEIGHT, 
  BOARD_ORIGIN_X, 
  BOARD_ORIGIN_Y, 
  COLORS 
} from '../utils/constants.js';

export class Board {
  constructor(scene) {
    this.scene = scene;
    this.boardGroup = scene.add.group();
    
    // 盤面の描画を実行
    this.createBoardVisuals();
  }

  createBoardVisuals() {
    // 1. 将棋盤のベース背景（木目調の土台）
    const bg = this.scene.add.rectangle(
      BOARD_ORIGIN_X + BOARD_WIDTH / 2,
      BOARD_ORIGIN_Y + BOARD_HEIGHT / 2,
      BOARD_WIDTH + 20, // 外枠を少し余分に取る
      BOARD_HEIGHT + 20,
      COLORS.BOARD_BG
    );
    bg.setStrokeStyle(3, COLORS.BOARD_LINE);
    this.boardGroup.add(bg);

    // 2. マス目の線（格子状）を描画
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(2, COLORS.BOARD_LINE, 1);

    // 縦線（9マス分の10本）
    for (let col = 0; col <= BOARD_COLS; col++) {
      const x = BOARD_ORIGIN_X + col * CELL_SIZE;
      graphics.moveTo(x, BOARD_ORIGIN_Y);
      graphics.lineTo(x, BOARD_ORIGIN_Y + BOARD_HEIGHT);
    }

    // 横線（9マス分の10本）
    for (let row = 0; row <= BOARD_ROWS; row++) {
      const y = BOARD_ORIGIN_Y + row * CELL_SIZE;
      graphics.moveTo(BOARD_ORIGIN_X, y);
      graphics.lineTo(BOARD_ORIGIN_X + BOARD_WIDTH, y);
    }
    graphics.strokePath();
    this.boardGroup.add(graphics);

    // 3. 星（4つの目印の点）を描画
    // 将棋盤の星は一般的に (3,3), (6,3), (3,6), (6,6) の交点に配置される
    const starPoints = [
      { x: 3, y: 3 }, { x: 6, y: 3 },
      { x: 3, y: 6 }, { x: 6, y: 6 }
    ];

    starPoints.forEach(point => {
      const worldX = BOARD_ORIGIN_X + point.x * CELL_SIZE;
      const worldY = BOARD_ORIGIN_Y + point.y * CELL_SIZE;
      const star = this.scene.add.circle(worldX, worldY, 4, COLORS.BOARD_LINE);
      this.boardGroup.add(star);
    });
  }

  /**
   * グリッド座標 (0~8, 0~8) を画面上のピクセル座標（マスの中心点）に変換する
   */
  gridToWorld(gridX, gridY) {
    const worldX = BOARD_ORIGIN_X + gridX * CELL_SIZE + CELL_SIZE / 2;
    const worldY = BOARD_ORIGIN_Y + gridY * CELL_SIZE + CELL_SIZE / 2;
    return { worldX, worldY };
  }

  /**
   * 画面上のピクセル座標をグリッド座標 (0~8, 0~8) に変換する
   * 盤外をクリックした場合は null を返す
   */
  worldToGrid(worldX, worldY) {
    if (
      worldX < BOARD_ORIGIN_X || 
      worldX >= BOARD_ORIGIN_X + BOARD_WIDTH ||
      worldY < BOARD_ORIGIN_Y || 
      worldY >= BOARD_ORIGIN_Y + BOARD_HEIGHT
    ) {
      return null;
    }
    const gridX = Math.floor((worldX - BOARD_ORIGIN_X) / CELL_SIZE);
    const gridY = Math.floor((worldY - BOARD_ORIGIN_Y) / CELL_SIZE);
    return { gridX, gridY };
  }

  /**
   * 指定した座標が将棋盤の範囲内 (0~8) であるかを判定する静的メソッド
   */
  static isWithinBounds(gridX, gridY) {
    return gridX >= 0 && gridX < BOARD_COLS && gridY >= 0 && gridY < BOARD_ROWS;
  }
}
