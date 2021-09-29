import { BaseAPIInstance } from "./BaseAPIInstances";
import { CONFIG } from "../../info/GameInfo";
import { DummyAPIController } from "./DummyAPIController";
import { GraphqlAPIController } from "./GraphqlAPIController";

type DummyRef = {
  scene: Phaser.Scene;
}

export class APIController {

  private static _instance: APIController;

  private _api: BaseAPIInstance;
  private _dummyRef: DummyRef;

  constructor () {
    this._api = (CONFIG.MODE === "SANDBOX") ? new DummyAPIController() : new GraphqlAPIController();
  }

  static getInstance (): APIController {
    if (!APIController._instance) {
      APIController._instance = new APIController();
    }
    return APIController._instance;
  }

  init (dummyAPIRef: DummyRef): void {
    this._dummyRef = dummyAPIRef;
  }

  getDummyAPIRef (): DummyRef {
    return this._dummyRef;
  }

  getApi (): BaseAPIInstance {
    return this._api;
  }

}