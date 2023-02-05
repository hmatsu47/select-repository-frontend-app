import { ErrorResponse } from "../type";
import { baseUri, deleteApiData } from "./apiHandler";
import {
  imageUri,
  isReleased,
  isReleaseSelected,
  releaseAt,
  service,
  setMessage,
  setMessageSeverity,
  setImageUri,
  setIsReleaseSelected,
  setReleaseAt,
} from "../signal";

export const deleteSetting = async () => {
  if (
    !isReleased() === undefined ||
    !isReleaseSelected() ||
    !imageUri() ||
    !releaseAt()
  ) {
    return;
  }
  const load = async (): Promise<void> => {
    const data: null | ErrorResponse = await deleteApiData(
      `${baseUri}/setting/${service()}`
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
    setImageUri(undefined);
    setReleaseAt(undefined);
    setIsReleaseSelected(false);
    setMessage("リリースを取り消しました。");
    setMessageSeverity("success");
  };
  void load();
};
