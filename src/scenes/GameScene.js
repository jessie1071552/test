import { Board } from '../game/Board.js';
import { Piece } from '../game/Piece.js';
import { RuleEngine } from '../game/RuleEngine.js';
import { PIECE_TYPE, PLAYER } from '../utils/constants.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    console.log('GameScene: 対局画面起動');

    this.scene.launch('UIScene');
    this.board = new Board(this);
    this.setupInitialBoard();

    // ターンと選択状態の管理
    this.currentTurn = PLAYER.SENTE; // 先手（手前のプレイヤー）から開始
    this.selectedPiece = null;

    // クリックイベントの登録
    this.setupInputHandlers();
  }

  setupInputHandlers() {
    // 1. ゲーム上のオブジェクト（駒など）をクリックした時の判定
    this.input.on('gameobjectdown', (pointer, gameObject) => {
      if (gameObject.type === 'Piece') {
        const piece = gameObject.pieceInstance;
        this.handlePieceClick(piece);
      }
    });

    // 2. 画面のどこかをクリックした時のキャンセル処理
    this.input.on('pointerdown', (pointer, currentlyOver) => {
      // ハイライトや駒以外（空マスや盤外）をクリックしたら選択を解除
      if (currentlyOver.length === 0 && this.selectedPiece) {
        this.deselect();
      }
    });
  }

  handlePieceClick(piece) {
    // ① 自分の手番の駒をクリックした場合 -> その駒を選択してハイライトを表示
    if (piece.owner === this.currentTurn) {
      this.selectedPiece = piece;
      
      // 合法手を計算
      const legalMoves = RuleEngine.getLegalMoves(this.board, piece, piece.gridX, piece.gridY);
      
      // 移動先がクリックされた時の処理を渡してハイライトを描画
      this.board.showHighlights(legalMoves, (targetX, targetY) => {
        this.executeMove(piece.gridX, piece.gridY, targetX, targetY);
      });
    } 
    // ② すでに駒を選択中に、移動可能な「敵の駒」をクリックした場合 -> 駒を取る移動を実行
    else if (this.selectedPiece) {
      const legalMoves = RuleEngine.getLegalMoves(this.board, this.selectedPiece, this.selectedPiece.gridX, this.selectedPiece.gridY);
      const canMove = legalMoves.some(m => m.x === piece.gridX && m.y === piece.gridY);
      
      if (canMove) {
        this.executeMove(this.selectedPiece.gridX, this.selectedPiece.gridY, piece.gridX, piece.gridY);
      } else {
        this.deselect();
      }
    }
  }

  executeMove(fromX, fromY, toX, toY) {
    // 駒を移動（敵の駒があれば盤面から削除される）
    const capturedPiece = this.board.movePiece(fromX, fromY, toX, toY);
    if (capturedPiece) {
      console.log(`敵の ${capturedPiece.getPieceLabel()} を取った！`);
    }

    // 選択を解除してハイライトを消去
    this.deselect();

    // 手番の交代
    this.switchTurn();
  }

  switchTurn() {
    this.currentTurn = (this.currentTurn === PLAYER.SENTE) ? PLAYER.GOTE : PLAYER.SENTE;
    const turnName = (this.currentTurn === PLAYER.SENTE) ? '先手(▲)' : '後手(△)';
    console.log(`手番交代:次は ${turnName} の番だ`);
  }

  deselect() {
    this.selectedPiece = null;
    this.board.clearHighlights();
  }

  setupInitialBoard() {
    for (let col = 0; col < 9; col++) {
      this.board.placePiece(new Piece(this, this.board, PLAYER.GOTE, PIECE_TYPE.PAWN), col, 2);
      this.board.placePiece(new Piece(this, this.board, PLAYER.SENTE, PIECE_TYPE.PAWN), col, 6);
    }

    this.board.placePiece(new Piece(this, this.board, PLAYER.GOTE, PIECE_TYPE.ROOK), 1, 1);
    this.board.placePiece(new Piece(this, this.board, PLAYER.GOTE, PIECE_TYPE.BISHOP), 7, 1);
    this.board.placePiece(new Piece(this, this.board, PLAYER.SENTE, PIECE_TYPE.BISHOP), 1, 7);
    this.board.placePiece(new Piece(this, this.board, PLAYER.SENTE, PIECE_TYPE.ROOK), 7, 7);

    const row0 = [
      PIECE_TYPE.LANCE, PIECE_TYPE.KNIGHT, PIECE_TYPE.SILVER, 
      PIECE_TYPE.GOLD, PIECE_TYPE.KING, PIECE_TYPE.GOLD, 
      PIECE_TYPE.SILVER, PIECE_TYPE.KNIGHT, PIECE_TYPE.LANCE
    ];

    for (let col = 0; col < 9; col++) {
      this.board.placePiece(new Piece(this, this.board, PLAYER.GOTE, row0[col]), col, 0);
      this.board.placePiece(new Piece(this, this.board, PLAYER.SENTE, row0[col]), col, 8);
    }
    
    console.log('初期配置の完了: 計40枚の駒をセットした');
  }
}
