import { ErrorResponse, Setting } from "../type";
import { baseUri, getApiData } from "./apiHandler";
import {
  service,
  setImageUri,
  setIsReleased,
  setLastImageUri,
  setLastReleasedAt,
  setMessage,
  setMessageSeverity,
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
      setLastImageUri(undefined);
      setLastReleasedAt(undefined);
      setImageUri(undefined);
      setReleaseAt(undefined);
      setMessage((data as ErrorResponse).message);
      setMessageSeverity("error");
      return;
    }
    const tmpIsReleased = (data as Setting).is_released;
    setIsReleased(tmpIsReleased);
    setLastImageUri(tmpIsReleased ? (data as Setting).image_uri : undefined);
    setLastReleasedAt(tmpIsReleased ? (data as Setting).release_at : undefined);
    setImageUri(
      !tmpIsReleased && (data as Setting).image_uri
        ? (data as Setting).image_uri
        : undefined
    );
    setReleaseAt(
      !tmpIsReleased && (data as Setting).release_at
        ? (data as Setting).release_at
        : undefined
    );
    setMessage(undefined);
  };
  void load();
};
