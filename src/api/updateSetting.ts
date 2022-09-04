import { ErrorResponse, Setting } from "../type";
import { postApiData } from "./apiHandler";
import {
  imageUri,
  isReleased,
  releaseAt,
  service,
  setErrorMessage,
} from "../signal";

export const updateSetting = async () => {
  if (!isReleased() || !imageUri() || !releaseAt()) {
    return;
  }
  const load = async (): Promise<void> => {
    const data: Setting | ErrorResponse = await postApiData(
      `/repositories/${service()}`,
      {
        image_uri: imageUri(),
        is_released: isReleased(),
        release_at: releaseAt(),
      } as Setting
    );
    if (
      typeof data === "object" &&
      data !== null &&
      typeof (data as ErrorResponse).message === "string"
    ) {
      // 戻り値がエラーメッセージの場合
      setErrorMessage((data as ErrorResponse).message);
      return;
    }
    setErrorMessage(undefined);
  };
  void load();
};
