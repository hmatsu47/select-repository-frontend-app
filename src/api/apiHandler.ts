import { fetchWithTimeout } from "./fetchWithTimeout";

// ベース URI
export const baseUri = "/api";

// API からデータ取得（GET）
export const getApiData = async (url: string) => {
  return await (await fetchWithTimeout("GET", url)).json();
};
// API からデータ取得（POST）
export const postApiData = async (url: string, object: Object) => {
  return await (await fetchWithTimeout("POST", url, object)).json();
};
// API で DELETE
export const deleteApiData = async (url: string) => {
  return await (await fetchWithTimeout("DELETE", url)).json();
};
