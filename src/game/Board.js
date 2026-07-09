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
    
    // 9x9 の盤面データ管理配列（空マスは null）
    this.gridData = Array.from({ length: BOARD_COLS }, () => Array(BOARD_ROWS).fill(null));
    
    // 盤面の描画を実行
    this.createBoardVisuals();
  }

  createBoardVisuals() {
    // 1. 将棋盤のベース背景（木目調の土台）
    const bg = this.scene.add.rectangle(
      BOARD_ORIGIN_X + BOARD_WIDTH / 2,
      BOARD_ORIGIN_Y + BOARD_HEIGHT / 2,
      BOARD_WIDTH + 20,
      BOARD_HEIGHT + 20,
      COLORS.BOARD_BG
    );
    bg.setStrokeStyle(3, COLORS.BOARD_LINE);
    this.boardGroup.add(bg);

    // 2. マス目の線（格子状）を描画
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(2, COLORS.BOARD_LINE, 1);

    for (let col = 0; col <= BOARD_COLS; col++) {
      const x = BOARD_ORIGIN_X + col * CELL_SIZE;
      graphics.moveTo(x, BOARD_ORIGIN_Y);
      graphics.lineTo(x, BOARD_ORIGIN_Y + BOARD_HEIGHT);
    }

    for (let row = 0; row <= BOARD_ROWS; row++) {
      const y = BOARD_ORIGIN_Y + row * CELL_SIZE;
      graphics.moveTo(BOARD_ORIGIN_X, y);
      graphics.lineTo(BOARD_ORIGIN_X + BOARD_WIDTH, y);
    }
    graphics.strokePath();
    this.boardGroup.add(graphics);

    // 3. 星（4つの目印の点）を描画
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
   * 指定したグリッド座標に駒を配置し、データ配列に登録する
   */
  placePiece(piece, gridX, gridY) {
    this.gridData[gridX][gridY] = piece;
    piece.setPosition(gridX, gridY);
  }

  /**
   * 指定したグリッド座標にある駒を取得する（空なら null）
   */
  getPieceAt(gridX, gridY) {
    if (!Board.isWithinBounds(gridX, gridY)) return null;
    return this.gridData[gridX][gridY];
  }

  gridToWorld(gridX, gridY) {
    const worldX = BOARD_ORIGIN_X + gridX * CELL_SIZE + CELL_SIZE / 2;
    const worldY = BOARD_ORIGIN_Y + gridY * CELL_SIZE + CELL_SIZE / 2;
    return { worldX, worldY };
  }

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

  static isWithinBounds(gridX, gridY) {
    return gridX >= 0 && gridX < BOARD_COLS && gridY >= 0 && gridY < BOARD_ROWS;
  }
}
