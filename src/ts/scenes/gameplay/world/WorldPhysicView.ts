import { Assets } from "../../../collections/AssetGameplay";
import { BaseView } from "../../../modules/core/BaseView";
import { CustomTypes } from "../../../../types/custom";
import { GetObjectProp } from "../../../helper/GeneralHelper";
import { MatterSprite } from "../../../modules/gameobjects/MatterSprite";
import { ScreenUtilController } from "../../../modules/screenutility/ScreenUtilController";

const BASE_GRAVITY = 0.0058;

export class WorldPhysicView implements BaseView {

  event: Phaser.Events.EventEmitter;
  screenUtility: ScreenUtilController;

  private _data: CustomTypes.Gameplay.GeneralData;
  private _ballHolder: MatterSprite;

  constructor (private _scene: Phaser.Scene) {
    this.event = new Phaser.Events.EventEmitter();
    this.screenUtility = ScreenUtilController.getInstance();
  }

  create (data: CustomTypes.Gameplay.GeneralData): void {
    this._data = data;
    this.createBallHolder();
    this.createLineWall();

    const matterWorld = this._scene.matter.world;
    matterWorld.setGravity(0, 1, BASE_GRAVITY * data.screenRatio);
  }

  private createBallHolder (): void {
    const { centerX, height } = this.screenUtility;
    const shapeConfig = {
      shape : GetObjectProp(this._scene.cache.json.get(Assets.holder_json.key), "holder"),
    } as Phaser.Types.Physics.Matter.MatterBodyConfig;
    this._ballHolder = new MatterSprite(this._scene, 0, 0, Assets.holder.key, 0, shapeConfig);
    this._ballHolder.transform.setToScaleDisplaySize(this._data.screenRatio);
    this._scene.matter.alignBody(this._ballHolder.gameObject, centerX, height, Phaser.Display.Align.BOTTOM_CENTER);
  }

  private createLineWall (): void {
    const { height } = this.screenUtility;

    const addDegToRad = (deg: number): number => {
      return deg * (Math.PI / 180);
    };

    const leftWallPos = this._ballHolder.transform.getDisplayPositionFromCoordinate(0.25, 0);
    const leftWall = this._scene.matter.add.rectangle(0, 0, (64 * this._data.screenRatio), height / 3, { isStatic: true, angle: addDegToRad(-15) });
    this._scene.matter.alignBody(leftWall, leftWallPos.x, leftWallPos.y, Phaser.Display.Align.BOTTOM_RIGHT);

    const rightWallPos = this._ballHolder.transform.getDisplayPositionFromCoordinate(0.925, 0);
    const rightWall = this._scene.matter.add.rectangle(0, 0, (64 * this._data.screenRatio), height / 3, { isStatic: true, angle: addDegToRad(15) });
    this._scene.matter.alignBody(rightWall, rightWallPos.x, rightWallPos.y, Phaser.Display.Align.BOTTOM_RIGHT);
  }

}