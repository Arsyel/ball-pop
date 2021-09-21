import { AudioController } from "../../modules/audio/AudioController";
import { EventNames, GameplaySceneView } from "./GameplaySceneView";
import { DebugController } from "./debug/DebugController";
import { SceneInfo } from "../../info/SceneInfo";

type OnCreateFinish = (...args: unknown[]) => void;

export class GameplaySceneController extends Phaser.Scene {

	view: GameplaySceneView;
	audioController: AudioController;
	debugController: DebugController;

	constructor () {
		super({key: SceneInfo.GAMEPLAY.key});
	}

	init (): void {
		this.view = new GameplaySceneView(this);
		this.audioController = AudioController.getInstance();
		this.debugController = new DebugController(this);

		this.debugController.init();

		const resizeEndListener = (): void => {
			this.debugController.log(`[On resize]\ndocumentSize:\nwidth: ${window.innerWidth}, hight: ${window.innerHeight}`);
		};

		this.onClickRestart(() => {
			window.document.removeEventListener("resizeEnd", resizeEndListener, false);
			this.scene.start(SceneInfo.GAMEPLAY.key);
		});

		this.onCreateFinish((uiView) => {
			this.debugController.show(true);
			// Note: Dispatch to debug when resized
			window.document.addEventListener("resizeEnd", resizeEndListener);
		});
	}

	create (): void {
		this.view.create();
	}

	update (time: number, dt: number): void {
		if (this.view.restartKey.isDown) {
			this.view.event.emit(EventNames.onClickRestart);
		}
	}

	onClickRestart (event: Function): void {
		this.view.event.on(EventNames.onClickRestart, event);
	}

	onCreateFinish (event: OnCreateFinish): void {
		this.view.event.once(EventNames.onCreateFinish, event);
	}

}