import { ErrorResponse, ImageItem } from "../type";
import { baseUri, getApiData } from "./apiHandler";
import { repository, service, setErrorMessage, setImages } from "../signal";

export const fetchImages = async () => {
  if (!service() || !repository()) {
    return;
  }
  const load = async (): Promise<void> => {
    const data: ImageItem[] | ErrorResponse = await getApiData(
      `${baseUri}/images/${service()}/${repository()}`
    );
    if (
      typeof data === "object" &&
      data !== null &&
      typeof (data as ErrorResponse).message === "string"
    ) {
      // 戻り値がエラーメッセージの場合
      setImages(undefined);
      setErrorMessage((data as ErrorResponse).message);
      return;
    }
    setImages(data as ImageItem[]);
    setErrorMessage(undefined);
  };
  void load();
};
