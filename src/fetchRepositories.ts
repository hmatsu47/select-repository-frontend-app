import { ErrorResponse, RepositoryItem } from "./type";
import { getApiData } from "./apiHandler";
import { service, setErrorMessage, setImages, setRepositories } from "./signal";

export const fetchRepositories = async () => {
  if (!service()) {
    return;
  }
  const load = async (): Promise<void> => {
    const data: RepositoryItem[] | ErrorResponse = await getApiData(
      `/repositories/${service()}`
    );
    if (
      typeof data === "object" &&
      data !== null &&
      typeof (data as ErrorResponse).message === "string"
    ) {
      // 戻り値がエラーメッセージの場合
      setRepositories(undefined);
      setImages(undefined);
      setErrorMessage((data as ErrorResponse).message);
      return;
    }
    setRepositories(data as RepositoryItem[]);
    setImages(undefined);
    setErrorMessage(undefined);
  };
  void load();
};
