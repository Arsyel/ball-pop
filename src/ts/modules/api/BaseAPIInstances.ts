import { CustomTypes } from "../../../types/custom";

type OnError = (errData: CustomTypes.Network.ErrorData) => void;
type OnGetTestAPICall = CustomTypes.General.FunctionWithParams;
type OnGetProfile = (profile: CustomTypes.Network.Data.Profile) => void;
type OnGetGameMilestonesList = CustomTypes.General.FunctionWithParams;
type OnGetGameUserData = CustomTypes.General.FunctionWithParams;
type OnGetGameDetail = CustomTypes.General.FunctionWithParams;
type OnGetGameStart = (gameStart: CustomTypes.Network.Data.GameStart) => void;
type OnGetGameFinish = CustomTypes.General.FunctionWithParams;

export const enum EventNames {
  onError = "onError",
  onGetTestAPICall = "onGetTestAPICall",
  onGetProfile = "onGetProfile",
  onGetGameMilestonesList = "onGetGameMilestonesList",
  onGetGameUserData = "onGetGameUserData",
  onGetGameDetail = "onGetGameDetail",
  onGetGameStart = "onGetGameStart",
  onGetGameFinish = "onGetGameFinish",
};

export abstract class BaseAPIInstance {

  protected event: Phaser.Events.EventEmitter;

  constructor () {
    this.event = new Phaser.Events.EventEmitter();
  }

  abstract getTestAPICall (): void;

  abstract postTestAPICall (): void;

  abstract getProfile (): void;

  abstract getGameMilestonesList (): void;

  abstract getGameUserData (): void;

  abstract getGameDetail (): void;

  abstract getGameStart (): void;

  abstract getGameFinish (): void;

  //#region Event
  onError (event: OnError): void {
    this.event.on(EventNames.onError, event);
  }

  onGetTestAPICall (event: OnGetTestAPICall): void {
    this.event.on(EventNames.onGetTestAPICall, event);
  }

  onGetProfile (event: OnGetProfile): void {
    this.event.on(EventNames.onGetProfile, event);
  }

  onGetGameMilestonesList (event: OnGetGameMilestonesList): void {
    this.event.on(EventNames.onGetGameMilestonesList, event);
  }

  onGetGameUserData (event: OnGetGameUserData): void {
    this.event.on(EventNames.onGetGameUserData, event);
  }

  onGetGameDetail (event: OnGetGameDetail): void {
    this.event.on(EventNames.onGetGameDetail, event);
  }

  onGetGameStart (event: OnGetGameStart): void {
    this.event.on(EventNames.onGetGameStart, event);
  }

  onGetGameFinish (event: OnGetGameFinish): void {
    this.event.on(EventNames.onGetGameFinish, event);
  }
  //#endregion

}