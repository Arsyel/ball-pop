import { CustomTypes } from "../../../../types/custom";
import { GameState } from "../../../info/GameInfo";

type OnInitialization = (data: CustomTypes.Gameplay.GameData) => void;
type OnTimerChange = (time: number) => void;
type OnTimeout = CustomTypes.General.FunctionNoParam;
type OnComboActive = (value: number) => void;

export const enum EvenNames {
  onInitialization = "onInitialization",
  onTimerChange = "onTimerChange",
  onTimeout = "onTimeout",
  onComboActive = "onComboActive",
};

const TIME_TICK_BASE = 1;

export class GameController {

  private _event: Phaser.Events.EventEmitter;
  private _state: GameState;

  private _timerTick: number;
  private _timer: number;

  private _comboTimeTick: number;
  private _comboCount: number;

  private _totalScore: number;

  constructor () {
  	this._event = new Phaser.Events.EventEmitter();
    this._state = GameState.PREPARING;
  }

  get state (): GameState {
    return this._state;
  }

  get totalScore (): number {
    return this._totalScore <= 0 ? 0 : this._totalScore;
  }

  init (data: CustomTypes.Gameplay.GameData): void {
    this._timerTick = TIME_TICK_BASE;
    this._timer = data.timer;

    this._comboTimeTick = 0;
    this._comboCount = 0;

    this._totalScore = 0;

    this._event.emit(EvenNames.onInitialization, data);
  }

  setGameoverState (): void {
    this._state = GameState.GAMEOVER;
  }

  addCombo (): void {
    this._comboTimeTick = TIME_TICK_BASE;
    this._comboCount += 1;
    this._event.emit(EvenNames.onComboActive, this._comboCount);
  }

  addScore (value: number = 1): void {
    this._totalScore += value;
  }

  update (time: number, dt: number): void {
    if (this._state === GameState.GAMEOVER) return;

    const deltaTime = dt / 1000;

    this._timerTick -= deltaTime;
    if (this._timerTick <= 0) {
      this._timerTick += TIME_TICK_BASE;
      this._timer -= 1;

      this._event.emit(EvenNames.onTimerChange, this._timer);

      const isTimeout = this._timer <= 0;
      (isTimeout) && this._event.emit(EvenNames.onTimeout);
    }

    if (this._comboTimeTick > 0) {
      this._comboTimeTick -= deltaTime;
    }
    if (this._comboTimeTick <= 0 && !!this._comboCount) {
      this._comboCount = 0;
    }
  }

  onInitialization (event: OnInitialization): void {
    this._event.once(EvenNames.onInitialization, event);
  }

  onTimerChange (event: OnTimerChange): void {
    this._event.on(EvenNames.onTimerChange, event);
  }

  onTimeout (event: OnTimeout): void {
    this._event.once(EvenNames.onTimeout, event);
  }

  onComboActive (event: OnComboActive): void {
    this._event.on(EvenNames.onComboActive, event);
  }

}