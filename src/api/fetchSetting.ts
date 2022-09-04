import { ErrorResponse, Setting } from "../type";
import { baseUri, getApiData } from "./apiHandler";
import {
  service,
  setErrorMessage,
  setImageUri,
  setIsReleased,
  setReleaseAt,
} from "../signal";

export const fetchSetting = async () => {
  if (!service()) {
    return;
  }
  const load = async (): Promise<void> => {
    const data: Setting | ErrorResponse = await getApiData(
      `${baseUri}/setting/${service()}`
    );
    if (
      typeof data === "object" &&
      data !== null &&
      typeof (data as ErrorResponse).message === "string"
    ) {
      // 戻り値がエラーメッセージの場合
      setIsReleased(undefined);
      setImageUri(undefined);
      setReleaseAt(undefined);
      setErrorMessage((data as ErrorResponse).message);
      return;
    }
    const tmpIsReleased = (data as Setting).is_released;
    setIsReleased(tmpIsReleased);
    setImageUri(tmpIsReleased ? (data as Setting).image_uri : undefined);
    setReleaseAt(tmpIsReleased ? (data as Setting).release_at : undefined);
    setErrorMessage(undefined);
  };
  void load();
};
