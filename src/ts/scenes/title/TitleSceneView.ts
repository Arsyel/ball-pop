import { FontAsset } from "../../collections/AssetFont";
import { Assets } from "../../collections/AssetsTitle";
import { LAYER_DEPTH } from "../../helper/GeneralHelper";
import { BaseView } from "../../modules/core/BaseView";
import { Rectangle } from "../../modules/gameobjects/Rectangle";
import { Sprite } from "../../modules/gameobjects/Sprite";
import { ScreenUtilController } from "../../modules/screenutility/ScreenUtilController";

export const enum EventNames {
	onClickPlay = "onClickPlay",
	onCreateFinish = "onCreateFinish",
};

export class TitleSceneView implements BaseView {

  event: Phaser.Events.EventEmitter;
  screenUtility: ScreenUtilController;

  private _screenBackground: Rectangle;
  private _screenRatio: number;

  constructor (private _scene: Phaser.Scene) {
    this.screenUtility = ScreenUtilController.getInstance();
    this.event = new Phaser.Events.EventEmitter();
  }

  create (): void {
    this.createBackground();
    this.createTitleText();
    this.createPlayBtn();
    this.event.emit(EventNames.onCreateFinish);
  }

  private createBackground (): void {
	  const { centerX, centerY, width, height } = this.screenUtility;
	  const MAX_WIDTH_DIMENSION = 1080;
	  const MAX_HEIGHT_DIMENSION = 1920;
	  const COLOR = 0xfafafa;
	  this._screenBackground = new Rectangle(this._scene, centerX, centerY, MAX_WIDTH_DIMENSION, MAX_HEIGHT_DIMENSION, COLOR, 0.8);
	  this._screenBackground.transform.setMinPreferredDisplaySize(width, height);
	  this._screenRatio = this._screenBackground.transform.displayToOriginalWidthRatio;
  }

  private createTitleText (): void {
	  const { centerX, centerY } = this.screenUtility;
    const style = {
      align: "center",
      color: "#000",
      fontFamily: FontAsset.roboto.key,
      fontSize: `${120 * this._screenRatio}px`,
      stroke: "gray",
      strokeThickness: 10,
    } as Phaser.GameObjects.TextStyle;
    const title = "BALL\nPOP";
    const titleText = this._scene.add.text(centerX, centerY, title, style);
    titleText.setOrigin(0.5).setDepth(LAYER_DEPTH.UI);
    // TODO: Play tween from bottom to middle
  }

  private createPlayBtn (): void {
    const { centerX, height } = this.screenUtility;
    const playBtn = new Sprite(this._scene, centerX, height * 0.8, Assets.play_btn.key);
    playBtn.transform.setToScaleDisplaySize(this._screenRatio);
    playBtn.gameObject.setDepth(LAYER_DEPTH.UI);

    const onClick = (): void => {
      this.event.emit(EventNames.onClickPlay);
    };

    const playBtnScale = playBtn.gameObject.scale;
    const playBtnTween = this._scene.tweens.create({
      targets: [playBtn.gameObject],
      props: {
        scale: { getStart: () => playBtnScale, getEnd: () => playBtnScale * 0.98 }
      },
      duration: 60,
      yoyo: true,
      onComplete: onClick
    });

    playBtn.gameObject.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
      if (playBtnTween.isPlaying()) return;
      playBtnTween.play();
    });
  }

}