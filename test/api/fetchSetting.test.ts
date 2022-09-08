// @vitest-environment jsdom

import { expect, test } from "vitest";
import "vi-fetch/setup";
import { mockGet } from "vi-fetch";
import { Setting } from "../../src/type";
import { baseUri } from "../../src/api/apiHandler";
import { fetchSetting } from "../../src/api/fetchSetting";
import { service, setService } from "../../src/signal";

describe("fetchSetting", () => {
  const apiCall = [
    {
      service: "service1",
      image_uri: "00000000.dkr.ecr.ap-northeast-1.amazonaws.com/hoge:latest",
      is_released: true,
      release_at: new Date(),
    },
    {
      service: "service2",
      image_uri:
        "00000000.dkr.ecr.ap-northeast-1.amazonaws.com/fuga@sha256:4c716d4cf211c7b7d2f3233c941771ad0507ea5bacf93b492766aa41ae9f720d",
      is_released: false,
      release_at: new Date(),
    },
    {
      service: "service3",
      image_uri: undefined,
      is_released: false,
      release_at: undefined,
    },
  ];
  apiCall.forEach((testCase) => {
    test(`リリース設定 API 呼び出し（読み取り：service=${testCase.service}）`, async () => {
      setService(testCase.service);
      const mock = mockGet(`${baseUri}/setting/${service()}`).willResolve({
        imageg_uri: testCase.image_uri,
        is_released: testCase.is_released,
        release_at: testCase.release_at,
      } as Setting);
      await fetchSetting();
      // とりあえず呼び出しが行われたことだけを確認（戻り値は今のところ上手くテストできず）
      expect(mock).toHaveFetched();
      mock.clear();
    });
  });
});
