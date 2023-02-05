// @vitest-environment jsdom

import { expect, test, vi } from "vitest";
import "vi-fetch/setup";
import { mockFetch, mockDelete } from "vi-fetch";
import { Setting } from "../../src/type";
import { baseUri } from "../../src/api/apiHandler";
import { deleteSetting } from "../../src/api/deleteSetting";
import {
  service,
  setImageUri,
  setIsReleased,
  setIsReleaseSelected,
  setReleaseAt,
  setService,
} from "../../src/signal";

describe("deleteSetting", () => {
  beforeEach(() => {
    mockFetch.clearAll();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  // 「呼び出しが行われなかったこと」の確認ができないのでテストケースは正常系のみ
  const apiCall = [
    {
      service: "service1",
      imageUri: "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/hoge:latest",
      isReleased: false,
      releaseAt: new Date(),
    },
    {
      service: "service2",
      imageUri:
        "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/fuga@sha256:4c716d4cf211c7b7d2f3233c941771ad0507ea5bacf93b492766aa41ae9f720d",
      isReleased: false,
      releaseAt: new Date(),
    },
  ];
  apiCall.forEach((testCase) => {
    test(`リリース設定 API 呼び出し（削除：service=${testCase.service}）`, async () => {
      setService(testCase.service);
      setImageUri(testCase.imageUri);
      setIsReleased(testCase.isReleased);
      setReleaseAt(testCase.releaseAt);
      setIsReleaseSelected(true);
      const mock = mockDelete(`${baseUri}/setting/${service()}`).willResolve({
        image_uri: testCase.imageUri,
        is_released: testCase.isReleased,
        release_at: testCase.releaseAt,
      } as Setting);
      await deleteSetting();
      // とりあえず呼び出しが行われたことだけを確認（戻り値は今のところ上手くテストできず）
      expect(mock).toHaveFetched();
    });
  });
});
