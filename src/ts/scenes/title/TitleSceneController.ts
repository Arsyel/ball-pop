import { EventNames, TitleSceneView } from "./TitleSceneView";

import { APIController } from "../../modules/api/APIController";
import { BaseAPIInstance } from "../../modules/api/BaseAPIInstances";
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
  apiController: BaseAPIInstance;

  constructor () {
    super({key: SceneInfo.TITLE.key});
  }

  init (): void {
    this.view = new TitleSceneView(this);
    this.debugController = new DebugController(this);
    this.apiController = APIController.getInstance().getApi();

    this.apiController.onError((errData) => {
      console.log("Err origin", errData.origin);
      console.log("All error", errData.err);
    });

    this.apiController.onGetTestAPICall((data: unknown) => {
      console.log("API Data:", data);
    });

    this.apiController.onGetProfile((data) => {
      console.log("Profile:", data);
    });

    this.apiController.onGetGameMilestonesList((data) => {
      console.log("GameMilestonesList:", data);
    });

    this.apiController.onGetGameUserData((data) => {
      console.log("GameUserData:", data);
    });

    this.apiController.onGetGameDetail((data) => {
      console.log("GameDetail:", data);
    });

    this.apiController.onGetGameStart((data) => {
      console.log("GameStart:", data);
      this.scene.start(SceneInfo.GAMEPLAY.key);
    });

    this.onClickPlay(() => {
      this.apiController.getGameStart();
    });

    this.onClickBack(() => {
      console.log("Exit confirm?");
    });

    this.onClickAudio((isAudioOn: boolean) => {
      console.log({ isAudioOn });
    });

    this.onClickShare(() => {
      // FIXME Test post api
      this.apiController.postTestAPICall();
    });

    this.onChangeScreen((screenState) => {
      this.view.showScreen(screenState);
    });

    this.onCreateFinish(() => {
      this.debugController.init();
      this.debugController.show(true);

      // API Call
      this.apiController.getTestAPICall();

      this.apiController.getProfile();
      this.apiController.getGameMilestonesList();
      this.apiController.getGameUserData();
      this.apiController.getGameDetail();
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