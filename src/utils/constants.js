// 画面解像度
export const SCREEN_WIDTH = 1280;
export const SCREEN_HEIGHT = 720;

// 将棋盤設定
export const BOARD_COLS = 9;
export const BOARD_ROWS = 9;
export const CELL_SIZE = 64; // 1マスのピクセルサイズ
export const BOARD_WIDTH = BOARD_COLS * CELL_SIZE;   // 576px
export const BOARD_HEIGHT = BOARD_ROWS * CELL_SIZE;  // 576px

// 盤面を描画する中央付近の基準座標（左上）
export const BOARD_ORIGIN_X = (SCREEN_WIDTH - BOARD_WIDTH) / 2;
export const BOARD_ORIGIN_Y = (SCREEN_HEIGHT - BOARD_HEIGHT) / 2;

// プレイヤー識別
export const PLAYER = {
  SENTE: 0, // 先手（下側・▲）
  GOTE: 1   // 後手（上側・△）
};

// 駒の種類（ID定義）
export const PIECE_TYPE = {
  PAWN: 'PAWN',       // 歩
  LANCE: 'LANCE',     // 香車
  KNIGHT: 'KNIGHT',   // 桂馬
  SILVER: 'SILVER',   // 銀将
  GOLD: 'GOLD',       // 金将
  BISHOP: 'BISHOP',   // 角行
  ROOK: 'ROOK',       // 飛車
  KING: 'KING',       // 玉将・王将
  // 成り駒
  P_PAWN: 'P_PAWN',     // と金
  P_LANCE: 'P_LANCE',   // 成香
  P_KNIGHT: 'P_KNIGHT', // 成桂
  P_SILVER: 'P_SILVER', // 成銀
  HORSE: 'HORSE',       // 龍馬（成角）
  DRAGON: 'DRAGON'      // 龍王（成飛）
};

// 色・デザインの定数
export const COLORS = {
  BOARD_BG: 0xdcb35c,       // 将棋盤の木目風カラー
  BOARD_LINE: 0x3d2b1f,     // マス目の線
  HIGHLIGHT_MOVE: 0x00ff00, // 合法手ハイライト（緑）
  HIGHLIGHT_SELECT: 0xff0000, // 選択中の駒ハイライト（赤）
  TEXT_SENTE: '#000000',    // 先手駒の文字色
  TEXT_GOTE: '#000000',     // 後手駒の文字色
  TEXT_PROMOTED: '#cc0000'  // 成り駒の文字色（赤）
};
