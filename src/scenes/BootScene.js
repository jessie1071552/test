export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    console.log('BootScene: 素材ロード中...');
    // 今後はここに駒の画像や効果音のロード処理を書く
    // 今はプロシージャル（コード生成）でダミーテクスチャを作成する準備としても使う
  }

  create() {
    console.log('BootScene: ロード完了、TitleSceneへ遷移');
    this.scene.start('TitleScene');
  }
}
