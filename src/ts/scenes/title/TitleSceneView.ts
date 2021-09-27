import { Assets } from "../../collections/AssetsTitle";
import { BaseView } from "../../modules/core/BaseView";
import { ButtonUIView } from "./ui/ButtonUIView";
import { CustomTypes } from "../../../types/custom";
import { FontAsset } from "../../collections/AssetFont";
import { InfoPanelUIView } from "./ui/InfoPanelUIView";
import { LAYER_DEPTH } from "../../helper/GeneralHelper";
import { Rectangle } from "../../modules/gameobjects/Rectangle";
import { ScreenUtilController } from "../../modules/screenutility/ScreenUtilController";
import { Sprite } from "../../modules/gameobjects/Sprite";

export const enum EventNames {
	onClickPlay = "onClickPlay",
	onClickBack = "onClickBack",
	onClickAudio = "onClickAudio",
  onClickShare = "onClickShare",
  onChangeScreen = "onChangeScreen",
	onCreateFinish = "onCreateFinish",
};

export class TitleSceneView implements BaseView {

  event: Phaser.Events.EventEmitter;
  screenUtility: ScreenUtilController;

  private _screenBackground: Rectangle;
  private _screenRatio: number;

  private _screenState: CustomTypes.Title.ScreenState;

  private _infoPanelUI: InfoPanelUIView;

  private _titleText: Phaser.GameObjects.Text;
  private _titleTween: Phaser.Tweens.Tween;

  private _titleContainer: Phaser.GameObjects.Container;

  private _playBtn: Sprite;

  constructor (private _scene: Phaser.Scene) {
    this.screenUtility = ScreenUtilController.getInstance();
    this.event = new Phaser.Events.EventEmitter();
  }

  create (): void {
    this._screenState = "HOME_SCREEN";

    this.createBackground();
    this.createTitleText();
    this.createPlayBtn();

    const backBtn = new ButtonUIView(this._scene, {
      texture: Assets.back_btn.key,
      ratio: this._screenRatio,
      onClick: () => {
        if (this._screenState === "HOME_SCREEN") {
          this.event.emit(EventNames.onClickBack);
        }
        else if (this._screenState === "INFO_SCREEN") {
          this.event.emit(EventNames.onChangeScreen, "HOME_SCREEN");
        }
      },
      position: { x: this.screenUtility.width * 0.015, y: this.screenUtility.height * 0.01 }
    });
    backBtn.gameObject.setOrigin(0, 0);

    const audioTextures = [ Assets.mute_btn.key, Assets.unmute_btn.key ];
    const audioBtn = new ButtonUIView(this._scene, {
      texture: audioTextures[1],
      ratio: this._screenRatio,
      onClick: (gameObject) => {
        const isAudioOn = gameObject.getData("IS_AUDIO_ON") as boolean;
        const updateState = isAudioOn ? 0 : 1;
        gameObject.setTexture(audioTextures[updateState]);
        this.event.emit(EventNames.onClickAudio, !!updateState);
        gameObject.setData("IS_AUDIO_ON", !!updateState);
      },
      position: { x: this.screenUtility.width * 0.975, y: this.screenUtility.height * 0.01 }
    });
    audioBtn.gameObject.setData("IS_AUDIO_ON", true);
    audioBtn.gameObject.setOrigin(1, 0);

    const shareBtn = new ButtonUIView(this._scene, {
      texture: Assets.share_btn.key,
      ratio: this._screenRatio,
      onClick: () => this.event.emit(EventNames.onClickShare),
      position: { x: audioBtn.gameObject.getLeftCenter().x * 0.975, y: this.screenUtility.height * 0.01 }
    });
    shareBtn.gameObject.setOrigin(1, 0);

    const infoBtn = new ButtonUIView(this._scene, {
      texture: Assets.info_btn.key,
      ratio: this._screenRatio,
      onClick: () => {
        this.event.emit(EventNames.onChangeScreen, "INFO_SCREEN");
      },
      position: { x: this.screenUtility.width * 0.975, y: audioBtn.gameObject.getBottomCenter().y * 1.225 }
    });
    infoBtn.gameObject.setOrigin(1, 0);

    const leaderboardBtn = new ButtonUIView(this._scene, {
      texture: Assets.thropy_btn.key,
      ratio: this._screenRatio,
      onClick: () => {},
      position: { x: this.screenUtility.width * 0.975, y: infoBtn.gameObject.getBottomCenter().y * 1.225 }
    });
    leaderboardBtn.gameObject.setOrigin(1, 0);

    const rewardBtn = new ButtonUIView(this._scene, {
      texture: Assets.reward_btn.key,
      ratio: this._screenRatio,
      onClick: () => {},
      position: { x: this.screenUtility.width * 0.975, y: leaderboardBtn.gameObject.getBottomCenter().y * 1.015 }
    });
    rewardBtn.gameObject.setOrigin(1, 0);

    this._infoPanelUI = new InfoPanelUIView(this._scene, {
      ratio: this._screenRatio,
      text: "A. Syarat dan ketentuan Games Ball Pop\n" +
        "1. Games Ball Pop adalah rangkaian permainan yang dapat diikuti oleh seluruh Peserta di Tokopedia.\n" +
        "2. Peserta adalah Pengguna yang telah terdaftar dan pada Situs/Aplikasi Tokopedia.\n" +
        "3. Games Ball Pop akan berlangsung setiap harinya selama periode berlangsung pada pukul:",
      position: { x: this.screenUtility.centerX, y: 0 }
    });

    this._titleContainer = this._scene.add.container(0, 0, [
      this._titleText,
      this._playBtn.gameObject,
      leaderboardBtn.gameObject,
      shareBtn.gameObject,
      rewardBtn.gameObject,
      audioBtn.gameObject,
      infoBtn.gameObject,
    ]).setDepth(LAYER_DEPTH.UI);

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
    this._titleText = this._scene.add.text(centerX, centerY, title, style);
    this._titleText.setOrigin(0.5).setDepth(LAYER_DEPTH.UI);

    this._titleTween = this._scene.tweens.create({
      targets: [ this._titleText ],
      props: {
        y: { getStart: () => (this.screenUtility.height + this._titleText.displayHeight), getEnd: () => centerY }
      },
      duration: 300,
      ease: Phaser.Math.Easing.Back.Out,
    });
    this._titleTween.play();
  }

  private createPlayBtn (): void {
    const { centerX, height } = this.screenUtility;
    this._playBtn = new Sprite(this._scene, centerX, height * 0.8, Assets.play_btn.key);
    this._playBtn.transform.setToScaleDisplaySize(this._screenRatio);
    this._playBtn.gameObject.setDepth(LAYER_DEPTH.UI);

    const onClick = (): void => {
      this.event.emit(EventNames.onClickPlay);
    };

    const playBtnScale = this._playBtn.gameObject.scale;
    const playBtnTween = this._scene.tweens.create({
      targets: [this._playBtn.gameObject],
      props: {
        scale: { getStart: () => playBtnScale, getEnd: () => playBtnScale * 0.98 }
      },
      duration: 60,
      yoyo: true,
      onComplete: onClick
    });

    this._playBtn.gameObject.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
      if (playBtnTween.isPlaying()) return;
      playBtnTween.play();
    });
  }

  showScreen (state: CustomTypes.Title.ScreenState): void {
    if (state === "INFO_SCREEN") {
      this._titleContainer.setVisible(false);
      this._infoPanelUI.show();
    }
    else if (state === "HOME_SCREEN") {
      this._titleContainer.setVisible(true);
      this._titleTween.play();
      this._infoPanelUI.hide();
    }
    this._screenState = state;
  }

}