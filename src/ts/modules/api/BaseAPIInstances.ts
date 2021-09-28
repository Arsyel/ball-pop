import { CustomTypes } from "../../../types/custom";

export type OnError = CustomTypes.General.FunctionWithParams;
export type OnGetTestAPICall = CustomTypes.General.FunctionWithParams;
export type OnGetProfile = CustomTypes.General.FunctionWithParams;

export const enum EventNames {
	onError = "onError",
	onGetProfile = "onGetProfile",
	onGetTestAPICall = "onGetTestAPICall",
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

}