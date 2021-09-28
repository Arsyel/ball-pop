import { Assets } from "../../collections/AssetGameplay";
import { BaseView } from "../../modules/core/BaseView";
import { Button } from "../../modules/gameobjects/Button";
import { FontAsset } from "../../collections/AssetFont";
import { Image } from "../../modules/gameobjects/Image";
import { LAYER_DEPTH } from "../../helper/GeneralHelper";
import { Rectangle } from "../../modules/gameobjects/Rectangle";
import { ScreenUtilController } from "../../modules/screenutility/ScreenUtilController";

export const enum EventNames {
  onClickRestart = "onClickRestart",
  onShowRecapModal = "onShowRecapModal",
  onCreateFinish = "onCreateFinish",
};


export class GameplaySceneView implements BaseView {

  event: Phaser.Events.EventEmitter;
  screenUtility: ScreenUtilController;

  private _restartKey: Phaser.Input.Keyboard.Key;

  private _screenBackground: Rectangle;
  private _screenRatio: number;

  private _screenOverlay: Rectangle;

  private _timerText: Phaser.GameObjects.Text;
  private _scoreText: Phaser.GameObjects.Text;

  private _comboTitleText: Phaser.GameObjects.Text;
  private _comboText: Phaser.GameObjects.Text;
  private _comboTextTween: Phaser.Tweens.Tween;

  private _timeoutText: Phaser.GameObjects.Text;

  private _prepareCountText: Phaser.GameObjects.Text;
  private _prepareCountTextTween: Phaser.Tweens.Tween;

  private _modal: Phaser.GameObjects.Container;
  private _totalScoreText: Phaser.GameObjects.Text;

  constructor (private _scene: Phaser.Scene) {
    this.screenUtility = ScreenUtilController.getInstance();
    this.event = new Phaser.Events.EventEmitter();
  }

  get restartKey (): Phaser.Input.Keyboard.Key {
    return this._restartKey;
  }

  get screenRatio (): number {
    return this._screenRatio;
  }

  create (): void {
    this._restartKey = this._scene.input.keyboard.addKey('R');

    this.createBackground();
    this.createUI();
    this.createScreenOverlay();
    this.createPrepareCounterText();
    this.createTimeoutText();
    this.createRecapModal();

    this.event.emit(EventNames.onCreateFinish);
  }

  private createUI (): void {
    const { height, centerX } = this.screenUtility;
    const textStyle = {
      fontFamily: FontAsset.roboto.key,
      fontStyle: "bold",
      align: "center",
    } as Phaser.GameObjects.TextStyle;

    this._timerText = this._scene.add.text(centerX, height * 0.05, "0", textStyle);
    this._timerText
      .setFontSize(125 * this._screenRatio)
      .setOrigin(0.5, 0)
      .setDepth(LAYER_DEPTH.UI);

    this._scoreText = this._scene.add.text(centerX / 2, this._timerText.getBottomCenter().y, "0", textStyle);
    this._scoreText
      .setFontSize(82 * this._screenRatio)
      .setOrigin(0.5, 0)
      .setDepth(LAYER_DEPTH.UI);

    const opponentScoreText = this._scene.add.text(centerX * 1.5, this._timerText.getBottomCenter().y, "0", textStyle);
    opponentScoreText
      .setFontSize(82 * this._screenRatio)
      .setOrigin(0.5, 0)
      .setDepth(LAYER_DEPTH.UI);

    this._comboTitleText = this._scene.add.text(centerX, this._timerText.getBottomCenter().y * 1.285, "COMBO!", textStyle);
    this._comboTitleText
      .setFontSize(80 * this._screenRatio)
      .setOrigin(0.5, 0)
      .setDepth(LAYER_DEPTH.UI);
    this._comboTitleText.setVisible(false);

    this._comboText = this._scene.add.text(centerX, this._comboTitleText.getBottomCenter().y * 1.015, "+0", textStyle);
    this._comboText
      .setFontSize(120 * this._screenRatio)
      .setOrigin(0.5, 0)
      .setDepth(LAYER_DEPTH.UI);
    this._comboText.setVisible(false);

    const comboTextScale = this._comboText.scale;
    this._comboTextTween = this._scene.tweens.create({
      targets: this._comboText,
      onActive: () => {
        this._comboText.setVisible(true).setActive(true);
        this._comboTitleText.setVisible(true).setActive(true);
      },
      props: {
        scale: { getStart: () => comboTextScale * 1.75, getEnd: () => comboTextScale },
      },
      duration: 150,
      completeDelay: 750,
      onComplete: () => {
        this._comboText.setVisible(false).setActive(false);
        this._comboTitleText.setVisible(false).setActive(false);
      }
    });
  }

  private createBackground (): void {
    const { centerX, centerY, width, height } = this.screenUtility;
    const MAX_WIDTH_DIMENSION = 1080;
    const MAX_HEIGHT_DIMENSION = 1920;
    const COLOR = 0xfafafa;
    this._screenBackground = new Rectangle(this._scene, centerX, centerY, MAX_WIDTH_DIMENSION, MAX_HEIGHT_DIMENSION, COLOR, 0);
    this._screenBackground.transform.setMinPreferredDisplaySize(width, height);
    this._screenRatio = this._screenBackground.transform.displayToOriginalWidthRatio;
  }

