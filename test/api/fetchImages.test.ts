// @vitest-environment jsdom

import { expect, test } from "vitest";
import "vi-fetch/setup";
import { mockGet } from "vi-fetch";
import { ImageItem } from "../../src/type";
import { baseUri } from "../../src/api/apiHandler";
import { fetchImages } from "../../src/api/fetchImages";
import {
  repository,
  service,
  setRepository,
  setService,
} from "../../src/signal";

describe("fetchImages", () => {
  const apiCall = [
    {
      service: "service1",
      repository: "hoge",
      digest:
        "sha256:4c716d4cf211c7b7d2f3233c941771ad0507ea5bacf93b492766aa41ae9f720d",
      pushed_at: new Date(),
      repository_name: "hoge",
      size: 10000,
      tags: ["latest", "hogera"],
      uri: "00000000.dkr.ecr.ap-northeast-1.amazonaws.com/hoge:latest",
    },
    {
      service: "service2",
      repository: "fuga",
      digest:
        "sha256:4c716d4cf211c7b7d2f3233c941771ad0507ea5bacf93b492766aa41ae9f720d",
      pushed_at: new Date(),
      repository_name: "fuga",
      size: 2000000,
      tags: null,
      uri: "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/hoge@sha256:4c716d4cf211c7b7d2f3233c941771ad0507ea5bacf93b492766aa41ae9f720d",
    },
  ];
  apiCall.forEach((testCase) => {
    test(`コンテナイメージ API 呼び出し（service=${testCase.service}, repository=${testCase.repository}）`, async () => {
      setService(testCase.service);
      setRepository(testCase.repository);
      const mock = mockGet(
        `${baseUri}/images/${service()}/${repository()}`
      ).willResolve({
        digest: testCase.digest,
        pushed_at: testCase.pushed_at,
        repository_name: testCase.repository_name,
        size: testCase.size,
        tags: testCase.tags,
        uri: testCase.uri,
      } as ImageItem);
      await fetchImages();
      // とりあえず呼び出しが行われたことだけを確認（戻り値は今のところ上手くテストできず）
      expect(mock).toHaveFetched();
      mock.clear();
    });
  });
});
