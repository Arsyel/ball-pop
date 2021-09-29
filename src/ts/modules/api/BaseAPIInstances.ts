import { CustomTypes } from "../../../types/custom";

export type OnError = (errData: CustomTypes.Network.ErrorData) => void;
export type OnGetTestAPICall = CustomTypes.General.FunctionWithParams;
export type OnGetProfile = (profile: CustomTypes.Network.Data.Profile) => void;
export type OnGetGameMilestonesList = CustomTypes.General.FunctionWithParams;
export type OnGetGameUserData = CustomTypes.General.FunctionWithParams;
export type OnGetGameDetail = CustomTypes.General.FunctionWithParams;

export const enum EventNames {
	onError = "onError",
	onGetTestAPICall = "onGetTestAPICall",
	onGetProfile = "onGetProfile",
  onGetGameMilestonesList = "onGetGameMilestonesList",
  onGetGameUserData = "onGetGameUserData",
  onGetGameDetail = "onGetGameDetail",
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

  abstract onError (event: OnError): void;

  abstract onGetTestAPICall (event: OnGetTestAPICall): void;

  abstract onGetProfile (event: OnGetProfile): void;

  abstract onGetGameMilestonesList (event: OnGetGameMilestonesList): void;

  abstract onGetGameUserData (event: OnGetGameUserData): void;

  abstract onGetGameDetail (event: OnGetGameDetail): void;

}