  private createScreenOverlay (): void {
    const { width, height } = this.screenUtility;
    this._screenOverlay = new Rectangle(this._scene, 0, 0, width, height, 0x000, 0.5);
    this._screenOverlay.gameObject.setInteractive();
    this._screenOverlay.gameObject.setOrigin(0).setDepth(LAYER_DEPTH.UI);
  }

  private createPrepareCounterText (): void {
    const { centerX, centerY } = this.screenUtility;
    const style = {
      fontSize: `${280 * this._screenRatio}px`,
      fontFamily: FontAsset.roboto.key,
      fontStyle: "bold",
    } as Phaser.GameObjects.TextStyle;

    this._prepareCountText = this._scene.add.text(centerX, centerY * 0.6, "3", style);
    this._prepareCountText.setOrigin(0.5).setDepth(LAYER_DEPTH.UI);

    const originScale = this._prepareCountText.scale;
    this._prepareCountTextTween = this._scene.tweens.create({
      targets: this._prepareCountText,
      props: {
        scale: { getStart: () => originScale, getEnd: () => originScale * 0.65 },
      },
      duration: 600,
      ease: Phaser.Math.Easing.Bounce.Out,
    });
    this._prepareCountTextTween.play();
  }

  private createTimeoutText (): void {
    const { centerX, centerY } = this.screenUtility;
    const style = {
      fontSize: `${185 * this._screenRatio}px`,
      fontFamily: FontAsset.roboto.key,
      fontStyle: "bold",
      align: "center",
    } as Phaser.GameObjects.TextStyle;

    const text = "WAKTU\nHABIS!";
    this._timeoutText = this._scene.add.text(centerX, centerY, text, style);
    this._timeoutText.setOrigin(0.5).setDepth(LAYER_DEPTH.UI);
    this._timeoutText.setVisible(false).setVisible(false);
  }

  private createRecapModal (): void {
    const { centerX, centerY } = this.screenUtility;

    const panel = new Image(this._scene, centerX, centerY, Assets.panel_recap.key);
    panel.transform.setMaxPreferredDisplaySize(
      this.screenUtility.width * 0.925,
      this.screenUtility.height * 0.875
    );

    const localRatio = panel.transform.displayToOriginalWidthRatio;

    const totalScorePos = panel.transform.getDisplayPositionFromCoordinate(0.5, 0.265);
    const totalScoreTextStyle = {
      fontFamily: FontAsset.roboto.key,
      fontSize: `${150 * localRatio}px`,
      align: "center",
    } as Phaser.GameObjects.TextStyle;
    this._totalScoreText = this._scene.add.text(totalScorePos.x, totalScorePos.y, "0", totalScoreTextStyle);
    this._totalScoreText.setOrigin(0.5, 0);

    const homeBtnPos = panel.transform.getDisplayPositionFromCoordinate(0.5, 0.8);
    const style = {
      fontSize: `${50 * localRatio}px`,
      fontFamily: FontAsset.roboto.key,
      align: "center",
      color: "#000",
    } as Phaser.GameObjects.TextStyle;
    const homebtn = new Button(this._scene, homeBtnPos.x, homeBtnPos.y, "LANJUT MAIN", style, {
      height: 100 * localRatio,
      width: 480 * localRatio,
      radius: 50 * localRatio
    });

    homebtn.gameObject.click.once(() => this.event.emit(EventNames.onClickRestart));

    this._modal = this._scene.add.container(0, 0, [ panel.gameObject, this._totalScoreText, homebtn.gameObject.container ]);
    this._modal.setVisible(false).setDepth(LAYER_DEPTH.UI);
  }

  setVisibleOverlay (visible: boolean): void {
    this._screenOverlay.gameObject.setVisible(visible).setActive(visible);
    (visible) ? this._screenOverlay.gameObject.setInteractive() : this._screenOverlay.gameObject.disableInteractive();
  }

  showTimeoutText (): void {
    const originScale = this._timeoutText.scale;
    const onComplete = (): void => {
      this._timeoutText.setVisible(false).setActive(false);
      this.event.emit(EventNames.onShowRecapModal);
    };

    this._scene.tweens.add({
      targets: this._timeoutText,
      onStart: () => {
        this._timeoutText.setVisible(true).setActive(true);
      },
      props: {
        scale: { getStart: () => originScale * 0.75, getEnd: () => originScale }
      },
      completeDelay: 2000,
      ease: Phaser.Math.Easing.Back.Out,
      onComplete,
    });
  }

  showRecapModal (score: number): void {
    this._modal.setVisible(true);
    this._totalScoreText.setText(score.toString());
  }

  showComboText (): void {
    this._comboTextTween.play();
  }

  updateTimerText (value: number): void {
    this._timerText.setText(value.toString());
  }

  updateComboText (value: number): void {
    this._comboText.setText(`+${value}`);
  }

  updateScoreText (value: number): void {
    this._scoreText.setText(value.toString());
  }

  updatePrepareCountText (value: number): void {
    const isCounterEnd = value < 0;
    if (isCounterEnd) {
      this._prepareCountText.setVisible(false).setActive(false);
      return;
    }
    const text = value > 0 ? value.toString() : "POP!";
    this._prepareCountText.setText(text);
    this._prepareCountTextTween.play();
  }

}
