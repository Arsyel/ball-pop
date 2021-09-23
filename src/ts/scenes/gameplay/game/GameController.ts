import { CustomTypes } from "../../../../types/custom";
import { GameState } from "../../../info/GameInfo";

type OnInitialization = (data: CustomTypes.Gameplay.GameData) => void;
type OnTimerChange = (timer: number) => void;
type OnTimeout = CustomTypes.General.FunctionNoParam;
type OnComboActive = (value: number) => void;
type OnNeedLiveBall = (currentLiveBall: number) => void;
type OnPrepareCounter = (counter: number) => void;
type OnPlayingGameState = CustomTypes.General.FunctionNoParam;

export const enum EvenNames {
  onInitialization = "onInitialization",
  onTimerChange = "onTimerChange",
  onTimeout = "onTimeout",
  onComboActive = "onComboActive",
  onNeedLiveBall = "onNeedLiveBall",
  onPrepareCounter = "onPrepareCounter",
  onPlayingGameState = "onPlayingGameState",
};

const TIME_TICK_BASE = 1.025;

export class GameController {

  private _event: Phaser.Events.EventEmitter;
  private _state: GameState;

  private _timerTick: number;
  private _timer: number;

  private _prepareCounter: number;

  private _comboTimeTick: number;
  private _comboCount: number;

  private _totalScore: number;

  private _liveBallTick: number;
  private _maxLiveBall: number;
  private _currentLiveBall: number;

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
    this._timerTick = 0;
    this._timer = data.timer;

    this._prepareCounter = 4;

    this._comboTimeTick = 0;
    this._comboCount = 0;

    this._totalScore = 0;

    this._liveBallTick = TIME_TICK_BASE;
    this._maxLiveBall = data.maxLiveBall;
    this._currentLiveBall = 0;

    this._event.emit(EvenNames.onInitialization, data);
  }

  setGameoverState (): void {
    this._state = GameState.GAMEOVER;
  }

  setPlayingState (): void {
    this._state = GameState.PLAYING;
    this._event.emit(EvenNames.onPlayingGameState);
  }

  addCombo (): void {
    this._comboTimeTick = TIME_TICK_BASE;
    this._comboCount += 1;
    this._event.emit(EvenNames.onComboActive, this._comboCount);
  }

  addScore (value: number = 1): void {
    this._totalScore += value;
  }

  reduceLiveBall (value: number = 1): void {
    const newValue = this._currentLiveBall - value;
    this._currentLiveBall = (newValue <= 0) ? 0 : newValue;
  }

  update (time: number, dt: number): void {
    if (this._state === GameState.GAMEOVER) return;

    const deltaTime = dt / 1000;

    this._timerTick -= deltaTime;
    if (this._timerTick <= 0) {
      this._timerTick += TIME_TICK_BASE;

      const isPrepareCounterFinished = this._prepareCounter <= -1;
      if (isPrepareCounterFinished) {
        this._timer -= 1;
  
        this._event.emit(EvenNames.onTimerChange, this._timer);
  
        const isTimeout = this._timer <= 0;
        (isTimeout) && this._event.emit(EvenNames.onTimeout);
      }

      if (!isPrepareCounterFinished) {
        this._prepareCounter -= 1;
        this._event.emit(EvenNames.onPrepareCounter, this._prepareCounter);
      }
    }

    if (this._comboTimeTick > 0) {
      this._comboTimeTick -= deltaTime;
    }
    if (this._comboTimeTick <= 0 && !!this._comboCount) {
      this._comboCount = 0;
    }

    const isAllBallLive = this._currentLiveBall >= this._maxLiveBall;
    if (!isAllBallLive) {
      const modifySpawnTime = deltaTime * 8.5;
      this._liveBallTick -= modifySpawnTime;

      if (this._liveBallTick <= 0) {
        this._liveBallTick += TIME_TICK_BASE;
        this._currentLiveBall += 1;
        this._event.emit(EvenNames.onNeedLiveBall, this._currentLiveBall);
      }
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

  onNeedLiveBall (event: OnNeedLiveBall): void {
    this._event.on(EvenNames.onNeedLiveBall, event);
  }

  onPrepareCounter (event: OnPrepareCounter): void {
    this._event.on(EvenNames.onPrepareCounter, event);
  }

  onPlayingGameState (event: OnPlayingGameState): void {
    this._event.on(EvenNames.onPlayingGameState, event);
  }

}