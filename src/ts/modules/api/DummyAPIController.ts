import { BaseAPIInstance, EventNames, OnError, OnGetGameDetail, OnGetGameMilestonesList, OnGetGameUserData, OnGetProfile, OnGetTestAPICall } from "./BaseAPIInstances";

import { APIController } from "./APIController";
import { CONFIG } from "../../info/GameInfo";
import { GetObjectProp } from "../../helper/GeneralHelper";

const EXAMPLE_ENDPOINT = "json/dummyapi/ExampleData.json";

export class DummyAPIController extends BaseAPIInstance {

  private getRequest (key: string, url: string): Promise<any> {
    // Mimic graphql data response
    const KEY_JSON = "dummyData";
    const parseKey = key.split("/");

    return new Promise((resolve, reject) => {
      const { scene } = APIController.getInstance().getDummyAPIRef();
      const loader = scene.load.json(KEY_JSON, CONFIG.BASE_ASSET_URL + url);
      loader.once(Phaser.Loader.Events.COMPLETE, () => {
        const dummyData = scene.cache.json.get(KEY_JSON);
        let data = dummyData;
        let targetProp = "data";
        while (parseKey.length > 0) {
          targetProp = parseKey.shift()!;
          data = GetObjectProp(data, targetProp);
        }
        console.assert(data !== undefined, `Target prop '${targetProp}' is undefined!`);
        resolve(data);
      });
      loader.once(Phaser.Loader.Events.FILE_LOAD_ERROR, () => {
        reject(Error("Load json error"));
      });
      loader.start();
    });
  }

  getTestAPICall (): void {
    this.getRequest("data", EXAMPLE_ENDPOINT)
      .then((data) => {
        this.event.emit(EventNames.onGetTestAPICall, data);
      })
      .catch((err) => {
        this.event.emit(EventNames.onError, { origin: "getTestAPICall", err });
      });
  }

  postTestAPICall (): void {
    new Promise(() => {
      this.event.emit(EventNames.onGetTestAPICall, {
        data: {
          message: "Test call postTestAPICall on dummy api"
        }
      });
    });
  }

  getProfile (): void {
    this.getRequest("data/profile", EXAMPLE_ENDPOINT)
      .then((data) => {
        this.event.emit(EventNames.onGetProfile, data);
      })
      .catch((err) => {
        this.event.emit(EventNames.onError, { origin: "getProfile", err });
      });
  }

  getGameMilestonesList (): void {
    this.getRequest("data/gameMilestonesList", EXAMPLE_ENDPOINT)
      .then((data) => {
        this.event.emit(EventNames.onGetGameMilestonesList, data);
      })
      .catch((err) => {
        this.event.emit(EventNames.onError, { origin: "getGameMilestonesList", err });
      });
  }

  getGameUserData (): void {
    this.getRequest("data/gameUserData", EXAMPLE_ENDPOINT)
      .then((data) => {
        this.event.emit(EventNames.onGetGameUserData, data);
      })
      .catch((err) => {
        this.event.emit(EventNames.onError, { origin: "getGameUserData", err });
      });
  }

  getGameDetail (): void {
    this.getRequest("data/gameDetail", EXAMPLE_ENDPOINT)
      .then((data) => {
        this.event.emit(EventNames.onGetGameDetail, data);
      })
      .catch((err) => {
        this.event.emit(EventNames.onError, { origin: "getGameDetail", err });
      });
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

  onGetGameMilestonesList (event: OnGetGameMilestonesList): void {
    this.event.on(EventNames.onGetGameMilestonesList, event);
  }

  onGetGameUserData (event: OnGetGameUserData): void {
    this.event.on(EventNames.onGetGameUserData, event);
  }

  onGetGameDetail (event: OnGetGameDetail): void {
    this.event.on(EventNames.onGetGameDetail, event);
  }

}