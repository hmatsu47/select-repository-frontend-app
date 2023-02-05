import { ErrorResponse, Setting } from "../type";
import { baseUri, postApiData } from "./apiHandler";
import {
  imageUri,
  isReleased,
  releaseAt,
  service,
  setIsReleaseSelected,
  setMessage,
  setMessageSeverity,
  setReleaseAt,
} from "../signal";

export const updateSetting = async () => {
  if (!isReleased() === undefined || !imageUri() || !releaseAt()) {
    return;
  }
  const load = async (): Promise<void> => {
    const data: Setting | ErrorResponse = await postApiData(
      `${baseUri}/setting/${service()}`,
      {
        image_uri: imageUri(),
        is_released: isReleased(), // 値は無視される
        release_at: releaseAt(),
      } as Setting
    );
    if (
      typeof data === "object" &&
      data !== null &&
      typeof (data as ErrorResponse).message === "string"
    ) {
      // 戻り値がエラーメッセージの場合
      setMessage((data as ErrorResponse).message);
      setMessageSeverity("error");
      return;
    }
    setReleaseAt((data as Setting).release_at);
    setIsReleaseSelected(true);
    setMessage("リリースイメージ URI とリリース日時をセットしました。");
    setMessageSeverity("success");
  };
  void load();
};
