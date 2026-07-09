import { Board } from '../game/Board.js';
import { Piece } from '../game/Piece.js';
import { PIECE_TYPE, PLAYER } from '../utils/constants.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    console.log('GameScene: 対局画面起動');

    // UIオーバーレイを起動
    this.scene.launch('UIScene');

    // 盤面インスタンスの生成
    this.board = new Board(this);

    // 将棋の初期配置をセットアップ
    this.setupInitialBoard();
  }

  setupInitialBoard() {
    // === 1. 歩の配置 (各9枚) ===
    for (let col = 0; col < 9; col++) {
      this.board.placePiece(new Piece(this, this.board, PLAYER.GOTE, PIECE_TYPE.PAWN), col, 2);
      this.board.placePiece(new Piece(this, this.board, PLAYER.SENTE, PIECE_TYPE.PAWN), col, 6);
    }

    // === 2. 大駒の配置 (角・飛車) ===
    // 後手
    this.board.placePiece(new Piece(this, this.board, PLAYER.GOTE, PIECE_TYPE.ROOK), 1, 1);
    this.board.placePiece(new Piece(this, this.board, PLAYER.GOTE, PIECE_TYPE.BISHOP), 7, 1);
    // 先手
    this.board.placePiece(new Piece(this, this.board, PLAYER.SENTE, PIECE_TYPE.BISHOP), 1, 7);
    this.board.placePiece(new Piece(this, this.board, PLAYER.SENTE, PIECE_TYPE.ROOK), 7, 7);

    // === 3. 1段目・9段目の駒配置 ===
    const row0 = [
      PIECE_TYPE.LANCE, PIECE_TYPE.KNIGHT, PIECE_TYPE.SILVER, 
      PIECE_TYPE.GOLD, PIECE_TYPE.KING, PIECE_TYPE.GOLD, 
      PIECE_TYPE.SILVER, PIECE_TYPE.KNIGHT, PIECE_TYPE.LANCE
    ];

    for (let col = 0; col < 9; col++) {
      // 後手の1段目 (Y=0)
      this.board.placePiece(new Piece(this, this.board, PLAYER.GOTE, row0[col]), col, 0);
      // 先手の9段目 (Y=8)
      this.board.placePiece(new Piece(this, this.board, PLAYER.SENTE, row0[col]), col, 8);
    }
    
    console.log('初期配置の完了: 計40枚の駒をセットしました');
  }
}
