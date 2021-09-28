import { BaseAPIInstance, EventNames, OnError, OnGetProfile, OnGetTestAPICall } from "./BaseAPIInstances";
import { addBookMutation, getBooksQuery } from "./queries/Query";

import { GetObjectProp } from "../../helper/GeneralHelper";
import { GraphQLClient } from "graphql-request";
import { getRoute } from "./helper/Helper";

export class GraphqlAPIController extends BaseAPIInstance {

  private _client: GraphQLClient;

  constructor () {
    super();
    this._client = new GraphQLClient(getRoute("/graphql"));
    this._client.setHeader("authorization", "Bearer TOKEN_HERE");
  }

  getTestAPICall (): void {
    this._client.request(getBooksQuery)
      .then((data) => {
        this.event.emit(EventNames.onGetTestAPICall, GetObjectProp(data, "books"));
      })
      .catch((err) => {
        this.event.emit(EventNames.onError, { origin: "getTestAPICall", err });
      });
  }

  postTestAPICall (): void {
    const variables = {
      name: "Random Name: " + new Date(),
      genre: "Any",
      authorId: "6105e20dda268330bc94b115" // Platos
    };
    this._client.request(addBookMutation, variables)
      .then((data) => {
        this.event.emit(EventNames.onGetTestAPICall, data);
      })
      .catch((err) => {
        this.event.emit(EventNames.onError, { origin: "postTestAPICall", err });
      });
  }

  getProfile (): void {
    console.log("Call get profile graphql!");
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