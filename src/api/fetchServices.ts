import { ErrorResponse, ServiceItem } from "../type";
import { baseUri, getApiData } from "./apiHandler";
import {
  setErrorMessage,
  setImages,
  setRepositories,
  setServices,
} from "../signal";

export const fetchServices = async () => {
  const load = async (): Promise<void> => {
    const data: ServiceItem[] | ErrorResponse = await getApiData(
      `${baseUri}/services`
    );
    if (
      typeof data === "object" &&
      data !== null &&
      typeof (data as ErrorResponse).message === "string"
    ) {
      // 戻り値がエラーメッセージの場合
      setServices(undefined);
      setRepositories(undefined);
      setImages(undefined);
      setErrorMessage((data as ErrorResponse).message);
      return;
    }
    setServices(data as ServiceItem[]);
    setRepositories(undefined);
    setImages(undefined);
    setErrorMessage(undefined);
  };
  void load();
};
