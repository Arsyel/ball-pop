import { CustomTypes } from "../../../../types/custom";
import { WorldPhysicView } from "./WorldPhysicView";

export class WorldPhysicControler {

  private _view: WorldPhysicView;

  constructor (scene: Phaser.Scene) {
    this._view = new WorldPhysicView(scene);
  }

  init (data: CustomTypes.Gameplay.GeneralData): void {
    this._view.create(data);
  }

}