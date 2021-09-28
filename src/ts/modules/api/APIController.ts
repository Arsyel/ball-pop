import { BaseAPIInstance } from "./BaseAPIInstances";
import { CONFIG } from "../../info/GameInfo";
import { DummyAPIController } from "./DummyAPIController";
import { GraphqlAPIController } from "./GraphqlAPIController";

export class APIController {

  private static _instance: APIController;

  private _token: string;
  private _api: BaseAPIInstance;

  constructor () {
    this._api = (CONFIG.MODE === "SANDBOX") ? new DummyAPIController() : new GraphqlAPIController();
  }

  static getInstance (): APIController {
    if (!APIController._instance) {
      APIController._instance = new APIController();
    }
    return APIController._instance;
  }

  getApi (): BaseAPIInstance {
    return this._api;
  }

}