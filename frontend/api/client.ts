import { AxiosError, AxiosRequestConfig, AxiosResponse, Method } from "axios";
const axios = require("axios").default;

type APINamespace = "resources";
export const baseURL = process.env.REACT_APP_API_URL || "/api";
axios.defaults.baseURL = baseURL;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.withCredentials = true;

export type ApiResult = [
  AxiosResponse<unknown, any> | undefined,
  AxiosError<unknown, any> | undefined
];
export async function doApiCall(
  method: Method,
  namespace: APINamespace,
  endpoint: string,
  extraConfig: AxiosRequestConfig = {}
): Promise<ApiResult> {
  let config: AxiosRequestConfig = {
    url: `${namespace}/${endpoint}`,
    method: method,
    ...extraConfig,
  };
  try {
    const resp = await axios.request(config);
    return [resp, undefined];
  } catch (err: any) {
    baseErrorHandler(err);
    return [undefined, err];
  }
}

export function baseErrorHandler(error: AxiosError) {
  console.error("API call error");
  console.error(error);
}
