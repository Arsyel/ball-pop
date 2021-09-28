import { Assets } from "../../../collections/AssetsTitle";
import { ButtonLabelUIView } from "./ButtonLabelUIView";
import { CustomTypes } from "../../../../types/custom";
import { FontAsset } from "../../../collections/AssetFont";
import { Image } from "../../../modules/gameobjects/Image";
import { LAYER_DEPTH } from "../../../helper/GeneralHelper";
import { ScreenUtilController } from "../../../modules/screenutility/ScreenUtilController";

type TextStyle = Phaser.Types.GameObjects.Text.TextStyle;

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

    const charNameStyle = {
      fontFamily: FontAsset.roboto.key,
      fontSize: `${105 * ratio}px`,
      fontStyle: "bold",
      color: "#639b56",
      align: "center"
    } as TextStyle;
    const charNamePos = panel.transform.getDisplayPositionFromCoordinate(0.5, 0.25);
    const charNameText = this._scene.add.text(charNamePos.x, charNamePos.y, "TOPED", charNameStyle);
    charNameText.setOrigin(0.5, 0);

    const charDescStyle = {
      fontFamily: FontAsset.roboto.key,
      fontSize: `${48 * ratio}px`,
      align: "center",
      wordWrap: {
        width: panel.gameObject.displayWidth * 0.65
      }
    } as TextStyle;
    const charDescPos = charNameText.getBottomCenter();
    const descTextContent = "Kombo tidak akan hilang selama 5 detik";
    const charDescText = this._scene.add.text(charDescPos.x, charDescPos.y * 1.005, descTextContent, charDescStyle);
    charDescText.setOrigin(0.5, 0);

    const confirmBtnPos = panel.transform.getDisplayPositionFromCoordinate(0.5, 1.015);
    const confirmBtn = new ButtonLabelUIView(this._scene, {
      label: "999X MAIN",
      position: { x: confirmBtnPos.x, y: confirmBtnPos.y },
      ratio,
      onClick,
    });

    this._panelContainer = this._scene.add.container(0, 0, [
      panel.gameObject,
      charNameText,
      charDescText,
      confirmBtn.gameObject
    ]).setDepth(LAYER_DEPTH.UI).setVisible(false).setActive(false);
  }

  show (): void {
    this._panelContainer.setVisible(true).setActive(true);
  }

  hide (): void {
    this._panelContainer.setVisible(false).setActive(false);
  }

}