import { LAYER_DEPTH } from "../../../helper/GeneralHelper";
import { Sprite } from "../../../modules/gameobjects/Sprite";

type Props = {
  texture: string,
  ratio: number;
  onClick: (gameObject: Phaser.GameObjects.Sprite) => void;
  position?: Phaser.Types.Math.Vector2Like;
  label?: string;
};

export class ButtonUIView {

  private _sprite: Sprite;

  constructor (private _scene: Phaser.Scene, props: Props) {
    this.create(props);
  }

  get gameObject (): Phaser.GameObjects.Sprite {
    return this._sprite.gameObject;
  }

  private create (props: Props): void {
    const { onClick, ratio, position, texture, label } = props;
    this._sprite = new Sprite(this._scene, position?.x ?? 0, position?.y ?? 0, texture);
    this._sprite.transform.setToScaleDisplaySize(ratio);
    this._sprite.gameObject.setDepth(LAYER_DEPTH.UI).setName(`Button_${label ?? ""}`);

    const buttonAlpha = this._sprite.gameObject.alpha;
    const buttonTween = this._scene.tweens.create({
      targets: [this._sprite.gameObject],
      props: {
        alpha: { getStart: () => buttonAlpha, getEnd: () => buttonAlpha * 0.85 }
      },
      duration: 60,
      yoyo: true,
      onComplete: () => onClick(this._sprite.gameObject)
    });

    this._sprite.gameObject.setInteractive({ useHandCursor: true }).on("pointerdown", () => {
      if (buttonTween.isPlaying()) return;
      buttonTween.play();
    });
  }

}