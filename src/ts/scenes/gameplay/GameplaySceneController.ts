import { AudioController } from "../../modules/audio/AudioController";
import { EventNames, GameplaySceneView } from "./GameplaySceneView";
import { DebugController } from "./debug/DebugController";
import { SceneInfo } from "../../info/SceneInfo";
import { CustomTypes } from "../../../types/custom";
import { GameController } from "./game/GameController";

type OnCreateFinish = CustomTypes.General.FunctionWithParams;

export class GameplaySceneController extends Phaser.Scene {

	view: GameplaySceneView;
	audioController: AudioController;
	debugController: DebugController;
  gameController: GameController;

	constructor () {
		super({key: SceneInfo.GAMEPLAY.key});
	}

	init (): void {
		this.view = new GameplaySceneView(this);
		this.audioController = AudioController.getInstance();
		this.debugController = new DebugController(this);
    this.gameController = new GameController();

    this.gameController.onInitialization(({ timer }) => {
      console.log("Game timer:", timer);
    });

    this.gameController.onTimerChange((time) => {
      console.log("Timer:", time);
    });

    this.gameController.onTimeout(() => {
      console.log("Times up!");
      this.gameController.setGameoverState();
    });

    this.gameController.onComboActive((combo) => {
      console.log(`Combo: +${combo}`);
    });

		this.onClickRestart(() => {
			this.scene.start(SceneInfo.GAMEPLAY.key);
		});

		this.onCreateFinish((uiView) => {
			this.debugController.init();
      this.gameController.init({ timer: 60 });

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