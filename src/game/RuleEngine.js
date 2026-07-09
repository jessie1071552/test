import { PIECE_TYPE, PLAYER } from '../utils/constants.js';
import { Board } from './Board.js';

export class RuleEngine {
  /**
   * 指定した駒が移動可能な座標リストを返す
   */
  static getLegalMoves(board, piece, fromX, fromY) {
    const legalMoves = [];
    const isSente = piece.owner === PLAYER.SENTE;
    // 先手は上方向(Yが減る)、後手は下方向(Yが増える)が前になる
    const forward = isSente ? -1 : 1;

    // 駒の種類に応じた移動ベクトル・特性を取得
    const { vectors, isLongRange } = RuleEngine.getMoveRules(piece.type, forward);

    for (const vec of vectors) {
      let targetX = fromX + vec.x;
      let targetY = fromY + vec.y;

      // 1マスしか進めない駒（歩・桂・銀・金・玉など）
      if (!isLongRange) {
        if (Board.isWithinBounds(targetX, targetY)) {
          const targetPiece = board.getPieceAt(targetX, targetY);
          // 移動先に味方の駒がなければ移動可能（空マス or 敵の駒）
          if (!targetPiece || targetPiece.owner !== piece.owner) {
            legalMoves.push({ x: targetX, y: targetY });
          }
        }
      } 
      // どこまでも進める長距離駒（香・角・飛など）
      else {
        while (Board.isWithinBounds(targetX, targetY)) {
          const targetPiece = board.getPieceAt(targetX, targetY);
          if (!targetPiece) {
            // 空マスならさらに先へ進める
            legalMoves.push({ x: targetX, y: targetY });
          } else {
            // 敵の駒なら取れるので合法手に含めてループ終了
            if (targetPiece.owner !== piece.owner) {
              legalMoves.push({ x: targetX, y: targetY });
            }
            // 味方の駒でも敵の駒でも、それ以上先には進めない
            break;
          }
          targetX += vec.x;
          targetY += vec.y;
        }
      }
    }

    return legalMoves;
  }

  /**
   * 駒の種類ごとの移動ルールを定義
   */
  static getMoveRules(type, forward) {
    switch (type) {
      case PIECE_TYPE.PAWN: // 歩
        return { vectors: [{ x: 0, y: forward }], isLongRange: false };

      case PIECE_TYPE.LANCE: // 香車
        return { vectors: [{ x: 0, y: forward }], isLongRange: true };

      case PIECE_TYPE.KNIGHT: // 桂馬 (2マス前＋左右1マス)
        return { 
          vectors: [
            { x: -1, y: forward * 2 },
            { x: 1, y: forward * 2 }
          ], 
          isLongRange: false 
        };

      case PIECE_TYPE.SILVER: // 銀将 (前、斜め4つ)
        return {
          vectors: [
            { x: 0, y: forward },
            { x: -1, y: forward },
            { x: 1, y: forward },
            { x: -1, y: -forward },
            { x: 1, y: -forward }
          ],
          isLongRange: false
        };

      case PIECE_TYPE.GOLD: // 金将 (斜め後ろを除く6方向)
      case PIECE_TYPE.P_PAWN: // と金
      case PIECE_TYPE.P_LANCE: // 成香
      case PIECE_TYPE.P_KNIGHT: // 成桂
      case PIECE_TYPE.P_SILVER: // 成銀
        return {
          vectors: [
            { x: 0, y: forward },
            { x: -1, y: forward },
            { x: 1, y: forward },
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: -forward }
          ],
          isLongRange: false
        };

      case PIECE_TYPE.BISHOP: // 角行
        return {
          vectors: [
            { x: -1, y: -1 },
            { x: 1, y: -1 },
            { x: -1, y: 1 },
            { x: 1, y: 1 }
          ],
          isLongRange: true
        };

      case PIECE_TYPE.ROOK: // 飛車
        return {
          vectors: [
            { x: 0, y: -1 },
            { x: 0, y: 1 },
            { x: -1, y: 0 },
            { x: 1, y: 0 }
          ],
          isLongRange: true
        };

      case PIECE_TYPE.KING: // 玉将・王将 (全8方向)
        return {
          vectors: [
            { x: 0, y: -1 }, { x: 0, y: 1 }, { x: -1, y: 0 }, { x: 1, y: 0 },
            { x: -1, y: -1 }, { x: 1, y: -1 }, { x: -1, y: 1 }, { x: 1, y: 1 }
          ],
          isLongRange: false
        };

      default:
        return { vectors: [], isLongRange: false };
    }
  }
}
