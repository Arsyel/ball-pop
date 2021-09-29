import { BaseAPIInstance, EventNames } from "./BaseAPIInstances";
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

}