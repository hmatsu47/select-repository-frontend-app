// @vitest-environment jsdom

import { expect, test } from "vitest";
import "vi-fetch/setup";
import { mockPost } from "vi-fetch";
import { Setting } from "../../src/type";
import { baseUri } from "../../src/api/apiHandler";
import { updateSetting } from "../../src/api/updateSetting";
import {
  imageUri,
  isReleased,
  releaseAt,
  service,
  setImageUri,
  setIsReleased,
  setReleaseAt,
  setService,
} from "../../src/signal";

describe("updateSetting", () => {
  const apiCall = [
    {
      service: "service1",
      image_uri: "00000000.dkr.ecr.ap-northeast-1.amazonaws.com/hoge:latest",
      is_released: false,
      release_at: new Date(),
    },
    {
      service: "service2",
      image_uri:
        "00000000.dkr.ecr.ap-northeast-1.amazonaws.com/fuga@sha256:4c716d4cf211c7b7d2f3233c941771ad0507ea5bacf93b492766aa41ae9f720d",
      is_released: false,
      release_at: new Date(),
    },
  ];
  apiCall.forEach((testCase) => {
    test(`リリース設定 API 呼び出し（書き込み：service=${testCase.service}）`, async () => {
      setService(testCase.service);
      setImageUri(testCase.image_uri);
      setIsReleased(testCase.is_released);
      setReleaseAt(testCase.release_at);
      const mock = mockPost(`${baseUri}/setting/${service()}`)
        .withHeaders([["Content-Type", "application/json;charset=utf8"]])
        .willResolve({
          image_uri: testCase.image_uri,
          is_released: testCase.is_released,
          release_at: testCase.release_at,
        } as Setting);
      await updateSetting();
      // とりあえず呼び出しが行われたことだけを確認（戻り値は今のところ上手くテストできず）
      expect(mock).toHaveFetched();
      expect(mock).toHaveFetchedWithBody(
        JSON.stringify({
          image_uri: imageUri(),
          is_released: isReleased(),
          release_at: releaseAt(),
        } as Setting)
      );
      mock.clear();
    });
  });
});
