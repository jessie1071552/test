import { PIECE_TYPE, PLAYER, COLORS, CELL_SIZE } from '../utils/constants.js';

export class Piece {
  constructor(scene, board, owner, type) {
    this.scene = scene;
    this.board = board;
    this.owner = owner;       // PLAYER.SENTE または PLAYER.GOTE
    this.type = type;         // PIECE_TYPE のいずれか
    this.isPromoted = false;  // 成り状態かどうか
    this.gridX = -1;
    this.gridY = -1;

    // 駒の見た目をまとめるコンテナ
    this.container = scene.add.container(0, 0);
    this.createVisuals();
  }

  createVisuals() {
    // 駒の背景（木目調の正方形ベース）
    const size = CELL_SIZE - 8;
    const bg = this.scene.add.rectangle(0, 0, size, size, 0xfffacd);
    bg.setStrokeStyle(2, 0x553311);
    
    // 後手の駒は180度回転して相手向きにする
    if (this.owner === PLAYER.GOTE) {
      this.container.setAngle(180);
    }

    // 駒の漢字ラベルを取得
    const textStr = this.getPieceLabel();
    const textColor = this.isPromoted 
      ? COLORS.TEXT_PROMOTED 
      : (this.owner === PLAYER.SENTE ? COLORS.TEXT_SENTE : COLORS.TEXT_GOTE);
    
    const text = this.scene.add.text(0, 0, textStr, {
      fontSize: '28px',
      fontFamily: 'serif',
      fontStyle: 'bold',
      fill: textColor
    }).setOrigin(0.5);

    this.container.add([bg, text]);

    // クリック判定を背景の図形に持たせる
    bg.setInteractive({ useHandCursor: true });
    bg.type = 'Piece';
    bg.pieceInstance = this; // クリックされた時にこの Piece オブジェクトを参照するため
  }

  getPieceLabel() {
    const labels = {
      [PIECE_TYPE.PAWN]: '歩',
      [PIECE_TYPE.LANCE]: '香',
      [PIECE_TYPE.KNIGHT]: '桂',
      [PIECE_TYPE.SILVER]: '銀',
      [PIECE_TYPE.GOLD]: '金',
      [PIECE_TYPE.BISHOP]: '角',
      [PIECE_TYPE.ROOK]: '飛',
      [PIECE_TYPE.KING]: this.owner === PLAYER.SENTE ? '玉' : '王',
      [PIECE_TYPE.P_PAWN]: 'と',
      [PIECE_TYPE.P_LANCE]: '杏',
      [PIECE_TYPE.P_KNIGHT]: '圭',
      [PIECE_TYPE.P_SILVER]: '全',
      [PIECE_TYPE.HORSE]: '馬',
      [PIECE_TYPE.DRAGON]: '龍'
    };
    return labels[this.type] || '';
  }

  /**
   * 指定されたグリッド座標に駒の配置と画面座標を反映させる
   */
  setPosition(gridX, gridY) {
    this.gridX = gridX;
    this.gridY = gridY;
    const { worldX, worldY } = this.board.gridToWorld(gridX, gridY);
    this.container.setPosition(worldX, worldY);
  }
}
