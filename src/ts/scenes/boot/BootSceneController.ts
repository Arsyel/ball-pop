import { APIController } from "../../modules/api/APIController";
import { AudioController } from "../../modules/audio/AudioController";
import { FontList } from "../../collections/AssetFont";
import { LoaderHelper } from "../../helper/LoaderHelper";
import { SceneInfo } from "../../info/SceneInfo";
import { ScreenUtilController } from "../../modules/screenutility/ScreenUtilController";

export class BootSceneController extends Phaser.Scene {

  constructor () {
    super({key: SceneInfo.BOOT.key});
  }

  init (): void {}

  create (): void {
    Promise.all([
      ScreenUtilController.getInstance().init(this),
      AudioController.getInstance().init(this),
      LoaderHelper.LoadFonts(FontList()),
      APIController.getInstance().init({ scene: this }),
    ]).then(() => {
      this.scene.launch(SceneInfo.LOADING.key);
    }).catch((error) => Error("Bootscene::\n" + error));
  }

}