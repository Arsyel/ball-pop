import { Assets } from "../../../collections/AssetGameplay";
import { BaseView } from "../../../modules/core/BaseView";
import { CustomTypes } from "../../../../types/custom";
import { MatterSprite } from "../../../modules/gameobjects/MatterSprite";
import { ScreenUtilController } from "../../../modules/screenutility/ScreenUtilController";
import shortUUID from "short-uuid";

const enum PROP {
  CATEGORY = "CATEGORY",
  TRAVERSAL_DATA = "TRAVERSAL_DATA",
};

export const enum EvenNames {
  onTapBall = "onTapBall",
  onDestroy = "onDestroy",
};

type TraversalData = {
  similarNeighbourIds: string[];
  neighbourIds: string[],
}

export class BallView implements BaseView {

  event: Phaser.Events.EventEmitter;
  screenUtility: ScreenUtilController;

  disableTap: boolean;

  private _data: CustomTypes.Gameplay.GeneralData;

  private _ballCollection: CustomTypes.Gameplay.BallCollection;

  private _ballColliderHistory: Map<string, Set<string>>;

  constructor (private _scene: Phaser.Scene) {
    this.event = new Phaser.Events.EventEmitter();
    this.screenUtility = ScreenUtilController.getInstance();
  }

  get ballCollection (): CustomTypes.Gameplay.BallCollection {
    return this._ballCollection;
  }

  get ballColliderHistory (): Map<string, Set<string>> {
    return this._ballColliderHistory;
  }

  create (data: CustomTypes.Gameplay.GeneralData): void {
    this._data = data;
    this._ballCollection = new Map();
    this.disableTap = true;

    this._ballColliderHistory = new Map();
  }

  createBall (x: number, y: number, bombType?: string): void {
    const isBombType = !!bombType;
    const textures = [Assets.ball_a.key, Assets.ball_b.key, Assets.ball_c.key, Assets.ball_d.key];
    const textureKey = isBombType ? bombType : Phaser.Utils.Array.GetRandom(textures);
    const ballScaleModifier = isBombType ? 1.85 : 1.695;

    const ball = new MatterSprite(this._scene, 0, 0, textureKey, 0);
    ball.transform.setToScaleDisplaySize(this._data.screenRatio * ballScaleModifier);

    const gameObject = ball.gameObject;
    gameObject.setName(`${textureKey}_${shortUUID.generate()}`);
    gameObject.setPosition(x, y);
    gameObject.setData(PROP.CATEGORY, textureKey);

    this.setData(gameObject);

    const density = 0.001;
    const radiusModifier = isBombType ? 2 : 1.8;
    const radius = gameObject.displayHeight / radiusModifier;
    gameObject.setCircle(radius, {
      restitution: 0.03,
      friction: 0.01,
      density
    });
    gameObject.setAngularVelocity(0.015);

    this.registerColliderEvent(gameObject);
    this.registerOnClickAction(gameObject, bombType);

    this.setBallOnCollection(gameObject);
  }

  private setData (gameObject: Phaser.GameObjects.GameObject): void {
    this._ballColliderHistory.set(gameObject.name, new Set());

    gameObject.setData(PROP.TRAVERSAL_DATA, {
      similarNeighbourIds: [],
      neighbourIds: [],
    } as TraversalData);
  }

  private setBallOnCollection (sprite: Phaser.Physics.Matter.Sprite): void {
    this._ballCollection.set(sprite.name, sprite);
  }

