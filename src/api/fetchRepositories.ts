import { ErrorResponse, RepositoryItem } from "../type";
import { baseUri, getApiData } from "./apiHandler";
import {
  service,
  setImages,
  setMessage,
  setMessageSeverity,
  setRepositories,
} from "../signal";

export const fetchRepositories = async () => {
  if (!service()) {
    return;
  }
  const load = async (): Promise<void> => {
    const data: RepositoryItem[] | ErrorResponse = await getApiData(
      `${baseUri}/repositories/${service()}`
    );
    if (
      typeof data === "object" &&
      data !== null &&
      typeof (data as ErrorResponse).message === "string"
    ) {
      // 戻り値がエラーメッセージの場合
      setRepositories(undefined);
      setImages(undefined);
      setMessage((data as ErrorResponse).message);
      setMessageSeverity("error");
      return;
    }
    setRepositories(data as RepositoryItem[]);
    setImages(undefined);
    setMessage(undefined);
  };
  void load();
};
