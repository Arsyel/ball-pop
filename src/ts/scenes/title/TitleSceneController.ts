import { EventNames, TitleSceneView } from "./TitleSceneView";

import { CustomTypes } from "../../../types/custom";
import { DebugController } from "../gameplay/debug/DebugController";
import { SceneInfo } from "../../info/SceneInfo";

type OnCreateFinish = CustomTypes.General.FunctionWithParams;
type OnClickPlay = CustomTypes.General.FunctionNoParam;
type OnClickBack = CustomTypes.General.FunctionNoParam;
type OnClickShare = CustomTypes.General.FunctionNoParam;
type OnClickAudio = CustomTypes.General.FunctionWithParams;
type OnChangeScreen = (screenState: CustomTypes.Title.ScreenState) => void;

export class TitleSceneController extends Phaser.Scene {

  view: TitleSceneView;
  debugController: DebugController;

  constructor () {
    super({key: SceneInfo.TITLE.key});
  }

  init (): void {
    this.view = new TitleSceneView(this);
    this.debugController = new DebugController(this);

    this.onClickPlay(() => {
      this.scene.start(SceneInfo.GAMEPLAY.key);
    });

    this.onClickBack(() => {
      console.log("Exit confirm?");
    });

    this.onClickAudio((isAudioOn: boolean) => {
      console.log({ isAudioOn });
    });

    this.onClickShare(() => {});

    this.onChangeScreen((screenState) => {
      this.view.showScreen(screenState);
    });

    this.onCreateFinish(() => {
      this.debugController.init();
      this.debugController.show(true);
    });
  }

  create (): void {
    this.view.create();
  }

  update (time: number, dt: number): void {}

  onClickPlay (event: OnClickPlay): void {
    this.view.event.on(EventNames.onClickPlay, event);
  }

  onClickBack (event: OnClickBack): void {
    this.view.event.on(EventNames.onClickBack, event);
  }

  onClickAudio (event: OnClickAudio): void {
    this.view.event.on(EventNames.onClickAudio, event);
  }

  onClickShare (event: OnClickShare): void {
    this.view.event.on(EventNames.onClickShare, event);
  }

  onChangeScreen (event: OnChangeScreen): void {
    this.view.event.on(EventNames.onChangeScreen, event);
  }

  onCreateFinish (event: OnCreateFinish): void {
    this.view.event.once(EventNames.onCreateFinish, event);
  }

}