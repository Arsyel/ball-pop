import { AudioController } from "../../modules/audio/AudioController";
import { EventNames, GameplaySceneView } from "./GameplaySceneView";
import { DebugController } from "./debug/DebugController";
import { SceneInfo } from "../../info/SceneInfo";
import { CustomTypes } from "../../../types/custom";
import { GameController } from "./game/GameController";
import { BallController } from "./ball/BallController";
import { GameState } from "../../info/GameInfo";

type OnCreateFinish = CustomTypes.General.FunctionWithParams;

export class GameplaySceneController extends Phaser.Scene {

	view: GameplaySceneView;
	audioController: AudioController;
	debugController: DebugController;
  gameController: GameController;
  ballController: BallController;

  constructor () {
    super({key: SceneInfo.GAMEPLAY.key});
  }

  init (): void {
    this.view = new GameplaySceneView(this);
    this.audioController = AudioController.getInstance();
    this.debugController = new DebugController(this);
    this.gameController = new GameController();
    this.ballController = new BallController(this);

    this.gameController.onInitialization(({ timer, maxLiveBall }) => {
      this.view.updateTimerText(timer);
      this.ballController.init({ screenRatio: this.view.screenRatio });
      this.ballController.enableTapBall();
    });

    this.gameController.onTimerChange((timer) => {
      this.view.updateTimerText(timer);
    });

    this.gameController.onTimeout(() => {
      this.gameController.setGameoverState();
      this.ballController.disableTapBall();
    });

    this.gameController.onComboActive((combo) => {
      this.view.updateComboText(combo);
    });

    this.gameController.onNeedLiveBall(() => {
      const slightLeft = this.scale.width * 0.3;
      const slightRight = this.scale.width * 0.675;
      const x: number = Phaser.Utils.Array.GetRandom([this.scale.width/2, slightLeft, slightRight]);
      this.ballController.spawnBall(x, 0);
    });

    this.ballController.onDestroy((removedLiveBall) => {
      this.gameController.reduceLiveBall(removedLiveBall);
    });

    this.ballController.onTapBall((targetedDestroyBallIds) => {
      if (this.gameController.state !== GameState.PLAYING) return;

      this.ballController.destroy(targetedDestroyBallIds);

      this.gameController.addCombo();
      this.gameController.addScore(targetedDestroyBallIds.length);

      this.view.updateScoreText(this.gameController.totalScore);
    });

    this.onClickRestart(() => {
      this.scene.start(SceneInfo.GAMEPLAY.key);
    });

    this.onCreateFinish((uiView) => {
      this.debugController.init();
      this.gameController.init({
        timer: 60,
        maxLiveBall: 40,
      });

      this.debugController.show(true);
    });
  }

  create (): void {
    this.view.create();
  }

  update (time: number, dt: number): void {
    if (Phaser.Input.Keyboard.JustUp(this.view.restartKey)) {
      this.view.event.emit(EventNames.onClickRestart);
    }
    this.gameController.update(time, dt);
  }

  onClickRestart (event: Function): void {
    this.view.event.on(EventNames.onClickRestart, event);
  }

  onCreateFinish (event: OnCreateFinish): void {
    this.view.event.once(EventNames.onCreateFinish, event);
  }

}