import { BaseAPIInstance, EventNames, OnError, OnGetProfile, OnGetTestAPICall } from "./BaseAPIInstances";
import { gql, request } from "graphql-request";

import { GetObjectProp } from "../../helper/GeneralHelper";
import { getRoute } from "./helper/Helper";

export class GraphqlAPIController extends BaseAPIInstance {

  getTestAPICall (): void {
    const getBooksQuery = gql`
      query GetBooks {
        books {
          id
          name
          author {
            name
            id
          }
        }
      }
    `;
    request(getRoute("/graphql"), getBooksQuery)
      .then((data) => {
        this.event.emit(EventNames.onGetTestAPICall, GetObjectProp(data, "books"));
      })
      .catch((err) => {
        this.event.emit(EventNames.onError, { origin: "getTestAPICall", err });
      });
  }

  postTestAPICall (): void {
    const addBookMutation = gql`
      mutation ($name: String!, $genre: String!, $authorId: ID!) {
        addBook (name: $name, genre: $genre, authorId: $authorId) {
          id
          name
        }
      }
    `;
    const variables = {
      name: "Random Name: " + new Date(),
      genre: "Any",
      authorId: "6105e20dda268330bc94b115" // Platos
    };
    request(getRoute("/graphql"), addBookMutation, variables)
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