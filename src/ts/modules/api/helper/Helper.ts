import { CONFIG } from "../../../info/GameInfo";

export const getRoute = (route: string): string => {
  return CONFIG.BASE_API_URL + route;
};
