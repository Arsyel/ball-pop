import { CustomTypes } from "../../../../types/custom";
import { BallView, EvenNames } from "./BallView";

type OnTapBall = (targetedDestroyBallIds: string[]) => void;
type OnDestroy = (removedLiveBall: number) => void;

export class BallController {

  private _view: BallView;

  constructor (scene: Phaser.Scene) {
    this._view = new BallView(scene);
  }

  init (data: CustomTypes.Gameplay.GeneralData): void {
    this._view.create(data);
  }

  spawnBall (x: number, y: number): void {
    this._view.createBall(x, y);
  }

  destroy (targetedDestroyBallIds: string[]): void {
    targetedDestroyBallIds.forEach((id) => {
      console.assert(this._view.ballCollection[id], `Undefined id: ${id}`);
      this._view.ballCollection[id].destroy();
      if (Reflect.has(this._view.ballCollection, id)) {
        Reflect.deleteProperty(this._view.ballCollection, id);
      }
    });
  }

  disableTapBall (): void {
    this._view.disableTap = true;
  }

  enableTapBall (): void {
    this._view.disableTap = false;
  }

  onTapBall (event: OnTapBall): void {
    this._view.event.on(EvenNames.onTapBall, event);
  }

  onDestroy (event: OnDestroy): void {
    this._view.event.on(EvenNames.onDestroy, event);
  }

}