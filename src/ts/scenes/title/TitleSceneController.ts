import { CustomTypes } from "../../../types/custom";
import { SceneInfo } from "../../info/SceneInfo";
import { EventNames, TitleSceneView } from "./TitleSceneView";

type OnClickPlay = CustomTypes.General.FunctionNoParam;
type OnCreateFinish = CustomTypes.General.FunctionWithParams;

export class TitleSceneController extends Phaser.Scene {

  view: TitleSceneView;

  constructor () {
    super({key: SceneInfo.TITLE.key});
  }

  init (): void {
    this.view = new TitleSceneView(this);

    this.onClickPlay(() => {
      this.scene.start(SceneInfo.GAMEPLAY.key);
    });

    this.onCreateFinish(() => {});
  }

  create (): void {
    this.view.create();
  }

  update (time: number, dt: number): void {}

  onClickPlay (event: OnClickPlay): void {
    this.view.event.on(EventNames.onClickPlay, event);
  }

  onCreateFinish (event: OnCreateFinish): void {
    this.view.event.once(EventNames.onCreateFinish, event);
  }

}