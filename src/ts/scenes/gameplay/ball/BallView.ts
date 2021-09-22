import { Assets } from "../../../collections/AssetGameplay";
import { BaseView } from "../../../modules/core/BaseView";
import { MatterSprite } from "../../../modules/gameobjects/MatterSprite";
import { ScreenUtilController } from "../../../modules/screenutility/ScreenUtilController";
import shortUUID from "short-uuid";
import { CustomTypes } from "../../../../types/custom";

const enum PROP {
  COLLIDE_HISTORY = "COLLIDE_HISTORY",
  CATEGORY = "CATEGORY",
  TRAVERSAL_DATA = "TRAVERSAL_DATA",
};

type CollideHistory = {
	[x: string]: boolean;
}

type TraversalData = {
	neighbourIds: string[];
}

export class BallView implements BaseView {

  event: Phaser.Events.EventEmitter;
  screenUtility: ScreenUtilController;

  private _data: CustomTypes.Gameplay.GeneralData;

  private _ballCollection: CustomTypes.Gameplay.BallCollection;

  constructor (private _scene: Phaser.Scene) {
    this.event = new Phaser.Events.EventEmitter();
    this.screenUtility = ScreenUtilController.getInstance();
  }

  get ballCollection (): CustomTypes.Gameplay.BallCollection {
    return this._ballCollection;
  }

  create (data: CustomTypes.Gameplay.GeneralData): void {
    this._data = data;
    this._ballCollection = {};
  }

  createBall (x: number, y: number): void {
    const textureKey = Assets.ball_a.key;
    const ballScaleModifier = 1.685;

    const ball = new MatterSprite(this._scene, 0, 0, textureKey, 0);
    ball.transform.setToScaleDisplaySize(this._data.screenRatio * ballScaleModifier);

    const gameObject = ball.gameObject;
    gameObject.setName(`${textureKey}_${shortUUID.generate()}`);
    gameObject.setPosition(x, y);

    gameObject.setData(PROP.CATEGORY, textureKey);
    gameObject.setData(PROP.COLLIDE_HISTORY, {} as CollideHistory);
    gameObject.setData(PROP.TRAVERSAL_DATA, {
      neighbourIds: []
    } as TraversalData);

    const density = 0.001;
    const radius = gameObject.displayHeight / 1.8;
    gameObject.setCircle(radius, {
      restitution: 0.35,
      friction: 0.002,
      density
    });
    gameObject.setAngularVelocity(0.015);
  }

}