import { EventNames, GameplaySceneView } from "./GameplaySceneView";

import { AudioController } from "../../modules/audio/AudioController";
import { BallController } from "./ball/BallController";
import { CustomTypes } from "../../../types/custom";
import { GameController } from "./game/GameController";
import { GameState } from "../../info/GameInfo";
import { SceneInfo } from "../../info/SceneInfo";

type OnClickRestart = CustomTypes.General.FunctionNoParam;
type OnShowRecapModal = CustomTypes.General.FunctionNoParam;
type OnCreateFinish = CustomTypes.General.FunctionWithParams;

export class GameplaySceneController extends Phaser.Scene {

	view: GameplaySceneView;
	audioController: AudioController;
  gameController: GameController;
  ballController: BallController;

  constructor () {
    super({key: SceneInfo.GAMEPLAY.key});
  }

  init (): void {
    this.view = new GameplaySceneView(this);
    this.audioController = AudioController.getInstance();
    this.gameController = new GameController();
    this.ballController = new BallController(this);

    this.gameController.onInitialization(({ timer, maxLiveBall }) => {
      this.view.updateTimerText(timer);
      this.ballController.init({ screenRatio: this.view.screenRatio });
    });

    this.gameController.onPlayingGameState(() => {
      this.view.setVisibleOverlay(false);
      this.ballController.enableTapBall();
    });

    this.gameController.onTimerChange((timer) => {
      this.view.updateTimerText(timer);
    });

    this.gameController.onTimeout(() => {
      this.gameController.setGameoverState();
      this.ballController.disableTapBall();
      this.view.setVisibleOverlay(true);
      this.view.showTimeoutText();
    });

    this.gameController.onComboActive((combo) => {
      this.view.updateComboText(combo);
      this.view.showComboText();
    });

    this.gameController.onNeedLiveBall(() => {
      const slightLeft = this.scale.width * 0.3;
      const slightRight = this.scale.width * 0.675;
      const x = Phaser.Utils.Array.GetRandom([this.scale.width/2, slightLeft, slightRight]);
      const y = this.scale.height * -0.1;
      this.ballController.spawnBall(x, y);
    });

    this.gameController.onPrepareCounter((counter) => {
      this.view.updatePrepareCountText(counter);

      const isPlayReady = (counter < 0);
      if (!isPlayReady) return;
      this.gameController.setPlayingState();
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

    this.onShowRecapModal(() => {
      const score = this.gameController.totalScore;
      this.view.showRecapModal(score);
    });

    this.onClickRestart(() => {
      this.scene.start(SceneInfo.TITLE.key);
    });

    this.onCreateFinish((uiView) => {
      this.gameController.init({
        timer: 90,
        maxLiveBall: 40,
      });
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

  onClickRestart (event: OnClickRestart): void {
    this.view.event.on(EventNames.onClickRestart, event);
  }

  onShowRecapModal (event: OnShowRecapModal): void {
    this.view.event.on(EventNames.onShowRecapModal, event);
  }

  onCreateFinish (event: OnCreateFinish): void {
    this.view.event.once(EventNames.onCreateFinish, event);
  }

}