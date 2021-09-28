import { Assets } from "../../../collections/AssetsTitle";
import { FontAsset } from "../../../collections/AssetFont";
import { Image } from "../../../modules/gameobjects/Image";
import { LAYER_DEPTH } from "../../../helper/GeneralHelper";
import { ScreenUtilController } from "../../../modules/screenutility/ScreenUtilController";

type Props = {
  ratio: number;
  text: string,
  position?: Phaser.Types.Math.Vector2Like;
};

export class InfoPanelUIView {

  private _panelContainer: Phaser.GameObjects.Container;

  constructor (private _scene: Phaser.Scene, props: Props) {
    this.create(props);
  }

  private create (props: Props): void {
    const { width, height, centerX } = ScreenUtilController.getInstance();
    const { ratio, text } = props;

    const titleStyle = {
      fontSize: `${72 * ratio * 0.85}px`,
      fontFamily: FontAsset.roboto.key,
      color: "#000",
      align: "center",
      fontStyle: "bold"
    } as Phaser.GameObjects.TextStyle;
    const titleText = this._scene.add.text(centerX, height * 0.035, "SYARAT\n&\nKETENTUAN", titleStyle);
    titleText.setOrigin(0.5, 0);

    const panelPos = titleText.getBottomCenter();
    const panel = new Image(this._scene, panelPos.x, panelPos.y * 1.075, Assets.panel_info.key);
    const maxHeight = height - panelPos.y;
    panel.transform.setMaxPreferredDisplaySize(width * 0.95, maxHeight * 0.98);
    panel.gameObject.setOrigin(0.5, 0);

    const panelRatio = panel.transform.displayToOriginalHeightRatio;
    const descPos = panel.transform.getDisplayPositionFromCoordinate(0.05, 0.05);
    const descStyle = {
      fontSize: `${38 * panelRatio}px`,
      fontFamily: FontAsset.roboto.key,
      wordWrap: {
        width: panel.gameObject.displayWidth * 0.925
      },
    } as Phaser.Types.GameObjects.Text.TextStyle;
    const descText = this._scene.add.text(descPos.x, descPos.y, text, descStyle);

    this._panelContainer = this._scene.add.container(0, 0, [
      titleText,
      panel.gameObject,
      descText,
    ]).setVisible(false).setActive(false);
    this._panelContainer.setDepth(LAYER_DEPTH.UI);
  }

  show (): void {
    this._panelContainer.setVisible(true).setActive(true);
  }

  hide (): void {
    this._panelContainer.setVisible(false).setActive(false);
  }

}