  private registerOnClickAction (gameObject: Phaser.GameObjects.GameObject, bombType?: string): void {
    const dispatchOnTapBall = (selectedIds: string[]): void => {
      this.event.emit(EvenNames.onTapBall, selectedIds);
    };

    gameObject.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
      if (this.disableTap) return;

      if (bombType === Assets.ball_bomb_a.key) {
        const { neighbourIds } = gameObject.getData(PROP.TRAVERSAL_DATA) as TraversalData;

        dispatchOnTapBall(neighbourIds);
        this.event.emit(EvenNames.onDestroy, neighbourIds.length);
        return;
      }

      // Normal condition
      const selectedIdsToDestroy = this.traversalDFS(gameObject.name);

      const lessThanThreeMatch = selectedIdsToDestroy.length < 3;
      if (lessThanThreeMatch) return;

      const isChainedBall = selectedIdsToDestroy.length > 4;
      const ballId = selectedIdsToDestroy[0];
      if (isChainedBall) {
        const targetBallPos = {
          x: this.ballCollection.get(ballId)!.x,
          y: this.ballCollection.get(ballId)!.y,
        };

        const bombType = Assets.ball_bomb_a.key;
        this.createBall(targetBallPos.x, targetBallPos.y, bombType);
      }

      dispatchOnTapBall(selectedIdsToDestroy);
      const totalDestroyed = isChainedBall ? (selectedIdsToDestroy.length - 1) : selectedIdsToDestroy.length;
      this.event.emit(EvenNames.onDestroy, totalDestroyed);
    });
  }

  private onCollideCallback (currentId: string, data: Phaser.Types.Physics.Matter.MatterCollisionData, isCollide: boolean): void {
    if (currentId !== data.bodyA.gameObject?.name) return;

    const goA = data.bodyA.gameObject;
    const goB = data.bodyB.gameObject;

    const hasId = goA?.name && goB?.name;
    if (!hasId) return;

    const ballAHistory = this._ballColliderHistory.get(goA.name)!;
    (isCollide)
      ? ballAHistory.add(goB.name)
      : ballAHistory.delete(goB.name);

    goA.setData(PROP.TRAVERSAL_DATA, {
      similarNeighbourIds: this.getSimilarNeighbourIds(goA),
      neighbourIds: this.getNeighbourIds(goA),
    } as TraversalData);

    const ballBHistory = this._ballColliderHistory.get(goB.name)!;
    (isCollide)
      ? ballBHistory.add(goA.name)
      : ballBHistory.delete(goA.name);

    goB.setData(PROP.TRAVERSAL_DATA, {
      similarNeighbourIds: this.getSimilarNeighbourIds(goB),
      neighbourIds: this.getNeighbourIds(goB),
    } as TraversalData);
  };

  private registerColliderEvent (sprite: Phaser.Physics.Matter.Sprite): void {
    sprite.setOnCollide((data: Phaser.Types.Physics.Matter.MatterCollisionData) => this.onCollideCallback(sprite.name, data, true));
    sprite.setOnCollideActive((data: Phaser.Types.Physics.Matter.MatterCollisionData) => this.onCollideCallback(sprite.name, data, true));
    sprite.setOnCollideEnd((data: Phaser.Types.Physics.Matter.MatterCollisionData) => this.onCollideCallback(sprite.name, data, false));
  }

  private getSimilarNeighbourIds (gameObject: Phaser.GameObjects.GameObject): string[] {
    const history = this._ballColliderHistory.get(gameObject.name)!;
    const sameCategoryIds: string[] = [];
    for (const ballId of history) {
      if (this._ballCollection.has(ballId) && (this._ballCollection.get(ballId)!.getData(PROP.CATEGORY) === gameObject.getData(PROP.CATEGORY))) {
        sameCategoryIds.push(ballId);
      }
    }
    return sameCategoryIds;
  }

  private getNeighbourIds (gameObject: Phaser.GameObjects.GameObject): string[] {
    const history = this._ballColliderHistory.get(gameObject.name)!;
    const touchedBallAreaIds: string[] = [ gameObject.name ];
    for (const ballId of history) {
      if (this._ballCollection.has(ballId)) {
        touchedBallAreaIds.push(ballId);
      }
    }
    return touchedBallAreaIds;
  }

  private traversalDFS (ballId: string, visited = new Set(), ballIds: string[] = []): string[] {
    ballIds.push(ballId);
    visited.add(ballId);

    const { similarNeighbourIds } = this._ballCollection.get(ballId)!.getData(PROP.TRAVERSAL_DATA) as TraversalData;
    for (let index = 0; index < similarNeighbourIds.length; index++) {
      const targetId = similarNeighbourIds[index];
      if (visited.has(targetId)) continue;

      this.traversalDFS(targetId, visited, ballIds);
    }

    return ballIds;
  }

}