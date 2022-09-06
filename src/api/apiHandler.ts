import { fetchWithTimeout } from "./fetchWithTimeout";

// ベース URI
export const baseUri = "http://10.11.17.43/api";

// APIからデータ取得（GET）
export const getApiData = async (url: string) => {
  return await (await fetchWithTimeout(url)).json();
};
// APIからデータ取得（POST）
export const postApiData = async (url: string, object: Object) => {
  return await (await fetchWithTimeout(url, object)).json();
};
