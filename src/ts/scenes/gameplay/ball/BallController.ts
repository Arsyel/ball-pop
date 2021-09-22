import { CustomTypes } from "../../../../types/custom";
import { MatterSprite } from "../../../modules/gameobjects/MatterSprite";
import { BallView } from "./BallView";

export class BallController {

  private _view: BallView;

  constructor (scene: Phaser.Scene) {
    this._view = new BallView(scene);
  }

  init (data: CustomTypes.Gameplay.GeneralData): void {
    this._view.create(data);
  }

  getBallCollection (id: string): MatterSprite {
    return this._view.ballCollection[id];
  }

  spawnBall (x: number, y: number): void {
    this._view.createBall(x, y);
  }

}