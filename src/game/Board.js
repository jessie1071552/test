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
    this.highlightGroup = scene.add.group(); // ハイライト用のグループ
    
    this.gridData = Array.from({ length: BOARD_COLS }, () => Array(BOARD_ROWS).fill(null));
    this.createBoardVisuals();
  }

  createBoardVisuals() {
    const bg = this.scene.add.rectangle(
      BOARD_ORIGIN_X + BOARD_WIDTH / 2,
      BOARD_ORIGIN_Y + BOARD_HEIGHT / 2,
      BOARD_WIDTH + 20,
      BOARD_HEIGHT + 20,
      COLORS.BOARD_BG
    );
    bg.setStrokeStyle(3, COLORS.BOARD_LINE);
    this.boardGroup.add(bg);

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
   * 合法手リストを緑色の半透明円でハイライト表示する
   */
  showHighlights(legalMoves, onSelectCallback) {
    this.clearHighlights();

    for (const move of legalMoves) {
      const { worldX, worldY } = this.gridToWorld(move.x, move.y);
      
      // 半透明の緑色の丸を生成
      const highlight = this.scene.add.circle(worldX, worldY, CELL_SIZE * 0.35, COLORS.HIGHLIGHT_MOVE, 0.6);
      highlight.setInteractive({ useHandCursor: true });
      
      // クリックされたらコールバックを実行
      highlight.on('pointerdown', () => {
        onSelectCallback(move.x, move.y);
      });

      this.highlightGroup.add(highlight);
    }
  }

  /**
   * 表示中のハイライトを全て消去する
   */
  clearHighlights() {
    this.highlightGroup.clear(true, true);
  }

  /**
   * 駒を移動させる（敵の駒があれば取る処理も含む）
   */
  movePiece(fromX, fromY, toX, toY) {
    const piece = this.getPieceAt(fromX, fromY);
    if (!piece) return null;

    // 移動先に敵の駒があれば盤面から消す（後々ここで持ち駒台に追加する処理を入れる）
    const targetPiece = this.getPieceAt(toX, toY);
    if (targetPiece) {
      targetPiece.container.destroy();
    }

    // 元の場所を空にする
    this.gridData[fromX][fromY] = null;
    // 新しい場所に駒を配置する
    this.placePiece(piece, toX, toY);

    return targetPiece;
  }

  placePiece(piece, gridX, gridY) {
    this.gridData[gridX][gridY] = piece;
    piece.setPosition(gridX, gridY);
  }

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
