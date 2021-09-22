import { FontAsset } from "../../collections/AssetFont";
import { Assets } from "../../collections/AssetGameplay";
import { LAYER_DEPTH } from "../../helper/GeneralHelper";
import { BaseView } from "../../modules/core/BaseView";
import { MatterSprite } from "../../modules/gameobjects/MatterSprite";
import { Rectangle } from "../../modules/gameobjects/Rectangle";
import { ScreenUtilController } from "../../modules/screenutility/ScreenUtilController";

export const enum EventNames {
	onClickRestart = "onClickRestart",
	onCreateFinish = "onCreateFinish",
};

const BASE_GRAVITY = 0.006;

export class GameplaySceneView implements BaseView {

	event: Phaser.Events.EventEmitter;
	screenUtility: ScreenUtilController;

	private _restartKey: Phaser.Input.Keyboard.Key;

	private _screenBackground: Rectangle;
	private _screenRatio: number;

	private _timerText: Phaser.GameObjects.Text;
	private _scoreText: Phaser.GameObjects.Text;
	private _comboText: Phaser.GameObjects.Text;

	private _ballHolder: MatterSprite;

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
	  this.createBallHolder();
	  this.createLineWall();

	  this.createUI();

	  const matterWorld = this._scene.matter.world;
	  matterWorld.setGravity(0, 1, BASE_GRAVITY * this._screenRatio);

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

	  this._comboText = this._scene.add.text(centerX, this._timerText.getBottomCenter().y * 1.15, "+0", textStyle);
	  this._comboText
	    .setFontSize(100 * this._screenRatio)
	    .setOrigin(0.5, 0)
	    .setDepth(LAYER_DEPTH.UI);
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

	private createBallHolder (): void {
	  const { centerX, height } = this.screenUtility;
	  const shapeConfig = {
	    shape : Reflect.get(this._scene.cache.json.get(Assets.holder_json.key), "holder"),
	  } as Phaser.Types.Physics.Matter.MatterBodyConfig;
	  this._ballHolder = new MatterSprite(this._scene, 0, 0, Assets.holder.key, 0, shapeConfig);
	  this._ballHolder.transform.setToScaleDisplaySize(this._screenRatio);
	  this._scene.matter.alignBody(this._ballHolder.gameObject, centerX, height, Phaser.Display.Align.BOTTOM_CENTER);
	}

	private createLineWall (): void {
	  const { height } = this.screenUtility;

	  const addDegToRad = (deg: number): number => {
	    return deg * (Math.PI / 180);
	  };

	  const leftWallPos = this._ballHolder.transform.getDisplayPositionFromCoordinate(0.25, 0);
	  const leftWall = this._scene.matter.add.rectangle(0, 0, (64 * this._screenRatio), height / 3, { isStatic: true, angle: addDegToRad(-15) });
	  this._scene.matter.alignBody(leftWall, leftWallPos.x, leftWallPos.y, Phaser.Display.Align.BOTTOM_RIGHT);

	  const rightWallPos = this._ballHolder.transform.getDisplayPositionFromCoordinate(0.925, 0);
	  const rightWall = this._scene.matter.add.rectangle(0, 0, (64 * this._screenRatio), height / 3, { isStatic: true, angle: addDegToRad(15) });
	  this._scene.matter.alignBody(rightWall, rightWallPos.x, rightWallPos.y, Phaser.Display.Align.BOTTOM_RIGHT);
	}

	updateTimerText (value: number): void {
	  this._timerText.setText(value.toString());
	}

	updateComboText (value: number): void {
	  this._comboText.setText(`+${value}`);
	}

}