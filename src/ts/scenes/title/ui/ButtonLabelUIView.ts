import { Assets } from "../../../collections/AssetsTitle";
import { CustomTypes } from "../../../../types/custom";
import { FontAsset } from "../../../collections/AssetFont";
import { LAYER_DEPTH } from "../../../helper/GeneralHelper";
import { Sprite } from "../../../modules/gameobjects/Sprite";

type Props = {
  ratio: number;
  label: string;
  position: Phaser.Types.Math.Vector2Like,
  onClick: CustomTypes.General.FunctionNoParam;
};

export class ButtonLabelUIView {

  private _btnSprite: Sprite;
  private _label: Phaser.GameObjects.Text;
  private _container: Phaser.GameObjects.Container;

  constructor (private _scene: Phaser.Scene, props: Props) {
    this.create(props);
  }

  get gameObject (): Phaser.GameObjects.Container {
    return this._container;
  }

  private create (props: Props): void {
    const { ratio, label, onClick, position } = props;

    this._btnSprite = new Sprite(this._scene, 0, 0, Assets.base_btn.key);
    this._btnSprite.transform.setToScaleDisplaySize(ratio);

    const playBtnScale = this._btnSprite.gameObject.scale;
    const playBtnTween = this._scene.tweens.create({
      targets: [this._btnSprite.gameObject, this._label],
      props: {
        scale: { getStart: () => playBtnScale, getEnd: () => playBtnScale * 0.95 }
      },
      duration: 60,
      yoyo: true,
      onComplete: onClick
    });

    this._btnSprite.gameObject.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
      if (playBtnTween.isPlaying()) return;
      playBtnTween.play();
    });

    const playBtnConstraint = {
      pos: this._btnSprite.transform.getDisplayPositionFromCoordinate(0.5, 0.48),
      style: {
        wordWrap: {
          width: this._btnSprite.transform.displayWidth
        },
        fontFamily: FontAsset.roboto.key,
        color: "#5d4035",
        align: "center",
        fontSize: `${64 * this._btnSprite.transform.displayToOriginalHeightRatio}px`
      } as Phaser.Types.GameObjects.Text.TextStyle
    };
    this._label = this._scene.add.text(playBtnConstraint.pos.x, playBtnConstraint.pos.y, label, playBtnConstraint.style);
    this._label.setOrigin(0.5);

    this._container = this._scene.add.container(position.x, position.y, [
      this._btnSprite.gameObject,
      this._label
    ]).setDepth(LAYER_DEPTH.UI);
  }

}