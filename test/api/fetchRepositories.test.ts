// @vitest-environment jsdom

import { expect, test, vi } from "vitest";
import "vi-fetch/setup";
import { mockFetch, mockGet } from "vi-fetch";
import { RepositoryItem } from "../../src/type";
import { baseUri } from "../../src/api/apiHandler";
import { fetchRepositories } from "../../src/api/fetchRepositories";
import { service, setService } from "../../src/signal";

describe("fetchRepositories", () => {
  beforeEach(() => {
    mockFetch.clearAll();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });
  const apiCall = [
    {
      service: "service1",
      name: "hoge",
      uri: "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/hoge",
    },
    {
      service: "service2",
      name: "fuga",
      uri: "000000000000.dkr.ecr.ap-northeast-1.amazonaws.com/fuga",
    },
  ];
  apiCall.forEach((testCase) => {
    test(`コンテナリポジトリ一覧 API 呼び出し（service=${testCase.service}）`, async () => {
      setService(testCase.service);
      const mock = mockGet(`${baseUri}/repositories/${service()}`).willResolve([
        {
          name: testCase.name,
          uri: testCase.uri,
        },
      ] as RepositoryItem[]);
      await fetchRepositories();
      // とりあえず呼び出しが行われたことだけを確認（戻り値は今のところ上手くテストできず）
      expect(mock).toHaveFetched();
    });
  });
});
