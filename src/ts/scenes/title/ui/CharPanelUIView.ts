import { Assets } from "../../../collections/AssetsTitle";
import { Button } from "../../../modules/gameobjects/Button";
import { CustomTypes } from "../../../../types/custom";
import { FontAsset } from "../../../collections/AssetFont";
import { Image } from "../../../modules/gameobjects/Image";
import { LAYER_DEPTH } from "../../../helper/GeneralHelper";
import { ScreenUtilController } from "../../../modules/screenutility/ScreenUtilController";

type Props = {
  onClick: CustomTypes.General.FunctionNoParam;
};

export class CharPanelUIView {

  private _panelContainer: Phaser.GameObjects.Container;

  constructor (private _scene: Phaser.Scene, props: Props) {
    this.create(props);
  }

  private create (props: Props): void {
    const { onClick } = props;
    const { centerX, centerY, width, height } = ScreenUtilController.getInstance();

    const panel = new Image(this._scene, centerX, centerY * 0.975, Assets.panel_select_char.key);
    panel.transform.setMaxPreferredDisplaySize(width * 0.85, height * 0.85);

    const ratio = panel.transform.displayToOriginalHeightRatio * 0.95;
    const acceptPos = panel.transform.getDisplayPositionFromCoordinate(0.5, 1.015);
    const acceptBtn = new Button(this._scene, acceptPos.x, acceptPos.y, "999X MAIN", {
      align: "center",
      color: "#5d4035",
      fontFamily: FontAsset.roboto.key,
      fontSize: `${72 * ratio}px`
    }, {
      color: 0xefbd41,
      width: 541 * ratio,
      height: 184 * ratio,
      radius: 64 * ratio
    });
    acceptBtn.gameObject.click.once(onClick);

    this._panelContainer = this._scene.add.container(0, 0, [
      panel.gameObject,
      acceptBtn.gameObject.container
    ]).setDepth(LAYER_DEPTH.UI).setVisible(false).setActive(false);
  }

  show (): void {
    this._panelContainer.setVisible(true).setActive(true);
  }

  hide (): void {
    this._panelContainer.setVisible(false).setActive(false);
  }

}