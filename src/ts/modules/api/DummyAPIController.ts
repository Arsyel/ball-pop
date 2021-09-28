import { BaseAPIInstance, EventNames, OnError, OnGetProfile, OnGetTestAPICall } from "./BaseAPIInstances";

export class DummyAPIController extends BaseAPIInstance {

  getTestAPICall (): void {}

  postTestAPICall (): void {}

  getProfile (): void {
    console.log("Call get profile dummy!");
  }

  getGameMilestonesList (): void {
    throw new Error("Method not implemented.");
  }

  getGameUserData (): void {
    throw new Error("Method not implemented.");
  }

  getGameDetail (): void {
    throw new Error("Method not implemented.");
  }

  onError (event: OnError): void {
    this.event.on(EventNames.onError, event);
  }

  onGetTestAPICall (event: OnGetTestAPICall): void {
    this.event.on(EventNames.onGetTestAPICall, event);
  }

  onGetProfile (event: OnGetProfile): void {
    this.event.on(EventNames.onGetProfile, event);
  }

}