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

export const enum EvenNames {
  onTapBall = "onTapBall",
  onDestroy = "onDestroy",
};

type CollideHistory = {
	[x: string]: boolean;
}

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
    this.disableTap = true;
  }

  createBall (x: number, y: number, bombType?: string): void {
    const isBombType = !!bombType;
    const textures = [Assets.ball_a.key, Assets.ball_b.key, Assets.ball_c.key];
    const textureKey = isBombType ? bombType : Phaser.Utils.Array.GetRandom(textures);
    const ballScaleModifier = isBombType ? 1.85 : 1.695;

    const ball = new MatterSprite(this._scene, 0, 0, textureKey, 0);
    ball.transform.setToScaleDisplaySize(this._data.screenRatio * ballScaleModifier);

    const gameObject = ball.gameObject;
    gameObject.setName(`${textureKey}_${shortUUID.generate()}`);
    gameObject.setPosition(x, y);

    gameObject.setData(PROP.CATEGORY, textureKey);
    gameObject.setData(PROP.COLLIDE_HISTORY, {} as CollideHistory);
    gameObject.setData(PROP.TRAVERSAL_DATA, {
      similarNeighbourIds: [],
      neighbourIds: [],
    } as TraversalData);

    const density = 0.001;
    const radiusModifier = isBombType ? 2 : 1.8;
    const radius = gameObject.displayHeight / radiusModifier;
    gameObject.setCircle(radius, {
      restitution: 0.35,
      friction: 0.002,
      density
    });
    gameObject.setAngularVelocity(0.015);

    // TODO: Move this to controler!
    this.registerColliderEvent(gameObject);
    this.registerOnClickAction(gameObject, bombType);
    this.setBallOnCollection(gameObject);
  }

  private setBallOnCollection (sprite: Phaser.Physics.Matter.Sprite): void {
    this._ballCollection = {
      ...this._ballCollection,
      [sprite.name]: sprite
    };
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
      const excludeList = [ gameObject.name ];
      const selectedIdsToDestroy = this.traverseBallNeighbours(gameObject, excludeList);

      const lessThanThreeMatch = selectedIdsToDestroy.length < 3;
      if (lessThanThreeMatch) return;

      const isChainedBall = selectedIdsToDestroy.length > 4;
      const ballId = selectedIdsToDestroy[0];
      if (isChainedBall) {
        const targetBallPos = {
          x: this.ballCollection[ballId].x,
          y: this.ballCollection[ballId].y,
        };

        this.createBall(targetBallPos.x, targetBallPos.y, Assets.ball_bomb_a.key);
      }

      dispatchOnTapBall(selectedIdsToDestroy);
      const totalDestroyed = isChainedBall ? (selectedIdsToDestroy.length - 1) : selectedIdsToDestroy.length;
      this.event.emit(EvenNames.onDestroy, totalDestroyed);
    });
  }

  private registerColliderEvent (sprite: Phaser.Physics.Matter.Sprite): void {
    const onCollideCallback = (data: Phaser.Types.Physics.Matter.MatterCollisionData, isCollide: boolean): void => {
      if (sprite.name !== data.bodyA.gameObject?.name) return;

      const goA = data.bodyA.gameObject;
      const goB = data.bodyB.gameObject;

      const hasName = goA?.name && goB?.name;
      if (!hasName) return;

      const currCollideHistoryA: object = goA.getData(PROP.COLLIDE_HISTORY);
      const newHistoryA = {
        ...currCollideHistoryA,
        [goB.name]: isCollide,
      };
      goA.setData(PROP.COLLIDE_HISTORY, newHistoryA);
      goA.setData(PROP.TRAVERSAL_DATA, {
        similarNeighbourIds: this.getSimilarNeighbourIds(goA),
        neighbourIds: this.getNeighbourIds(goA),
      } as TraversalData);

      const currCollideHistoryB: object = goB.getData(PROP.COLLIDE_HISTORY);
      const newHistoryB = {
        ...currCollideHistoryB,
        [goA.name]: isCollide,
      };
      goB.setData(PROP.COLLIDE_HISTORY, newHistoryB);
      goB.setData(PROP.TRAVERSAL_DATA, {
        similarNeighbourIds: this.getSimilarNeighbourIds(goB),
        neighbourIds: this.getNeighbourIds(goB),
      } as TraversalData);
    };

    sprite.setOnCollide((data: Phaser.Types.Physics.Matter.MatterCollisionData) => onCollideCallback(data, true));
    sprite.setOnCollideActive((data: Phaser.Types.Physics.Matter.MatterCollisionData) => onCollideCallback(data, true));
    sprite.setOnCollideEnd((data: Phaser.Types.Physics.Matter.MatterCollisionData) => onCollideCallback(data, false));
  }

  private getSimilarNeighbourIds (gameObject: Phaser.GameObjects.GameObject): string[] {
    const history: CollideHistory = gameObject.getData(PROP.COLLIDE_HISTORY);
    const sameCategoryIds = Object.keys(history)
      .filter((ballId) => this._ballCollection[ballId] && (this._ballCollection[ballId].getData(PROP.CATEGORY) === gameObject.getData(PROP.CATEGORY)));
    return sameCategoryIds.filter((id) => history[id]);
  }

  private getNeighbourIds (gameObject: Phaser.GameObjects.GameObject): string[] {
    const history: CollideHistory = gameObject.getData(PROP.COLLIDE_HISTORY);
    const touchedBallAreaIds = Object.keys(history).filter((id) => history[id] && this._ballCollection[id]);
    touchedBallAreaIds.unshift(gameObject.name);
    return touchedBallAreaIds;
  }

  private traverseBallNeighbours (gameObject: Phaser.GameObjects.GameObject, exclude: string[]): string[] {
    const { similarNeighbourIds } = gameObject.getData(PROP.TRAVERSAL_DATA) as TraversalData;

    if (!similarNeighbourIds || similarNeighbourIds.length <= 0) {
      return [ gameObject.name ];
    }
    else {
      const data = [ gameObject.name ];
      for (let index = 0; index < similarNeighbourIds.length; index++) {
        const id = similarNeighbourIds[index];
        const targetSprite = this._ballCollection[id];

        if (exclude.includes(targetSprite.name)) continue;
        exclude.push(id);

        data.push(...this.traverseBallNeighbours(targetSprite, exclude));
      }

      return data;
    }
  }

}